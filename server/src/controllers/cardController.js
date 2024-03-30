import { StatusCodes } from 'http-status-codes';
import { cardService } from '~/services/cardService';

const createNew = async (req, res, next) => {
  try {
    const createdCard = await cardService.createNew(req.body);

    res.status(StatusCodes.CREATED).json(createdCard);
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const updatedCard = await cardService.update(req.params.id, req.body);

    res.status(StatusCodes.OK).json(updatedCard);
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const result = await cardService.remove(req.params.id);

    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};

export const cardController = {
  createNew,
  update,
  remove,
};
