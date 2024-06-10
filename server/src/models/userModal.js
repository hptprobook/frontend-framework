import { ObjectId } from 'mongodb';
import { GET_DB } from '~/config/mongodb';
import { StatusCodes } from 'http-status-codes';
import ApiError from '~/utils/ApiError';
import { userSchema } from './schema/userSchema';

// Define collection

const INVALID_UPDATE_FIELDS = ['_id', 'createdAt'];

const validateBeforeCreate = async (data) => {
  return await userSchema.USER_COLLECTION_SCHEMA.validateAsync(data, {
    abortEarly: false,
  });
};

const validateBeforeCreateWithPhone = async (data) => {
  return await userSchema.USER_LOGIN_PHONE_SCHEMA.validateAsync(data, {
    abortEarly: false,
  });
};

const validateBeforeCreateWithFacebook = async (data) => {
  return await userSchema.USER_LOGIN_FACEBOOK_SCHEMA.validateAsync(data, {
    abortEarly: false,
  });
};

const findOrCreate = async (reqBody) => {
  try {
    const db = await GET_DB();
    const userCollection = db.collection(userSchema.USER_COLLECTION_NAME);

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

const findOrCreateWithPhoneNumber = async (reqBody) => {
  try {
    const db = await GET_DB();
    const userCollection = db.collection(userSchema.USER_COLLECTION_NAME);

    const validData = await validateBeforeCreateWithPhone(reqBody);

    let user = await userCollection.findOne({
      _id: validData.user_id,
    });

    if (!user) {
      const newUser = {
        ...validData,
        _id: validData.user_id,
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
        { _id: validData.user_id },
        { $set: updateUser }
      );
    }
  } catch (error) {
    throw new Error(error);
  }
};

const findOrCreateWithFacebook = async (reqBody) => {
  try {
    const db = await GET_DB();
    const userCollection = db.collection(userSchema.USER_COLLECTION_NAME);

    const validData = await validateBeforeCreateWithFacebook(reqBody);

    let user = await userCollection.findOne({
      _id: validData.user_id,
    });
    if (!user) {
      const newUser = {
        ...validData,
        _id: validData.user_id,
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
        { _id: validData.user_id },
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
      .collection(userSchema.USER_COLLECTION_NAME)
      .findOne({ _id: userId });
    if (!result) throw new Error('User not found!');
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const findOneByEmail = async (email) => {
  try {
    const result = await GET_DB()
      .collection(userSchema.USER_COLLECTION_NAME)
      .findOne({ email });
    if (!result) throw new Error('User not found!');
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const findOneByPhoneNumber = async (phoneNumber) => {
  try {
    const result = await GET_DB()
      .collection(userSchema.USER_COLLECTION_NAME)
      .findOne({ phoneNumber });
    if (!result) throw new Error('User not found!');
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const getAll = async () => {
  try {
    const results = await GET_DB()
      .collection(userSchema.USER_COLLECTION_NAME)
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
      .collection(userSchema.USER_COLLECTION_NAME)
      .find({ _id: userId });

    if (!result) throw new ApiError(StatusCodes.NOT_FOUND, 'User not found!');
    return result[0] || null;
  } catch (error) {
    throw new Error(error);
  }
};

const update = async (userId, updateData) => {
  try {
    const db = await GET_DB();
    const userCollection = db.collection(userSchema.USER_COLLECTION_NAME);

    Object.keys(updateData).forEach((fieldName) => {
      if (INVALID_UPDATE_FIELDS.includes(fieldName)) {
        delete updateData[fieldName];
      }
    });

    const isEmailDuplicate = async (email) => {
      const user = await userCollection.findOne({ email });
      return user && user._id.toString() !== userId.toString();
    };

    const isPhoneNumberDuplicate = async (phoneNumber) => {
      const user = await userCollection.findOne({ phoneNumber });
      return user && user._id.toString() !== userId.toString();
    };

    if (updateData.email && (await isEmailDuplicate(updateData.email))) {
      return { success: false, message: 'Email already exists.' };
    }

    if (
      updateData.phoneNumber &&
      (await isPhoneNumberDuplicate(updateData.phoneNumber))
    ) {
      return { success: false, message: 'Phone number already exists.' };
    }

    if (updateData.notifyId) {
      const result = await userCollection.updateOne(
        {
          _id: userId,
          'notifies._id': new ObjectId(updateData.notifyId),
        },
        { $set: { 'notifies.$.seen': true } }
      );

      if (result.modifiedCount === 1) {
        return { success: true };
      } else {
        return { success: false, message: 'No notification was updated.' };
      }
    }

    const result = await userCollection.findOneAndUpdate(
      { _id: userId },
      { $set: updateData },
      { returnDocument: 'after' }
    );

    delete result.refreshToken;

    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const addNotify = async (userId, notify) => {
  try {
    const db = await GET_DB();
    const userCollection = db.collection(userSchema.USER_COLLECTION_NAME);

    notify = { ...notify, _id: new ObjectId() };

    const result = await userCollection.findOneAndUpdate(
      { _id: userId },
      { $push: { notifies: notify } },
      { returnDocument: 'after' }
    );

    return result || null;
  } catch (error) {
    throw new Error(error);
  }
};

const deleteOneById = async (userId) => {
  try {
    const result = await GET_DB()
      .collection(userSchema.USER_COLLECTION_NAME)
      .deleteOne({ _id: new ObjectId(userId) });
    if (!result) throw new Error('User not found!');
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

export const userModal = {
  findOrCreate,
  findOrCreateWithPhoneNumber,
  findOrCreateWithFacebook,
  findOneById,
  findOneByEmail,
  findOneByPhoneNumber,
  getAll,
  getDetails,
  update,
  addNotify,
  deleteOneById,
};
