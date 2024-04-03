import { StatusCodes } from 'http-status-codes';
import { userService } from '~/services/userService';

const createNew = async (req, res, next) => {
  try {
    await userService.createNew(req.body);

    res.status(StatusCodes.CREATED).json({ message: 'Login successfully' });
  } catch (error) {
    next(error);
  }
};

const getCurrent = async (req, res, next) => {
  try {
    const currentUser = await req.user;

    res.status(StatusCodes.CREATED).json(currentUser);
  } catch (error) {
    next(error);
  }
};

export const userController = {
  createNew,
  getCurrent,
};
