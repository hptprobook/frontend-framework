import Joi from 'joi';
import { ObjectId } from 'mongodb';
import { GET_DB } from '~/config/mongodb';
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators';
import { StatusCodes } from 'http-status-codes';
import ApiError from '~/utils/ApiError';
import { boardModel } from './boardModel';
import { BOARD_TYPES } from '~/utils/constants';
// import { userModal } from './userModal';

// Define collection
const WORKSPACE_COLLECTION_NAME = 'workspaces';
const WORKSPACE_COLLECTION_SCHEMA = Joi.object({
  title: Joi.string().required().min(3).max(50).trim().strict(),
  description: Joi.string().required().min(3).max(256).trim().strict(),
  type: Joi.string()
    .valid(...BOARD_TYPES)
    .required(),
  boardIds: Joi.array()
    .items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE))
    .default([]),
  members: Joi.array()
    .items(
      Joi.object({
        memberId: Joi.string(),
        rule: Joi.string().valid('creator', 'owner', 'member'),
      })
    )
    .default([]),
  createdAt: Joi.date().timestamp('javascript').default(Date.now()),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false),
});

const INVALID_UPDATE_FIELDS = ['_id', 'createdAt'];

const validateBeforeCreate = async (data) => {
  return await WORKSPACE_COLLECTION_SCHEMA.validateAsync(data, {
    abortEarly: false,
  });
};

const getAll = async (userId) => {
  try {
    const results = await GET_DB()
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

    return results || [];
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

const inviteMember = async (workspaceId, userId) => {
  try {
    return await GET_DB()
      .collection(WORKSPACE_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(workspaceId) },
        { $push: { members: { memberId: userId, rule: 'member' } } },
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
