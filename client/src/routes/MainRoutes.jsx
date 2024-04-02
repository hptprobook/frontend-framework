// ==============================|| AUTH ROUTING ||============================== //

import MainLayout from '~/layouts/MainLayout';
import AuthPage from '~/pages/Auth/AuthPage';
import HomePage from '~/pages/Home/HomePage';

const AuthRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '',
      element: <HomePage />,
    },
    {
      path: '/login',
      element: <AuthPage />,
    },
  ],
};

export default AuthRoutes;
