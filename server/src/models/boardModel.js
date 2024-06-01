import { ObjectId } from 'mongodb';
import { GET_DB } from '~/config/mongodb';
import { columnModel } from './columnModel';
import { cardModel } from './cardModel';
import { StatusCodes } from 'http-status-codes';
import ApiError from '~/utils/ApiError';
import { userModal } from './userModal';
import { boardSchema } from './schema/boardSchema';
import { cardSchema } from './schema/cardSchema';
import { columnSchema } from './schema/columnSchema';

// Define collection
const BOARD_COLLECTION_NAME = 'boards';
const INVALID_UPDATE_FIELDS = ['_id', 'createdAt'];

const validateBeforeCreate = async (data) => {
  return await boardSchema.BOARD_COLLECTION_SCHEMA.validateAsync(data, {
    abortEarly: false,
  });
};

const createNew = async (data) => {
  try {
    const validData = await validateBeforeCreate(data);

    return await GET_DB()
      .collection(BOARD_COLLECTION_NAME)
      .insertOne({
        ...validData,
        workspaceId: new ObjectId(validData.workspaceId),
      });
  } catch (error) {
    throw new Error(error);
  }
};

const findOneById = async (id) => {
  try {
    const result = await GET_DB()
      .collection(BOARD_COLLECTION_NAME)
      .findOne({ _id: new ObjectId(id) });
    if (!result)
      throw new Error(`Board not found for ${BOARD_COLLECTION_NAME}`);
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const getAll = async (userId) => {
  try {
    const results = await GET_DB()
      .collection(BOARD_COLLECTION_NAME)
      .find({ userId })
      .toArray();

    return results || [];
  } catch (error) {
    throw new Error(error);
  }
};

const getAllBoardInvited = async (userId) => {
  try {
    const results = await GET_DB()
      .collection(BOARD_COLLECTION_NAME)
      .find({
        ownerIds: userId,
        _destroy: false,
      })
      .toArray();

    return results || [];
  } catch (error) {
    throw new Error(error);
  }
};

const getDetails = async (id) => {
  try {
    const result = await GET_DB()
      .collection(BOARD_COLLECTION_NAME)
      .aggregate([
        {
          $match: {
            _id: new ObjectId(id),
            _destroy: false,
          },
        },
        {
          $lookup: {
            from: columnSchema.COLUMN_COLLECTION_NAME,
            localField: '_id',
            foreignField: 'boardId',
            as: 'columns',
          },
        },
        {
          $lookup: {
            from: cardSchema.CARD_COLLECTION_NAME,
            localField: '_id',
            foreignField: 'boardId',
            as: 'cards',
          },
        },
      ])
      .toArray();

    if (!result)
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        `Board not found for ${BOARD_COLLECTION_NAME}`
      );
    return result[0] || null;
  } catch (error) {
    throw new Error(error);
  }
};

const pushColumnOrderIds = async (col) => {
  try {
    const result = await GET_DB()
      .collection(BOARD_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(col.boardId) },
        { $push: { columnOrderIds: col._id } },
        { returnDocument: 'after' }
      );

    return result || null;
  } catch (error) {
    throw new Error(error);
  }
};

const update = async (boardId, updateData) => {
  try {
    Object.keys(updateData).forEach((fieldName) => {
      if (INVALID_UPDATE_FIELDS.includes(fieldName)) {
        delete updateData[fieldName];
      }
    });

    const board = await GET_DB()
      .collection(BOARD_COLLECTION_NAME)
      .findOne({ _id: new ObjectId(boardId) });
    if (!board) {
      throw new Error('Board not found');
    }

    if (updateData.columnOrderIds) {
      updateData.columnOrderIds = updateData.columnOrderIds.map(
        (_id) => new ObjectId(_id)
      );
    }

    if (updateData.ownerIds) {
      const uniqueOwnerIds = new Set(updateData.ownerIds);
      if (uniqueOwnerIds.size !== updateData.ownerIds.length) {
        throw new Error('Member is already exists');
      }

      if (updateData.ownerIds.includes(board.userId)) {
        throw new Error('Member is already exists');
      }

      const inviter = await userModal.findOneById(updateData.userId);
      const invitedId = updateData.ownerIds[updateData.ownerIds.length - 1];
      const invited = await userModal.findOneById(invitedId);

      updateData.members = [
        ...board.members,
        {
          displayName: invited.displayName,
          photoURL: invited.photoURL,
        },
      ];

      await userModal.addNotify(invitedId, {
        title: 'You have been added to a board!',
        content: `You have been added to a board ${updateData.title} by ${inviter.displayName}. Click to see details`,
        seen: false,
        boardId,
      });
    }

    const result = await GET_DB()
      .collection(BOARD_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(boardId) },
        { $set: updateData },
        { returnDocument: 'after' }
      );

    return result || null;
  } catch (error) {
    throw new Error(error);
  }
};

const pullColumnOrderIds = async (col) => {
  try {
    const result = await GET_DB()
      .collection(BOARD_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(col.boardId) },
        { $pull: { columnOrderIds: new ObjectId(col._id) } },
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
      .collection(BOARD_COLLECTION_NAME)
      .deleteOne({ _id: new ObjectId(id) });
    if (!result)
      throw new Error(`Column not found for ${BOARD_COLLECTION_NAME}`);
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const deleteManyByWorkspaceId = async (workspaceId) => {
  const db = GET_DB();
  const boardCollection = db.collection(BOARD_COLLECTION_NAME);
  const columnCollection = db.collection(columnModel.COLUMN_COLLECTION_NAME);
  const cardCollection = db.collection(cardModel.CARD_COLLECTION_NAME);

  try {
    const boards = await boardCollection
      .find({ workspaceId: new ObjectId(workspaceId) })
      .toArray();
    const boardIds = boards.map((board) => board._id);

    if (boardIds.length === 0) {
      throw new Error(`No boards found for workspace ${workspaceId}`);
    }

    await columnCollection.deleteMany({ boardId: { $in: boardIds } });

    await cardCollection.deleteMany({ boardId: { $in: boardIds } });

    const result = await boardCollection.deleteMany({ _id: { $in: boardIds } });

    return result;
  } catch (error) {
    throw new Error(error);
  }
};

export const boardModel = {
  createNew,
  findOneById,
  getAll,
  getDetails,
  pushColumnOrderIds,
  update,
  getAllBoardInvited,
  pullColumnOrderIds,
  deleteOneById,
  deleteManyByWorkspaceId,
  BOARD_COLLECTION_NAME,
};
