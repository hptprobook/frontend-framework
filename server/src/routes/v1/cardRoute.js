import express from 'express';
import { cardValidation } from '~/validations/cardValidation';
import { cardController } from '~/controllers/cardController';
import { cardTodoController } from '~/controllers/cardTodoController';
import { cardCommentController } from '~/controllers/cardCommentController';

const Router = express.Router();

/* For Card */

Router.route('/').post(cardValidation.createNew, cardController.createNew);
Router.route('/:id')
  .get(cardController.getDetails)
  .put(cardValidation.update, cardController.update)
  .delete(cardValidation.remove, cardController.remove);

/* For Todo of Card */

Router.route('/:id/addTodo')
  .put(cardTodoController.addTodo)
  .post(cardTodoController.addTodoChild);

Router.route('/:id/todos/:todoId')
  .put(cardTodoController.updateTodo)
  .delete(cardTodoController.deleteTodo);

Router.route('/:id/todos/:todoId/child/:childId')
  .put(cardTodoController.updateTodoChild)
  .delete(cardTodoController.deleteTodoChild);

Router.route('/:id/child/:childId/done').put(cardTodoController.childDone);

/* For Comment of Card */

Router.route('/:id/comments').post(cardCommentController.addComment);
Router.route('/:id/comments/:commentId')
  .put(cardCommentController.replyComment)
  .delete(cardCommentController.deleteComment);

Router.route('/:id/comments/:commentId/reactions')
  .get(cardCommentController.removeCommentReaction)
  .put(cardCommentController.updateCommentReaction);

Router.route('/:id/:commentId/:replyId/reactions')
  .get(cardCommentController.removeReplyCommentReaction)
  .put(cardCommentController.updateReplyCommentReaction);

Router.route('/:id/comments/:commentId/edit').put(
  cardCommentController.updateComment
);

Router.route('/:id/comments/:commentId/replies/:replyId').put(
  cardCommentController.updateReplyComment
);

Router.route('/:id/comments/:commentId/replies/:replyId').delete(
  cardCommentController.deleteReplyComment
);

export const cardRoute = Router;
