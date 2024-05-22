import express from 'express';
import { workspaceValidation } from '~/validations/workspaceValidation';
import { workspaceController } from '~/controllers/workspaceController';

const Router = express.Router();

Router.route('/')
  .get(workspaceController.getAll)
  .post(workspaceValidation.createNew, workspaceController.createNew);

Router.route('/:id')
  .get(workspaceController.getDetail)
  .put(workspaceValidation.update, workspaceController.update)
  .delete(workspaceController.remove);

export const workspaceRoute = Router;
