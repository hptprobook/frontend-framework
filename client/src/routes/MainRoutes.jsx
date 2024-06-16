// ==============================|| AUTH ROUTING ||============================== //

import { Fragment } from 'react';
import { Navigate } from 'react-router-dom';
import useAuthStatus from '~/hooks/useAuthStatus';
import MainLayout from '~/layouts/MainLayout';
import AuthPage from '~/pages/Auth/AuthPage';
import HomePage from '~/pages/Home/HomePage';

const ProtectedLayout = ({ children }) => {
  const isLoggedIn = useAuthStatus();

  if (isLoggedIn) {
    return <Navigate to="/w" />;
  }

  return <Fragment>{children}</Fragment>;
};

const AuthRoutes = {
  path: '/',
  element: (
    <ProtectedLayout>
      <MainLayout />
    </ProtectedLayout>
  ),
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
