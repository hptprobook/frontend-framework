import express from 'express';
import { cardValidation } from '~/validations/cardValidation';
import { cardController } from '~/controllers/cardController';

const Router = express.Router();

Router.route('/').post(cardValidation.createNew, cardController.createNew);
Router.route('/:id')
  .get(cardController.getDetails)
  .put(cardValidation.update, cardController.update)
  .delete(cardValidation.remove, cardController.remove);

Router.route('/:id/addTodo')
  .put(cardController.addTodo)
  .post(cardController.addTodoChild);

Router.route('/:id/childDone').put(cardController.childDone);

export const cardRoute = Router;
