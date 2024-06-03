import { StatusCodes } from 'http-status-codes';
import { cardCommentServices } from '~/services/cardCommentService';
import { cardService } from '~/services/cardService';
import { cardTodoServices } from '~/services/cardTodoService';

const createNew = async (req, res, next) => {
  try {
    const createdCard = await cardService.createNew(req.body);

    if (createdCard) req.io.emit('newCard', createdCard);

    res.status(StatusCodes.CREATED).json(createdCard);
  } catch (error) {
    next(error);
  }
};

const getDetails = async (req, res, next) => {
  try {
    const card = await cardService.getDetails(req.params.id);
    res.status(StatusCodes.OK).json(card);
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const updatedCard = await cardService.update(req.params.id, req.body);

    res.status(StatusCodes.OK).json(updatedCard);
  } catch (error) {
    next(error);
  }
};

const addTodo = async (req, res, next) => {
  try {
    const todoAdded = await cardTodoServices.addTodo(req.params.id, req.body);

    res.status(StatusCodes.OK).json(todoAdded);
  } catch (error) {
    next(error);
  }
};

const addTodoChild = async (req, res, next) => {
  try {
    const createdTodoChild = await cardTodoServices.addTodoChild(
      req.params.id,
      req.body
    );

    res.status(StatusCodes.OK).json(createdTodoChild);
  } catch (error) {
    next(error);
  }
};

// const childDone = async (req, res, next) => {
//   try {
//     await cardTodoServices.childDone(req.params.id, req.body);

//     res.status(StatusCodes.OK).json({ success: true });
//   } catch (error) {
//     next(error);
//   }
// };

const updateTodo = async (req, res, next) => {
  try {
    const updatedCard = await cardTodoServices.updateTodo(
      req.params.id,
      req.params.todoId,
      req.body
    );

    res.status(StatusCodes.OK).json(updatedCard);
  } catch (error) {
    next(error);
  }
};

const updateTodoChild = async (req, res, next) => {
  try {
    const updatedCard = await cardTodoServices.updateTodoChild(
      req.params.id,
      req.params.todoId,
      req.params.childId,
      req.body
    );

    res.status(StatusCodes.OK).json(updatedCard);
  } catch (error) {
    next(error);
  }
};

const addComment = async (req, res, next) => {
  try {
    const addedComment = await cardCommentServices.addComment(
      req.params.id,
      req.body
    );

    if (addedComment) {
      req.io.emit('comment', addedComment);
    }

    res.status(StatusCodes.OK).json(addedComment);
  } catch (error) {
    next(error);
  }
};

const updateCommentReaction = async (req, res, next) => {
  try {
    const updatedComment = await cardCommentServices.updateCommentReaction(
      req.params.id,
      req.params.commentId,
      req.userId,
      req.body.reactionType
    );

    req.io.emit('commentReaction', updatedComment);

    res.status(StatusCodes.OK).json(updatedComment);
  } catch (error) {
    next(error);
  }
};

const replyComment = async (req, res, next) => {
  try {
    const comment = await cardCommentServices.replyComment(
      req.params.id,
      req.params.commentId,
      req.body
    );

    if (comment) {
      req.io.emit('replyComment', comment);
    }

    res.status(StatusCodes.OK).json(comment);
  } catch (error) {
    next(error);
  }
};

const updateReplyCommentReaction = async (req, res, next) => {
  try {
    const updatedComment = await cardCommentServices.updateReplyCommentReaction(
      req.params.id,
      req.params.commentId,
      req.params.replyId,
      req.userId,
      req.body.reactionType
    );

    req.io.emit('replyCommentReaction', updatedComment);

    res.status(StatusCodes.OK).json(updatedComment);
  } catch (error) {
    next(error);
  }
};

const removeCommentReaction = async (req, res, next) => {
  try {
    const updatedComment = await cardCommentServices.removeCommentReaction(
      req.params.id,
      req.params.commentId,
      req.userId
    );

    req.io.emit('removeCommentReaction', updatedComment);

    res.status(StatusCodes.OK).json(updatedComment);
  } catch (error) {
    next(error);
  }
};

const removeReplyCommentReaction = async (req, res, next) => {
  try {
    const updatedComment = await cardCommentServices.removeReplyCommentReaction(
      req.params.id,
      req.params.commentId,
      req.params.replyId,
      req.userId
    );

    req.io.emit('removeReplyCommentReaction', updatedComment);

    res.status(StatusCodes.OK).json(updatedComment);
  } catch (error) {
    next(error);
  }
};

const deleteTodo = async (req, res, next) => {
  try {
    await cardTodoServices.deleteTodo(req.params.id, req.params.todoId);

    res.status(StatusCodes.NO_CONTENT).json({ success: true });
  } catch (error) {
    next(error);
  }
};

const deleteTodoChild = async (req, res, next) => {
  try {
    await cardTodoServices.deleteTodoChild(
      req.params.id,
      req.params.todoId,
      req.params.childId
    );

    res.status(StatusCodes.NO_CONTENT).json({ success: true });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const result = await cardService.remove(req.params.id);

    if (result) req.io.emit('deleteCard', req.params.id);

    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};

export const cardController = {
  createNew,
  getDetails,
  update,
  addTodo,
  addTodoChild,
  updateTodo,
  updateTodoChild,
  addComment,
  updateCommentReaction,
  replyComment,
  updateReplyCommentReaction,
  removeCommentReaction,
  removeReplyCommentReaction,
  deleteTodo,
  deleteTodoChild,
  remove,
};
