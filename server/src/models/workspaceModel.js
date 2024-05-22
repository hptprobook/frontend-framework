import Joi from 'joi';
import { ObjectId } from 'mongodb';
import { GET_DB } from '~/config/mongodb';
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators';
import { columnModel } from './columnModel';
import { cardModel } from './cardModel';
import { StatusCodes } from 'http-status-codes';
import ApiError from '~/utils/ApiError';
import { userModal } from './userModal';

// Define collection
const WORKSPACE_COLLECTION_NAME = 'workspaces';
const WORKSPACE_COLLECTION_SCHEMA = Joi.object({
  title: Joi.string().required().min(3).max(50).trim().strict(),
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

const getAll = async (userId) => {
  try {
    const results = await GET_DB()
      .collection(WORKSPACE_COLLECTION_NAME)
      .find({ members: { $elemMatch: { memberId: userId, rule: 'creator' } } })
      .toArray();

    return results || [];
  } catch (error) {
    throw new Error(error);
  }
};

export const workspaceModel = {
  createNew,
  getAll,
  WORKSPACE_COLLECTION_NAME,
  WORKSPACE_COLLECTION_SCHEMA,
};
