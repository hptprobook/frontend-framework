import { Outlet } from 'react-router-dom';
import AppBar from '~/components/AppBar/AppBar';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import { Suspense } from 'react';

export default function BoardLayout() {
  return (
    <Suspense>
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
    </Suspense>
  );
}
