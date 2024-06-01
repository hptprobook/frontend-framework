import { Box } from '@mui/material';
import {
  SortableContext,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import Column from './Column';
import AddColumnForm from './sections/AddColumnForm';

function ListColums({
  columns,
  createNewColumn,
  createNewCard,
  handleDeleteColumn,
  handleDeleteCard,
}) {
  /* SortableContext yêu cầu items là một dạng mảng dữ liệu thông thường chứ không phải dạng mảng object */
  return (
    <SortableContext
      items={columns?.map((c) => c._id)}
      strategy={horizontalListSortingStrategy}
    >
      <Box
        sx={{
          bgcolor: 'inherit',
          width: '100%',
          display: 'flex',
          height: '100%',
          overflowX: 'auto',
          overflowY: 'hidden',
          '&::-webkit-scrollbar-track': {
            m: 2,
          },
        }}
      >
        {columns?.map((column) => (
          <Column
            key={column?._id}
            column={column}
            createNewCard={createNewCard}
            handleDeleteColumn={handleDeleteColumn}
            handleDeleteCard={handleDeleteCard}
          />
        ))}

        {/* Box Add new column */}
        <AddColumnForm createNewColumn={createNewColumn} />
      </Box>
    </SortableContext>
  );
}

export default ListColums;
