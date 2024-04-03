import { lazy, Suspense, Fragment } from 'react';
import CircularLoading from '~/components/Loading/CircularLoading';
import useAuthStatus from '~/hooks/useAuthStatus';
import { Navigate } from 'react-router-dom';

const BoardLayout = lazy(() => import('~/layouts/BoardLayout'));
const BoardDetails = lazy(() => import('~/pages/Boards/_id'));
const Board = lazy(() => import('~/pages/Boards/Board'));

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
        <BoardLayout />
      </ProtectedLayout>
    </Suspense>
  ),

  children: [
    {
      path: '',
      element: <Board />,
    },
    {
      path: ':id',
      element: <BoardDetails />,
    },
  ],
};

export default MainRoutes;
