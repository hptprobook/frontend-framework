import Box from '@mui/material/Box';
import BoardColumn from '~/components/BoardColumn';

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
        {/* Box Column */}
        <BoardColumn />
        <BoardColumn />
        <BoardColumn />
        <BoardColumn />
        <BoardColumn />
        <BoardColumn />
        <BoardColumn />
      </Box>
    </Box>
  );
}

export default BoardContent;
