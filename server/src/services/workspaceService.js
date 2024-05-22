import { workspaceModel } from '~/models/workspaceModel';
import ApiError from '~/utils/ApiError';
import { StatusCodes } from 'http-status-codes';

const getAll = async (userId) => {
  try {
    const workspaces = await workspaceModel.getAll(userId);
    if (!workspaces)
      throw new ApiError(StatusCodes.NOT_FOUND, 'No workspaces found!');

    return workspaces;
  } catch (error) {
    throw error;
  }
};

const getDetail = async (id) => {
  try {
    const workspace = await workspaceModel.findOneById(id);

    if (!workspace)
      throw new ApiError(StatusCodes.NOT_FOUND, 'Workspace not found');

    return workspace;
  } catch (error) {
    throw error;
  }
};

const createNew = async (reqBody) => {
  const { userId, ...restOfReq } = reqBody;

  try {
    const createdWorkspace = await workspaceModel.createNew({
      ...restOfReq,
      members: [{ memberId: userId, rule: 'creator' }],
    });

    // return await workspaceModel.findOneById(createdWorkspace.insertedId);
    return createdWorkspace;
  } catch (error) {
    throw error;
  }
};

const update = async (id, reqBody) => {
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now(),
    };
    const updatedWorkspace = await workspaceModel.update(id, updateData);

    return updatedWorkspace;
  } catch (error) {
    throw error;
  }
};

const remove = async (id) => {
  try {
    const targetBoard = await workspaceModel.findOneById(id);

    if (!targetBoard) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found!');
    }

    await workspaceModel.deleteOneById(id);

    return {
      deleteResult: 'Workspace deleted successfully!',
    };
  } catch (error) {
    throw error;
  }
};

export const workspaceService = {
  createNew,
  getAll,
  getDetail,
  update,
  remove,
};
