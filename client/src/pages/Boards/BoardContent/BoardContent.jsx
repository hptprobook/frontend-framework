import Box from '@mui/material/Box';
import ListColums from './ListColumns/ListColums';

function BoardContent() {
  return (
    <Box
      sx={{
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
        width: '100%',
        p: '10px 0',
        height: (theme) => theme.height.boardContentHeight,
      }}
    >
      <ListColums />
    </Box>
  );
}

export default BoardContent;
