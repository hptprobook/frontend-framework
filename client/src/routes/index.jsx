import { useRoutes } from 'react-router-dom';
import BoardRoutes from './BoardRoutes';
import MainRoutes from './MainRoutes';

// ==============================|| ROUTING RENDER ||============================== //

export default function Routes() {
  return useRoutes([MainRoutes, BoardRoutes]);
}
