import axios from 'axios';
import { env } from '~/config/environment';
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

const refreshToken = async (refreshToken) => {
  try {
    const response = await axios.post(
      `https://securetoken.googleapis.com/v1/token?key=${env.FIREBASE_API_KEY}`,
      `grant_type=refresh_token&refresh_token=${refreshToken}`,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const { access_token, refresh_token } = await response.data;
    return { newAccessToken: access_token, newRefreshToken: refresh_token };
  } catch (error) {
    throw error;
  }
};

export const authService = {
  loginGoogle,
  loginWithPhoneNumber,
  refreshToken,
};
