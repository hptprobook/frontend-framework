import { userModal } from '~/models/userModal';

const createNew = async (reqBody) => {
  try {
    await userModal.findOrCreate(reqBody);
  } catch (error) {
    throw error;
  }
};

const findUser = async (reqBody) => {
  try {
    const user = await userModal.findOneByEmail(reqBody.email);
    return user;
  } catch (error) {
    throw error;
  }
};

const getCurrent = async (userId) => {
  try {
    const user = await userModal.findOneById(userId);
    return user;
  } catch (error) {
    throw error;
  }
};

const update = async (userId, updateData) => {
  try {
    const user = await userModal.update(userId, updateData);
    return user;
  } catch (error) {
    throw error;
  }
};

export const userService = {
  createNew,
  findUser,
  getCurrent,
  update,
};
