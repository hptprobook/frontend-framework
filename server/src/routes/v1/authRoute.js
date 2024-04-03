import express from 'express';
import { userController } from '~/controllers/userController';
import { userValidation } from '~/validations/userValidation';

const Router = express.Router();

Router.post('/google', userValidation.createNew, userController.createNew);

export const authRoute = Router;
