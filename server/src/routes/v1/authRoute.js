import express from 'express';
import { authController } from '~/controllers/authController';
import { userValidation } from '~/validations/userValidation';

const Router = express.Router();

Router.post('/google', userValidation.createNew, authController.loginGoogle);

Router.post(
  '/phone',
  userValidation.createNewWithPhoneNumber,
  authController.loginWithPhoneNumber
);

Router.post('/refresh', authController.refreshToken);

export const authRoute = Router;
