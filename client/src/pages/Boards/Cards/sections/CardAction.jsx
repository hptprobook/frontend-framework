import { Box, Typography } from '@mui/material';

export default function CardAction({ text, icon, handleClick }) {
  return (
    <Box
      sx={{
        width: '100%',
        bgcolor: '#e4e6ea',
        px: 2,
        py: 1,
        borderRadius: '3px',
        mb: 1,
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        fontSize: '14px',
        cursor: 'pointer',
      }}
      onClick={handleClick}
    >
      {icon}
      <Typography
        sx={{
          mt: '1px',
        }}
      >
        {text}
      </Typography>
    </Box>
  );
}
