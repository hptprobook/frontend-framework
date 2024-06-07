import { StatusCodes } from 'http-status-codes';
import { userService } from '~/services/userService';

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
  getCurrent,
  findUser,
  update,
};
