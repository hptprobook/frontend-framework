import { workspaceModel } from '~/models/workspaceModel';
import ApiError from '~/utils/ApiError';
import { StatusCodes } from 'http-status-codes';
import { userModal } from '~/models/userModal';
import { boardModel } from '~/models/boardModel';

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

    const getNewWorkspace = await workspaceModel.findOneById(
      createdWorkspace.insertedId
    );

    if (getNewWorkspace) await workspaceModel.pushBoardIds(getNewWorkspace);

    return await workspaceModel.findOneById(createdWorkspace.insertedId);
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

const inviteMember = async (workspaceId, reqBody) => {
  try {
    const user = await userModal.findOneById(reqBody.userId);

    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found!');
    }

    return await workspaceModel.inviteMember(workspaceId, reqBody.userId);
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
    await boardModel.deleteManyByWorkspaceId(id);

    return {
      deleteResult: 'Workspace and all items in it deleted successfully!',
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
  inviteMember,
  remove,
};
