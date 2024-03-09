import Box from '@mui/material/Box';
import Column from './Column/Column';
import Button from '@mui/material/Button';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';

function ListColums() {
  return (
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
      <Column />
      <Column />
      <Column />

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
  );
}

export default ListColums;
