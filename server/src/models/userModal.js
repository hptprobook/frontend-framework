import Joi from 'joi';
import { ObjectId } from 'mongodb';
import { GET_DB } from '~/config/mongodb';
import { StatusCodes } from 'http-status-codes';
import ApiError from '~/utils/ApiError';

// Define collection
const USER_COLLECTION_NAME = 'users';
const USER_COLLECTION_SCHEMA = Joi.object({
  user_id: Joi.string().required(),
  displayName: Joi.string().required(),
  email: Joi.string().email().required(),
  photoURL: Joi.string().required(),
  refreshToken: Joi.string().required(),
  createdAt: Joi.date().timestamp('javascript').default(Date.now()),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false),
});

const INVALID_UPDATE_FIELDS = ['_id', 'createdAt'];

const validateBeforeCreate = async (data) => {
  return await USER_COLLECTION_SCHEMA.validateAsync(data, {
    abortEarly: false,
  });
};

const findOrCreate = async (reqBody) => {
  try {
    const db = await GET_DB();
    const userCollection = db.collection(USER_COLLECTION_NAME);

    let user = await userCollection.findOne({
      _id: reqBody.user_id,
    });
    const validData = await validateBeforeCreate(reqBody);

    if (!user) {
      const newUser = {
        ...validData,
        _id: reqBody.user_id,
      };

      delete newUser.user_id;

      await userCollection.insertOne(newUser);
    } else {
      const updateUser = {
        ...validData,
        updatedAt: Date.now(),
      };

      delete updateUser.user_id;

      await userCollection.updateOne(
        { _id: reqBody.user_id },
        { $set: updateUser }
      );
    }
  } catch (error) {
    throw new Error(error);
  }
};

const findOneById = async (userId) => {
  try {
    const result = await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .findOne({ _id: new ObjectId(userId) });
    if (!result) throw new Error('User not found!');
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const getAll = async () => {
  try {
    const results = await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .find({})
      .toArray();

    return results || [];
  } catch (error) {
    throw new Error(error);
  }
};

const getDetails = async (userId) => {
  try {
    const result = await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .find({ _id: new ObjectId(userId) });

    if (!result) throw new ApiError(StatusCodes.NOT_FOUND, 'User not found!');
    return result[0] || null;
  } catch (error) {
    throw new Error(error);
  }
};

const update = async (firebaseUserId, updateData) => {
  try {
    const db = await GET_DB();
    const userCollection = db.collection(USER_COLLECTION_NAME);

    Object.keys(updateData).forEach((fieldName) => {
      if (INVALID_UPDATE_FIELDS.includes(fieldName)) {
        delete updateData[fieldName];
      }
    });

    const result = await userCollection.findOneAndUpdate(
      { firebaseUserId },
      { $set: updateData },
      { returnDocument: 'after' }
    );

    return result.value || null;
  } catch (error) {
    throw new Error(error);
  }
};

const deleteOneById = async (userId) => {
  try {
    const result = await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .deleteOne({ _id: new ObjectId(userId) });
    if (!result) throw new Error('User not found!');
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

export const userModal = {
  findOrCreate,
  findOneById,
  getAll,
  getDetails,
  update,
  deleteOneById,
};
