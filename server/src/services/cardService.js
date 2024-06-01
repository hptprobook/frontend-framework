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
  remove,
};
