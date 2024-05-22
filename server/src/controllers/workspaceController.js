import { StatusCodes } from 'http-status-codes';
import { workspaceService } from '~/services/workspaceService';

const getAll = async (req, res, next) => {
  try {
    const workspaces = await workspaceService.getAll(req.userId);

    res.status(StatusCodes.OK).json(workspaces);
  } catch (error) {
    next(error);
  }
};

const getDetail = async (req, res, next) => {
  try {
    const workspace = await workspaceService.getDetail(
      req.params.id,
      req.userId
    );

    res.status(StatusCodes.OK).json(workspace);
  } catch (error) {
    next(error);
  }
};

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

const update = async (req, res, next) => {
  try {
    const updatedWorkspace = await workspaceService.update(
      req.params.id,
      req.body
    );

    res.status(StatusCodes.OK).json(updatedWorkspace);
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
  getAll,
  getDetail,
  createNew,
  update,
  remove,
};
