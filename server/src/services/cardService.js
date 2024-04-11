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
    if (!card) throw new ApiError(StatusCodes.NOT_FOUND, 'Card not found');

    return card;
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
    await cardModel.addTodo(cardId, reqBody);
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
  remove,
};
