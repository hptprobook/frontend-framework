import { StatusCodes } from 'http-status-codes';
import { cardService } from '~/services/cardService';

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
    const todoAdded = await cardService.addTodo(req.params.id, req.body);

    res.status(StatusCodes.OK).json(todoAdded);
  } catch (error) {
    next(error);
  }
};

const addTodoChild = async (req, res, next) => {
  try {
    await cardService.addTodoChild(req.params.id, req.body);

    res.status(StatusCodes.OK).json({ success: true });
  } catch (error) {
    next(error);
  }
};

const childDone = async (req, res, next) => {
  try {
    await cardService.childDone(req.params.id, req.body);

    res.status(StatusCodes.OK).json({ success: true });
  } catch (error) {
    next(error);
  }
};

const updateTodo = async (req, res, next) => {
  try {
    const updatedCard = await cardService.updateTodo(
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
    const updatedCard = await cardService.updateTodoChild(
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

// const addComment = async (req, res, next) => {
//   console.log('post comment');
//   try {
//     const addedComment = await cardService.addComment(req.params.id, req.body);

//     res.status(StatusCodes.OK).json(addedComment);
//   } catch (error) {
//     next(error);
//   }
// };

const addComment = async (req, res, next) => {
  try {
    const addedComment = await cardService.addComment(req.params.id, req.body);

    if (addedComment) {
      req.io.emit('comment', addedComment);
    }

    res.status(StatusCodes.OK).json(addedComment);
  } catch (error) {
    next(error);
  }
};

const replyComment = async (req, res, next) => {
  try {
    const comment = await cardService.replyComment(
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

const deleteTodo = async (req, res, next) => {
  try {
    await cardService.deleteTodo(req.params.id, req.params.todoId);

    res.status(StatusCodes.NO_CONTENT).json({ success: true });
  } catch (error) {
    next(error);
  }
};

const deleteTodoChild = async (req, res, next) => {
  try {
    await cardService.deleteTodoChild(
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
  childDone,
  updateTodo,
  updateTodoChild,
  addComment,
  replyComment,
  deleteTodo,
  deleteTodoChild,
  remove,
};
