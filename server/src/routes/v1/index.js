import express from 'express';
import verifyAccessToken from '~/middlewares';
import { StatusCodes } from 'http-status-codes';
import { boardRoute } from './boardRoute';
import { columnRoute } from './columnRoute';
import { cardRoute } from './cardRoute';
import { authRoute } from './authRoute';
import { userRoute } from './userRoute';
import { workspaceRoute } from './workspaceRoute';

const Router = express.Router();

Router.get('/status', (req, res) => {
  res.status(StatusCodes.OK).json({
    message: 'APIs v1 are ready to use.',
  });
});

/* Auth APIs */
Router.use('/auth', authRoute);

/* User APIs */
Router.use('/users', verifyAccessToken, userRoute);

/* Workspace APIs */
Router.use('/w', verifyAccessToken, workspaceRoute);

/* Board APIs */
Router.use('/boards', verifyAccessToken, boardRoute);

/* Column APIs */
Router.use('/columns', verifyAccessToken, columnRoute);

/* Card APIs */
Router.use('/cards', verifyAccessToken, cardRoute);

export const APIs_V1 = Router;
