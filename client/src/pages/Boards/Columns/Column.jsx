import { useState } from 'react';
import { Box } from '@mui/material';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import ListCards from '../Cards/ListCards';
import ColumnHeader from './sections/ColumnHeader';
import ColumnFooter from './sections/ColumnFooter';

function Column({
  column,
  createNewCard,
  handleDeleteColumn,
  handleDeleteCard,
}) {
  const orderedCards = column.cards;

  const [openNewCardForm, setOpenNewCardForm] = useState(false);

  const toggleOpenNewCardForm = () => setOpenNewCardForm(!openNewCardForm);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column?._id,
    data: { ...column },
  });

  const dndKitColumnStyles = {
    transform: CSS.Translate.toString(transform),
    transition,
    height: '100%',
    opacity: isDragging ? 0.4 : undefined,
  };

  return (
    <div ref={setNodeRef} style={dndKitColumnStyles} {...attributes}>
      <Box
        {...listeners}
        sx={{
          minWidth: '300px',
          maxWidth: '300px',
          bgcolor: (theme) =>
            theme.palette.mode === 'dark' ? '#333643' : '#ebecf0',
          ml: 2,
          borderRadius: '6px',
          height: 'fit-content',
          maxHeight: (theme) =>
            `calc(${theme.height.boardContentHeight} - ${theme.spacing(5)})`,
        }}
      >
        {/* Box Column Header */}
        <ColumnHeader
          column={column}
          handleDeleteColumn={handleDeleteColumn}
          openNewCardForm={openNewCardForm}
          toggleOpenNewCardForm={toggleOpenNewCardForm}
          setOpenNewCardForm={setOpenNewCardForm}
        />

        {/* List Cards */}
        <ListCards
          cards={orderedCards}
          handleDeleteCard={handleDeleteCard}
          columnName={column?.title}
        />

        {/* Box Column Footer */}
        <ColumnFooter column={column} createNewCard={createNewCard} />
      </Box>
    </div>
  );
}

export default Column;
