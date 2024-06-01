import { lazy, Suspense, Fragment } from 'react';
import CircularLoading from '~/components/Loading/CircularLoading';
import useAuthStatus from '~/hooks/useAuthStatus';
import { Navigate } from 'react-router-dom';

const PageLayout = lazy(() => import('~/layouts/PageLayout'));
const BoardDetails = lazy(() => import('~/pages/Boards/BoardDetail'));

const ProtectedLayout = ({ children }) => {
  const isLoggedIn = useAuthStatus();

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  return <Fragment>{children}</Fragment>;
};

const MainRoutes = {
  path: 'boards',
  element: (
    <Suspense fallback={<CircularLoading />}>
      <ProtectedLayout>
        <PageLayout />
      </ProtectedLayout>
    </Suspense>
  ),

  children: [
    {
      path: ':id',
      element: <BoardDetails />,
    },
  ],
};

export default MainRoutes;
