import { Box, Container, Grid } from '@mui/material';
import { NavLink, Outlet } from 'react-router-dom';
import AppBar from '~/components/AppBar/AppBar';

export default function WorkspaceLayout() {
  const getNavLinkStyle = (isActive) => ({
    padding: '6px 20px',
    borderRadius: '8px',
    color: isActive ? '#0c66e4' : '#172b4d',
    fontWeight: '500',
    fontSize: '14px',
    mt: 1,
    backgroundColor: isActive ? '#e9f2ff' : 'transparent', // Thay đổi màu nền nếu active

    '&:hover': {
      backgroundColor: isActive ? '#e9f2ff' : '#091e4224',
    },
  });

  return (
    <Container
      disableGutters
      maxWidth={false}
      sx={{
        height: '100vh',
      }}
    >
      <AppBar />
      <Container
        sx={{
          mt: 4,
        }}
      >
        <Grid container spacing={3}>
          <Grid item xs={2.5}>
            <NavLink to="/w">
              {({ isActive }) => (
                <Box sx={getNavLinkStyle(isActive)}>Board</Box>
              )}
            </NavLink>
            <NavLink to="/">
              {({ isActive }) => <Box sx={getNavLinkStyle(isActive)}>Home</Box>}
            </NavLink>
          </Grid>
          <Grid item xs={9.5}>
            <Outlet />
          </Grid>
        </Grid>
      </Container>
    </Container>
  );
}
