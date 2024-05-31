import { StatusCodes } from 'http-status-codes';
import { columnService } from '~/services/columnService';

const createNew = async (req, res, next) => {
  try {
    const createColumn = await columnService.createNew(req.body);

    if (createColumn) req.io.emit('newColumn', createColumn);

    res.status(StatusCodes.CREATED).json(createColumn);
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const updatedColumn = await columnService.update(req.params.id, req.body);

    if (updatedColumn) req.io.emit('moveCardSameColumn', updatedColumn);

    res.status(StatusCodes.OK).json(updatedColumn);
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const result = await columnService.remove(req.params.id);

    if (result) req.io.emit('deleteColumn', result.columnId);

    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};

export const columnController = {
  createNew,
  update,
  remove,
};
