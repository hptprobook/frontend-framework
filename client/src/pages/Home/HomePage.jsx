import { Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <Box
      sx={{
        width: '400px',
        p: 3,
        bgcolor: '#fff',
        boxShadow: '2xl',
        borderRadius: '5px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Link to={'/login'}>
        <Button variant={'outlined'}>Login</Button>
      </Link>
    </Box>
  );
}
