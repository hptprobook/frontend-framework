import { Box } from '@mui/material';
import Card from './Card/Card';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

function ListCards({ cards }) {
  return (
    <SortableContext
      items={cards?.map((c) => c._id)}
      strategy={verticalListSortingStrategy}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          p: '0 5px 8px 5px',
          m: '0 5px',
          overflowX: 'hidden',
          overflowY: 'auto',
          maxHeight: (theme) =>
            `calc(${theme.height.boardContentHeight} - ${theme.spacing(5)} - ${
              theme.height.columnHeaderHeight
            } - ${theme.height.columnFooterHeight})`,
          '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#ced0da',
            borderRadius: '24px',
            cursor: 'pointer',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: '#bfc2cf',
          },
        }}
      >
        {cards.map((card) => (
          <Card key={card?._id} card={card} />
        ))}
      </Box>
    </SortableContext>
  );
}

export default ListCards;
