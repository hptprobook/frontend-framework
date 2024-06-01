import { GET_DB } from '~/config/mongodb';
import { ObjectId } from 'mongodb';
import { columnSchema } from './schema/columnSchema';

const validateBeforeCreate = async (data) => {
  return await columnSchema.COLUMN_COLLECTION_SCHEMA.validateAsync(data, {
    abortEarly: false,
  });
};

const INVALID_UPDATE_FIELDS = ['_id', 'boardId', 'createdAt'];

const createNew = async (data) => {
  try {
    const validData = await validateBeforeCreate(data);

    return await GET_DB()
      .collection(columnSchema.COLUMN_COLLECTION_NAME)
      .insertOne({ ...validData, boardId: new ObjectId(validData.boardId) });
  } catch (error) {
    throw new Error(error);
  }
};

const findOneById = async (id) => {
  try {
    const result = await GET_DB()
      .collection(columnSchema.COLUMN_COLLECTION_NAME)
      .findOne({ _id: new ObjectId(id) });
    if (!result)
      throw new Error(
        `Column not found for ${columnSchema.COLUMN_COLLECTION_NAME}`
      );
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const pushCardOrderIds = async (card) => {
  try {
    const result = await GET_DB()
      .collection(columnSchema.COLUMN_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(card.columnId) },
        { $push: { cardOrderIds: card._id } },
        { returnDocument: 'after' }
      );

    return result || null;
  } catch (error) {
    throw new Error(error);
  }
};

const pullCardOrderIds = async (card) => {
  try {
    const result = await GET_DB()
      .collection(columnSchema.COLUMN_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(card.columnId) },
        { $pull: { cardOrderIds: new ObjectId(card._id) } },
        { returnDocument: 'after' }
      );

    return result || null;
  } catch (error) {
    throw new Error(error);
  }
};

const update = async (columnId, updateData) => {
  try {
    Object.keys(updateData).forEach((fieldName) => {
      if (INVALID_UPDATE_FIELDS.includes(fieldName)) {
        delete updateData[fieldName];
      }
    });

    if (updateData.cardOrderIds) {
      updateData.cardOrderIds = updateData.cardOrderIds.map(
        (_id) => new ObjectId(_id)
      );
    }

    const result = await GET_DB()
      .collection(columnSchema.COLUMN_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(columnId) },
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
      .collection(columnSchema.COLUMN_COLLECTION_NAME)
      .deleteOne({ _id: new ObjectId(id) });
    if (!result)
      throw new Error(
        `Column not found for ${columnSchema.COLUMN_COLLECTION_NAME}`
      );
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const deleteManyByBoardId = async (boardId) => {
  try {
    const result = await GET_DB()
      .collection(columnSchema.COLUMN_COLLECTION_NAME)
      .deleteMany({ boardId: new ObjectId(boardId) });
    if (!result)
      throw new Error(
        `Column not found for ${columnSchema.COLUMN_COLLECTION_NAME}`
      );
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

export const columnModel = {
  createNew,
  findOneById,
  pushCardOrderIds,
  update,
  deleteOneById,
  pullCardOrderIds,
  deleteManyByBoardId,
};
