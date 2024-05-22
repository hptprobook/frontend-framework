import express from 'express';
import { workspaceValidation } from '~/validations/workspaceValidation';
import { workspaceController } from '~/controllers/workspaceController';

const Router = express.Router();

Router.route('/')
  .get(workspaceController.getAll)
  .post(workspaceValidation.createNew, workspaceController.createNew);

export const workspaceRoute = Router;
