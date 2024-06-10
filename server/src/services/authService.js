import { userModal } from '~/models/userModal';

const loginGoogle = async (reqBody) => {
  try {
    return await userModal.findOrCreate(reqBody);
  } catch (error) {
    throw error;
  }
};

const loginWithPhoneNumber = async (reqBody) => {
  try {
    return await userModal.findOrCreateWithPhoneNumber(reqBody);
  } catch (error) {
    throw error;
  }
};

export const authService = {
  loginGoogle,
  loginWithPhoneNumber,
};
