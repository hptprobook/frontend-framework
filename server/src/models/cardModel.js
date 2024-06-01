import { GET_DB } from '~/config/mongodb';
import { ObjectId } from 'mongodb';
import { cardSchema } from './schema/cardSchema';

const CARD_COLLECTION_NAME = 'cards';

const INVALID_UPDATE_FIELDS = ['_id', 'boardId', 'createdAt'];

const validateBeforeCreate = async (data) => {
  return await cardSchema.CARD_COLLECTION_SCHEMA.validateAsync(data, {
    abortEarly: false,
  });
};

const createNew = async (data) => {
  try {
    const validData = await validateBeforeCreate(data);

    return await GET_DB()
      .collection(CARD_COLLECTION_NAME)
      .insertOne({
        ...validData,
        boardId: new ObjectId(data.boardId),
        columnId: new ObjectId(data.columnId),
      });
  } catch (error) {
    throw new Error(error);
  }
};

const findOneById = async (id) => {
  try {
    const result = await GET_DB()
      .collection(CARD_COLLECTION_NAME)
      .findOne({ _id: new ObjectId(id) });
    if (!result) throw new Error(`Card not found for ${CARD_COLLECTION_NAME}`);
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const update = async (cardId, updateData) => {
  try {
    Object.keys(updateData).forEach((fieldName) => {
      if (INVALID_UPDATE_FIELDS.includes(fieldName)) {
        delete updateData[fieldName];
      }
    });

    if (updateData.columnId)
      updateData.columnId = new ObjectId(updateData.columnId);

    const result = await GET_DB()
      .collection(CARD_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(cardId) },
        { $set: updateData },
        { returnDocument: 'after' }
      );

    return result || null;
  } catch (error) {
    throw new Error(error);
  }
};

const deleteOneById = async (id) => {
  try {
    const result = await GET_DB()
      .collection(CARD_COLLECTION_NAME)
      .deleteOne({ _id: new ObjectId(id) });
    if (!result)
      throw new Error(`Column not found for ${CARD_COLLECTION_NAME}`);
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const deleteManyByColumnId = async (columnId) => {
  try {
    const result = await GET_DB()
      .collection(CARD_COLLECTION_NAME)
      .deleteMany({ columnId: new ObjectId(columnId) });
    if (!result)
      throw new Error(`Column not found for ${CARD_COLLECTION_NAME}`);
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const deleteManyByBoardId = async (boardId) => {
  try {
    const result = await GET_DB()
      .collection(CARD_COLLECTION_NAME)
      .deleteMany({ boardId: new ObjectId(boardId) });
    if (!result)
      throw new Error(`Column not found for ${CARD_COLLECTION_NAME}`);
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

export const cardModel = {
  createNew,
  findOneById,
  update,
  deleteManyByColumnId,
  deleteOneById,
  deleteManyByBoardId,
  CARD_COLLECTION_NAME,
};
