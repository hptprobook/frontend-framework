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
    const currentUser = await userService.getCurrent(req.userId);

    res.status(StatusCodes.CREATED).json(currentUser);
  } catch (error) {
    next(error);
  }
};

const findUser = async (req, res, next) => {
  try {
    const user = await userService.findUser(req.body);
    res.status(StatusCodes.OK).json(user);
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const updatedUser = await userService.update(req.userId, req.body);
    res.status(StatusCodes.OK).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

export const userController = {
  createNew,
  getCurrent,
  findUser,
  update,
};
