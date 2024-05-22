import { StatusCodes } from 'http-status-codes';
import { workspaceService } from '~/services/workspaceService';

const createNew = async (req, res, next) => {
  try {
    const createdWorkspace = await workspaceService.createNew({
      ...req.body,
      userId: req.userId,
    });

    res.status(StatusCodes.CREATED).json(createdWorkspace);
  } catch (error) {
    next(error);
  }
};

const getAll = async (req, res, next) => {
  try {
    const workspaces = await workspaceService.getAll(req.userId);

    res.status(StatusCodes.OK).json(workspaces);
  } catch (error) {
    next(error);
  }
};

const getDetails = async (req, res, next) => {
  try {
    const board = await workspaceService.getDetails(req.params.id, req.userId);

    res.status(StatusCodes.OK).json(board);
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const updatedBoard = await workspaceService.update(req.params.id, req.body);

    res.status(StatusCodes.OK).json(updatedBoard);
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const result = await workspaceService.remove(req.params.id);

    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};

export const workspaceController = {
  createNew,
  getAll,
  getDetails,
  update,
  remove,
};
