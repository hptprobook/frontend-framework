import { ObjectId } from 'mongodb';
import { GET_DB } from '~/config/mongodb';
import { StatusCodes } from 'http-status-codes';
import ApiError from '~/utils/ApiError';
import { boardModel } from './boardModel';
import { userModal } from './userModal';
import { workspaceSchema } from './schema/workspaceSchema';

const WORKSPACE_COLLECTION_NAME = 'workspaces';
const INVALID_UPDATE_FIELDS = ['_id', 'createdAt'];

const validateBeforeCreate = async (data) => {
  return await workspaceSchema.WORKSPACE_COLLECTION_SCHEMA.validateAsync(data, {
    abortEarly: false,
  });
};

const getAll = async (userId) => {
  try {
    const creatorResults = await GET_DB()
      .collection(WORKSPACE_COLLECTION_NAME)
      .aggregate([
        {
          $match: {
            members: { $elemMatch: { memberId: userId, rule: 'creator' } },
            _destroy: false,
          },
        },
        {
          $lookup: {
            from: boardModel.BOARD_COLLECTION_NAME,
            localField: 'boardIds',
            foreignField: '_id',
            as: 'boards',
          },
        },
        {
          $project: {
            _id: 1,
            title: 1,
            boardIds: 1,
            members: 1,
            createdAt: 1,
            updatedAt: 1,
            _destroy: 1,
            boards: {
              $map: {
                input: '$boards',
                as: 'board',
                in: { _id: '$$board._id', title: '$$board.title' },
              },
            },
          },
        },
      ])
      .toArray();

    const memberResults = await GET_DB()
      .collection(WORKSPACE_COLLECTION_NAME)
      .aggregate([
        {
          $match: {
            members: { $elemMatch: { memberId: userId, rule: 'member' } },
            _destroy: false,
          },
        },
        {
          $lookup: {
            from: boardModel.BOARD_COLLECTION_NAME,
            localField: 'boardIds',
            foreignField: '_id',
            as: 'boards',
          },
        },
        {
          $project: {
            _id: 1,
            title: 1,
            boardIds: 1,
            members: 1,
            createdAt: 1,
            updatedAt: 1,
            _destroy: 1,
            boards: {
              $map: {
                input: '$boards',
                as: 'board',
                in: { _id: '$$board._id', title: '$$board.title' },
              },
            },
          },
        },
      ])
      .toArray();

    return {
      created: creatorResults || [],
      clienter: memberResults || [],
    };
  } catch (error) {
    throw new Error(error);
  }
};

const findOneById = async (id) => {
  try {
    const result = await GET_DB()
      .collection(WORKSPACE_COLLECTION_NAME)
      .aggregate([
        {
          $match: {
            _id: new ObjectId(id),
            _destroy: false,
          },
        },
        {
          $lookup: {
            from: boardModel.BOARD_COLLECTION_NAME,
            localField: '_id',
            foreignField: 'workspaceId',
            as: 'boards',
          },
        },
      ])
      .toArray();

    if (!result) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Workspace not found');
    }

    return result[0];
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_REQUEST, error);
  }
};

const createNew = async (data) => {
  try {
    const validData = await validateBeforeCreate(data);

    return await GET_DB()
      .collection(WORKSPACE_COLLECTION_NAME)
      .insertOne(validData);
  } catch (error) {
    throw new Error(error);
  }
};

const pushBoardIds = async (board) => {
  try {
    const result = await GET_DB()
      .collection(WORKSPACE_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(board.workspaceId) },
        { $push: { boardIds: board._id } },
        { returnDocument: 'after' }
      );

    return result || null;
  } catch (error) {
    throw new Error(error);
  }
};

const update = async (id, data) => {
  try {
    Object.keys(data).forEach((fieldName) => {
      if (INVALID_UPDATE_FIELDS.includes(fieldName)) {
        delete data[fieldName];
      }
    });

    const workspace = await GET_DB()
      .collection(WORKSPACE_COLLECTION_NAME)
      .findOne({
        _id: new ObjectId(id),
      });

    if (!workspace) {
      throw new Error('Workspace not found');
    }

    await GET_DB()
      .collection(WORKSPACE_COLLECTION_NAME)
      .updateOne({ _id: new ObjectId(id) }, { $set: data });

    const result = await GET_DB()
      .collection(WORKSPACE_COLLECTION_NAME)
      .findOne({
        _id: new ObjectId(id),
      });

    return result;
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_REQUEST, error);
  }
};

const inviteMember = async (workspaceId, userId, targetId) => {
  try {
    const workspace = await GET_DB()
      .collection(WORKSPACE_COLLECTION_NAME)
      .findOne({ _id: new ObjectId(workspaceId) });

    const inviter = await userModal.findOneById(userId);

    await userModal.addNotify(targetId, {
      title: 'You have been added to a workspace!',
      content: `You have been added to a workspace ${workspace.title} by ${inviter.displayName}. Click to see details`,
      seen: false,
      workspaceId,
    });

    return await GET_DB()
      .collection(WORKSPACE_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(workspaceId) },
        { $push: { members: { memberId: targetId, rule: 'member' } } },
        { returnDocument: 'after' }
      );
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_REQUEST, error);
  }
};

const deleteOneById = async (id) => {
  try {
    const result = await GET_DB()
      .collection(WORKSPACE_COLLECTION_NAME)
      .deleteOne({ _id: new ObjectId(id) });

    if (!result) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Workspace not found');
    }

    return result;
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_REQUEST, error);
  }
};

export const workspaceModel = {
  getAll,
  findOneById,
  createNew,
  pushBoardIds,
  update,
  inviteMember,
  deleteOneById,
};
