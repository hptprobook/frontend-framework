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

// Router.route('/:id/childDone').put(cardController.childDone);

Router.route('/:id/todos/:todoId')
  .put(cardController.updateTodo)
  .delete(cardController.deleteTodo);

Router.route('/:id/todos/:todoId/child/:childId')
  .put(cardController.updateTodoChild)
  .delete(cardController.deleteTodoChild);

Router.route('/:id/comments').post(cardController.addComment);
Router.route('/:id/comments/:commentId').put(cardController.replyComment);

Router.route('/:id/comments/:commentId/reactions')
  .get(cardController.removeCommentReaction)
  .put(cardController.updateCommentReaction);

Router.route('/:id/:commentId/:replyId/reactions')
  .get(cardController.removeReplyCommentReaction)
  .put(cardController.updateReplyCommentReaction);

export const cardRoute = Router;
