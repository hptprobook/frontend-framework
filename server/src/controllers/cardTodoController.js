import { StatusCodes } from 'http-status-codes';
import { cardTodoServices } from '~/services/cardTodoService';

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

const childDone = async (req, res, next) => {
  try {
    await cardTodoServices.childDone(
      req.params.id,
      req.params.childId,
      req.body
    );

    res.status(StatusCodes.OK).json({ success: true });
  } catch (error) {
    next(error);
  }
};

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

export const cardTodoController = {
  addTodo,
  addTodoChild,
  childDone,
  updateTodo,
  updateTodoChild,
  deleteTodo,
  deleteTodoChild,
};
