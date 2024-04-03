import { Outlet } from 'react-router-dom';
import AppBar from '~/components/AppBar/AppBar';
import Container from '@mui/material/Container';
import { Box } from '@mui/material';

export default function BoardLayout() {
  return (
    <Container
      disableGutters
      maxWidth={false}
      sx={{
        height: '100vh',
      }}
    >
      <AppBar />
      <Box>
        <Outlet />
      </Box>
    </Container>
  );
}
