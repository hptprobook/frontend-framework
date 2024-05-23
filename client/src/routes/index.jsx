import { useRoutes } from 'react-router-dom';
import BoardRoutes from './BoardRoutes';
import MainRoutes from './MainRoutes';
import WorkspaceRoute from './WorkspaceRoutes';

// ==============================|| ROUTING RENDER ||============================== //

export default function Routes() {
  return useRoutes([MainRoutes, WorkspaceRoute, BoardRoutes]);
}
