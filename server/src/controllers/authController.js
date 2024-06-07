import { StatusCodes } from 'http-status-codes';
import { authService } from '~/services/authService';
import ApiError from '~/utils/ApiError';

const loginGoogle = async (req, res, next) => {
  try {
    await authService.loginGoogle(req.body);

    res.cookie('refreshToken', req.body.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict',
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
      secure: true,
      sameSite: 'Strict',
    });

    res.status(StatusCodes.CREATED).json({ message: 'Login successfully' });
  } catch (error) {
    next(error);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Missing refresh token');
    }

    const { newAccessToken, newRefreshToken } = await authService.refreshToken(
      refreshToken
    );

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict',
    });

    return res.status(StatusCodes.OK).json({ accessToken: newAccessToken });
  } catch (error) {
    next(error);
  }
};

export const authController = {
  loginGoogle,
  loginWithPhoneNumber,
  refreshToken,
};
