/* eslint-disable no-useless-catch */
// import ApiError from '~/utils/ApiError';
import { boardModel } from '~/models/boardModel';
import ApiError from '~/utils/ApiError';
import { slugify } from '~/utils/formatters';
import { StatusCodes } from 'http-status-codes';

const createNew = async (reqBody) => {
  try {
    // Gọi tới Model để tạo bản ghi
    const createdBoard = await boardModel.createNew({
      ...reqBody,
      slug: slugify(reqBody.title),
    });

    // Trả về kết quả cho controller, trong Service bắt buộc phải có return
    return await boardModel.findOneById(createdBoard.insertedId);
  } catch (error) {
    throw error;
  }
};

const getDetails = async (boardId) => {
  try {
    const board = await boardModel.getDetails(boardId);
    if (!board) throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found');

    return board;
  } catch (error) {
    throw error;
  }
};

export const boardService = {
  createNew,
  getDetails,
};
