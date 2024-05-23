import { lazy, Suspense, Fragment } from 'react';
import CircularLoading from '~/components/Loading/CircularLoading';
import useAuthStatus from '~/hooks/useAuthStatus';
import { Navigate } from 'react-router-dom';

const Workspace = lazy(() => import('~/pages/Workspaces/Workspaces'));
const WorkspaceLayout = lazy(() => import('~/layouts/WorkspaceLayout'));
const WorkspaceDetail = lazy(() => import('~/pages/Workspaces/_id'));

const ProtectedLayout = ({ children }) => {
  const isLoggedIn = useAuthStatus();

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  return <Fragment>{children}</Fragment>;
};

const WorkspaceRoute = {
  path: 'w',
  element: (
    <Suspense fallback={<CircularLoading />}>
      <ProtectedLayout>
        <WorkspaceLayout />
      </ProtectedLayout>
    </Suspense>
  ),

  children: [
    {
      path: '',
      element: <Workspace />,
    },
    {
      path: ':id',
      element: <WorkspaceDetail />,
    },
  ],
};

export default WorkspaceRoute;
