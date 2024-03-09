import Box from '@mui/material/Box';
import Card from './Card/Card';

function ListCards() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        p: '0 5px',
        m: '0 5px',
        overflowX: 'hidden',
        overflowY: 'auto',
        maxHeight: (theme) =>
          `calc(${theme.height.boardContentHeight} - ${theme.spacing(5)} - ${theme.height.columnHeaderHeight} - ${
            theme.height.columnFooterHeight
          })`,
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
      <Card />
      <Card temporaryHideMedia />
      <Card temporaryHideMedia />
      <Card temporaryHideMedia />
      <Card temporaryHideMedia />
      <Card temporaryHideMedia />
      <Card temporaryHideMedia />
    </Box>
  );
}

export default ListCards;
