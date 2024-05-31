import { cardModel } from '~/models/cardModel';
import { columnModel } from '~/models/columnModel';
import ApiError from '~/utils/ApiError';
import { StatusCodes } from 'http-status-codes';

const createNew = async (reqBody) => {
  try {
    const createdCard = await cardModel.createNew({
      ...reqBody,
    });

    const getNewCard = await cardModel.findOneById(createdCard.insertedId);

    if (getNewCard) await columnModel.pushCardOrderIds(getNewCard);

    return getNewCard;
  } catch (error) {
    throw error;
  }
};

const getDetails = async (cardId) => {
  try {
    const card = await cardModel.findOneById(cardId);
    const column = await columnModel.findOneById(card.columnId);
    if (!card) throw new ApiError(StatusCodes.NOT_FOUND, 'Card not found');

    const result = {
      ...card,
      columnName: column.title,
    };

    return result;
  } catch (error) {
    throw error;
  }
};

const update = async (cardId, reqBody) => {
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now(),
    };
    const updatedCard = await cardModel.update(cardId, updateData);

    return updatedCard;
  } catch (error) {
    throw error;
  }
};

const addTodo = async (cardId, reqBody) => {
  try {
    return await cardModel.addTodo(cardId, reqBody);
  } catch (error) {
    throw error;
  }
};

const addTodoChild = async (cardId, reqBody) => {
  try {
    await cardModel.addTodoChild(cardId, reqBody);
  } catch (error) {
    throw error;
  }
};

const childDone = async (cardId, reqBody) => {
  try {
    await cardModel.childDone(cardId, reqBody);
  } catch (error) {
    throw error;
  }
};

const updateTodo = async (cardId, todoId, reqBody) => {
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now(),
    };
    const updatedCard = await cardModel.updateTodo(cardId, todoId, updateData);

    return updatedCard;
  } catch (error) {
    throw error;
  }
};

const updateTodoChild = async (cardId, todoId, childId, reqBody) => {
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now(),
    };
    const updatedCard = await cardModel.updateTodoChild(
      cardId,
      todoId,
      childId,
      updateData
    );

    return updatedCard;
  } catch (error) {
    throw error;
  }
};

const addComment = async (cardId, commentData) => {
  try {
    const addedComment = await cardModel.addComment(cardId, commentData);
    return addedComment;
  } catch (error) {
    throw error;
  }
};

const replyComment = async (cardId, commentId, replyData) => {
  try {
    return await cardModel.replyComment(cardId, commentId, replyData);
  } catch (error) {
    throw error;
  }
};

const deleteTodo = async (cardId, todoId) => {
  try {
    await cardModel.deleteTodo(cardId, todoId);
  } catch (error) {
    throw error;
  }
};

const deleteTodoChild = async (cardId, todoId, childId) => {
  try {
    await cardModel.deleteTodoChild(cardId, todoId, childId);
  } catch (error) {
    throw error;
  }
};

const remove = async (cardId) => {
  try {
    const targetCard = await cardModel.findOneById(cardId);

    if (!targetCard) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Column not found!');
    }

    await cardModel.deleteOneById(cardId);

    await columnModel.pullCardOrderIds(targetCard);

    return { deleteResult: 'Card deleted successfully!' };
  } catch (error) {
    throw error;
  }
};

export const cardService = {
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
