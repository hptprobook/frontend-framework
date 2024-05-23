import { Outlet } from 'react-router-dom';
import AppBar from '~/components/AppBar/AppBar';
import Container from '@mui/material/Container';

export default function PageLayout() {
  return (
    <Container
      disableGutters
      maxWidth={false}
      sx={{
        height: '100vh',
      }}
    >
      <AppBar />
      <Outlet />
    </Container>
  );
}
