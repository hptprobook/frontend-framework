import { boardModel } from '~/models/boardModel';
import { cardModel } from '~/models/cardModel';
import { columnModel } from '~/models/columnModel';
import ApiError from '~/utils/ApiError';
import { StatusCodes } from 'http-status-codes';

const createNew = async (reqBody) => {
  try {
    const createdColumn = await columnModel.createNew({
      ...reqBody,
    });

    const getNewColumn = await columnModel.findOneById(
      createdColumn.insertedId
    );

    if (getNewColumn) {
      getNewColumn.cards = [];

      await boardModel.pushColumnOrderIds(getNewColumn);
    }

    return getNewColumn;
  } catch (error) {
    throw error;
  }
};

const update = async (columnId, reqBody) => {
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now(),
    };
    const updatedColumn = await columnModel.update(columnId, updateData);

    return updatedColumn;
  } catch (error) {
    throw error;
  }
};

const changeTitle = async (columnId, reqBody) => {
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now(),
    };
    const updatedColumn = await columnModel.update(columnId, updateData);

    return updatedColumn;
  } catch (error) {
    throw error;
  }
};

const remove = async (columnId) => {
  try {
    const targetCol = await columnModel.findOneById(columnId);

    if (!targetCol) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Column not found!');
    }

    await columnModel.deleteOneById(columnId);

    await cardModel.deleteManyByColumnId(columnId);

    await boardModel.pullColumnOrderIds(targetCol);

    return {
      deleteResult: 'Column and its Cards deleted successfully!',
      columnId,
    };
  } catch (error) {
    throw error;
  }
};

export const columnService = {
  createNew,
  update,
  changeTitle,
  remove,
};
