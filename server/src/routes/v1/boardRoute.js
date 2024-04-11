import express from 'express';
import { boardValidation } from '~/validations/boardValidation';
import { boardController } from '~/controllers/boardController';

const Router = express.Router();

Router.route('/')
  .get(boardController.getAll)
  .post(boardValidation.createNew, boardController.createNew);

Router.route('/invited').get(boardController.getAllBoardInvited);

Router.route('/:id')
  .get(boardController.getDetails)
  .put(boardValidation.update, boardController.update)
  .delete(boardValidation.remove, boardController.remove);

Router.route('/supports/moving_card').put(
  boardValidation.moveCardDifferentColumn,
  boardController.moveCardDifferentColumn
);

export const boardRoute = Router;
