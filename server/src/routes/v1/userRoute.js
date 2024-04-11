import express from 'express';
import { userController } from '~/controllers/userController';

const Router = express.Router();

Router.route('/current').get(userController.getCurrent);

Router.route('/find').post(userController.findUser);

Router.route('/readNotify').post(userController.update);

export const userRoute = Router;
