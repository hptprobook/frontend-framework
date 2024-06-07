import Joi from 'joi';
import { StatusCodes } from 'http-status-codes';
import ApiError from '~/utils/ApiError';
// import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators';

const createNew = async (req, res, next) => {
  const correctCondition = Joi.object({
    user_id: Joi.string().required(),
    displayName: Joi.string().required(),
    email: Joi.string().email().required(),
    photoURL: Joi.string().required(),
    refreshToken: Joi.string().required(),
  });

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    next(
      new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message)
    );
  }
};

const createNewWithPhoneNumber = async (req, res, next) => {
  const correctCondition = Joi.object({
    user_id: Joi.string().required(),
    phoneNumber: Joi.string().required(),
    refreshToken: Joi.string().required(),
  });

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    next(
      new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message)
    );
  }
};

export const userValidation = {
  createNew,
  createNewWithPhoneNumber,
};
