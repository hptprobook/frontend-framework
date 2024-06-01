import express from 'express';
import { columnValidation } from '~/validations/columnValidation';
import { columnController } from '~/controllers/columnController';

const Router = express.Router();

Router.route('/').post(columnValidation.createNew, columnController.createNew);

Router.route('/:id')
  .put(columnValidation.update, columnController.update)
  .delete(columnValidation.remove, columnController.remove);

Router.route('/:id/title').put(columnController.changeTitle);

export const columnRoute = Router;
