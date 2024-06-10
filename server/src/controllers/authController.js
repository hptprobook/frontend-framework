import axios from 'axios';
import { StatusCodes } from 'http-status-codes';
import { env } from '~/config/environment';
import { authService } from '~/services/authService';
import ApiError from '~/utils/ApiError';

const loginGoogle = async (req, res, next) => {
  try {
    await authService.loginGoogle(req.body);

    res.cookie('refreshToken', req.body.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 7000, // 7 days
    });

    res.status(StatusCodes.CREATED).json({ message: 'Login successfully' });
  } catch (error) {
    next(error);
  }
};

const loginWithPhoneNumber = async (req, res, next) => {
  try {
    await authService.loginWithPhoneNumber(req.body);

    res.cookie('refreshToken', req.body.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 7000, // 7 days
    });

    res.status(StatusCodes.CREATED).json({ message: 'Login successfully' });
  } catch (error) {
    next(error);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const cookie = req.cookies;

    console.log('cookie in refresh token: ', cookie);

    if (!cookie && !cookie.refreshToken) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Missing refresh token');
    }

    const refreshToken = cookie.refreshToken;

    const response = await axios.post(
      `https://securetoken.googleapis.com/v1/token?key=${env.FIREBASE_API_KEY}`,
      `grant_type=refresh_token&refresh_token=${refreshToken}`,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    console.log('ressponse in refresh: ', response);

    // const { newAccessToken, newRefreshToken } = await authService.refreshToken(
    //   refreshToken
    // );

    // res.cookie('refreshToken', newRefreshToken, {
    //   httpOnly: true,
    // secure: process.env.NODE_ENV === 'production',
    //   maxAge: 24 * 60 * 60 * 7000, // 7 days
    // });

    // return res.status(StatusCodes.OK).json({ accessToken: newAccessToken });
  } catch (error) {
    next(error);
  }
};

export const authController = {
  loginGoogle,
  loginWithPhoneNumber,
  refreshToken,
};
