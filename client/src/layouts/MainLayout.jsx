import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';

export default function MainLayout() {
  return (
    <Box
      sx={{
        background:
          'url("https://gcs.tripi.vn/public-tripi/tripi-feed/img/474091map/anh-nen-2k-dep-nhat_094443817.jpg") no-repeat center',
        width: '100vw',
        height: '100vh',
        backgroundSize: 'cover',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Outlet />
    </Box>
  );
}
