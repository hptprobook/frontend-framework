import { boardModel } from '~/models/boardModel';
import { columnModel } from '~/models/columnModel';

const createNew = async (reqBody) => {
  try {
    const createdColumn = await columnModel.createNew({
      ...reqBody,
    });

    const getNewColumn = await columnModel.findOneById(createdColumn.insertedId);

    if (getNewColumn) {
      getNewColumn.cards = [];

      await boardModel.pushColumnOrderIds(getNewColumn);
    }

    return getNewColumn;
  } catch (error) {
    throw error;
  }
};

export const columnService = {
  createNew,
};
