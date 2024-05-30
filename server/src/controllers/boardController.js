import { StatusCodes } from 'http-status-codes';
import { boardService } from '~/services/boardService';

const createNew = async (req, res, next) => {
  try {
    const createdBoard = await boardService.createNew({
      ...req.body,
      userId: req.userId,
    });

    res.status(StatusCodes.CREATED).json(createdBoard);
  } catch (error) {
    next(error);
  }
};

const getAll = async (req, res, next) => {
  try {
    const boards = await boardService.getAll(req.userId);

    res.status(StatusCodes.OK).json(boards);
  } catch (error) {
    next(error);
  }
};

const getAllBoardInvited = async (req, res, next) => {
  try {
    const boards = await boardService.getAllBoardInvited(req.userId);

    res.status(StatusCodes.OK).json(boards);
  } catch (error) {
    next(error);
  }
};

const getDetails = async (req, res, next) => {
  try {
    const board = await boardService.getDetails(req.params.id, req.userId);

    res.status(StatusCodes.OK).json(board);
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const updatedBoard = await boardService.update(req.params.id, req.body);

    if (updatedBoard) req.io.emit('moveColumn', updatedBoard);

    res.status(StatusCodes.OK).json(updatedBoard);
  } catch (error) {
    next(error);
  }
};

const moveCardDifferentColumn = async (req, res, next) => {
  try {
    const result = await boardService.moveCardDifferentColumn(req.body);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const result = await boardService.remove(req.params.id);

    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};

export const boardController = {
  createNew,
  getAll,
  getAllBoardInvited,
  getDetails,
  update,
  moveCardDifferentColumn,
  remove,
};
