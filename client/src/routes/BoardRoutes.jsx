import { lazy } from 'react';

const BoardLayout = lazy(() => import('~/layouts/BoardLayout'));
const BoardDetails = lazy(() => import('~/pages/Boards/_id'));
const Board = lazy(() => import('~/pages/Boards/Board'));

const MainRoutes = {
  path: 'boards',
  element: <BoardLayout />,
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
