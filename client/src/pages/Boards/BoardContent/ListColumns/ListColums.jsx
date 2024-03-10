import Box from '@mui/material/Box';
import Column from './Column/Column';
import Button from '@mui/material/Button';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';

function ListColums({ columns }) {
  /* SortableContext yêu cầu items là một dạng mảng dữ liệu thông thường chứ không phải dạng mảng object */
  return (
    <SortableContext items={columns?.map((c) => c._id)} strategy={horizontalListSortingStrategy}>
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
          <Column key={column?._id} column={column} />
        ))}

        {/* Box Add new column */}
        <Box
          sx={{
            minWidth: '300px',
            maxWidth: '300px',
            bgcolor: '#ffffff3d',
            mx: 2,
            borderRadius: '6px',
            height: 'fit-content',
          }}
        >
          <Button
            startIcon={<PlaylistAddIcon />}
            sx={{
              color: '#fff',
              width: '100%',
              justifyContent: 'flex-start',
              pl: 4,
              py: 1.2,
            }}
          >
            Add new column
          </Button>
        </Box>
      </Box>
    </SortableContext>
  );
}

export default ListColums;
