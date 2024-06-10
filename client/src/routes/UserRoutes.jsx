import { lazy, Suspense, Fragment } from 'react';
import CircularLoading from '~/components/Loading/CircularLoading';
import useAuthStatus from '~/hooks/useAuthStatus';
import { Navigate } from 'react-router-dom';
import PageLayout from '~/layouts/PageLayout';

const ProfilePage = lazy(() => import('~/pages/Users/ProfilePage'));

const ProtectedLayout = ({ children }) => {
  const isLoggedIn = useAuthStatus();

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  return <Fragment>{children}</Fragment>;
};

const UserRoutes = {
  path: 'profile',
  element: (
    <Suspense fallback={<CircularLoading />}>
      <ProtectedLayout>
        <PageLayout />
      </ProtectedLayout>
    </Suspense>
  ),

  children: [
    {
      path: '',
      element: <ProfilePage />,
    },
  ],
};

export default UserRoutes;
