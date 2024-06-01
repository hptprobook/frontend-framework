import Joi from 'joi';

const USER_COLLECTION_NAME = 'users';
const USER_COLLECTION_SCHEMA = Joi.object({
  user_id: Joi.string().required(),
  displayName: Joi.string().required(),
  email: Joi.string().email().required(),
  photoURL: Joi.string().required(),
  notifies: Joi.array().default([]),
  refreshToken: Joi.string().required(),
  createdAt: Joi.date().timestamp('javascript').default(Date.now()),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false),
});

export const userSchema = {
  USER_COLLECTION_NAME,
  USER_COLLECTION_SCHEMA,
};
