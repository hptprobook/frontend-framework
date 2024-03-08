import Box from '@mui/material/Box';

function BoardContent() {
  return (
    <Box
      sx={{
        backgroundColor: 'primary.main',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        height: (theme) => `calc(100vh - ${theme.height.appBar} - ${theme.height.boardBar})`,
      }}
    >
      Box Content
    </Box>
  );
}

export default BoardContent;
