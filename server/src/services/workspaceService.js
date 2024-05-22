import { workspaceModel } from '~/models/workspaceModel';
import ApiError from '~/utils/ApiError';
import { StatusCodes } from 'http-status-codes';
import { cloneDeep } from 'lodash';
import { columnModel } from '~/models/columnModel';
import { cardModel } from '~/models/cardModel';

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

const getAllBoardInvited = async (userId) => {
  try {
    const boards = await workspaceModel.getAllBoardInvited(userId);
    if (!boards) throw new ApiError(StatusCodes.NOT_FOUND, 'No boards found!');

    return boards;
  } catch (error) {
    throw error;
  }
};

const getDetails = async (boardId, userId) => {
  try {
    const board = await workspaceModel.getDetails(boardId);
    if (!board) throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found');
    if (!userId) throw new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized');

    const resBoard = cloneDeep(board);
    resBoard.columns.forEach((col) => {
      col.cards = resBoard.cards.filter((card) =>
        card.columnId.equals(col._id)
      );
    });

    delete resBoard.cards;

    return resBoard;
  } catch (error) {
    throw error;
  }
};

const update = async (boardId, reqBody) => {
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now(),
    };
    const updatedBoard = await workspaceModel.update(boardId, updateData);

    return updatedBoard;
  } catch (error) {
    throw error;
  }
};

const moveCardDifferentColumn = async (reqBody) => {
  try {
    await columnModel.update(reqBody.prevColumnId, {
      cardOrderIds: reqBody.prevCardOrderIds,
      updatedAt: Date.now(),
    });

    await columnModel.update(reqBody.nextColumnId, {
      cardOrderIds: reqBody.nextCardOrderIds,
      updatedAt: Date.now(),
    });

    await cardModel.update(reqBody.currentCardId, {
      columnId: reqBody.nextColumnId,
    });

    return { updateResult: 'success' };
  } catch (error) {
    throw error;
  }
};

const remove = async (boardId) => {
  try {
    const targetBoard = await workspaceModel.findOneById(boardId);

    if (!targetBoard) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found!');
    }

    await workspaceModel.deleteOneById(boardId);

    await columnModel.deleteManyByBoardId(boardId);

    await cardModel.deleteManyByBoardId(boardId);

    return {
      deleteResult: 'Board, its Columns and Cards deleted successfully!',
    };
  } catch (error) {
    throw error;
  }
};

export const workspaceService = {
  createNew,
  getAll,
  getAllBoardInvited,
  getDetails,
  update,
  moveCardDifferentColumn,
  remove,
};
