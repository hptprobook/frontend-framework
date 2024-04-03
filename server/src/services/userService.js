import { userModal } from '~/models/userModal';

const createNew = async (reqBody) => {
  try {
    await userModal.findOrCreate(reqBody);
  } catch (error) {
    throw error;
  }
};

export const userService = {
  createNew,
};
