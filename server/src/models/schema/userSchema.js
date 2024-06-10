import Joi from 'joi';

const USER_COLLECTION_NAME = 'users';
const USER_COLLECTION_SCHEMA = Joi.object({
  user_id: Joi.string().required(),
  displayName: Joi.string().required(),
  email: Joi.string().email().required(),
  photoURL: Joi.string().required(),
  notifies: Joi.array().default([]),
  phoneNumber: Joi.string().default(''),
  refreshToken: Joi.string().required(),
  createdAt: Joi.date().timestamp('javascript').default(Date.now()),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  loginMethod: Joi.string()
    .valid('phone', 'email', 'facebook')
    .default('email'),
  _destroy: Joi.boolean().default(false),
});

const USER_LOGIN_PHONE_SCHEMA = Joi.object({
  user_id: Joi.string().required(),
  displayName: Joi.string().default(''),
  email: Joi.string().email().default(''),
  photoURL: Joi.string().default(''),
  notifies: Joi.array().default([]),
  phoneNumber: Joi.string().required(),
  loginMethod: Joi.string()
    .valid('phone', 'email', 'facebook')
    .default('phone'),
  refreshToken: Joi.string().required(),
  createdAt: Joi.date().timestamp('javascript').default(Date.now()),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false),
});

const USER_LOGIN_FACEBOOK_SCHEMA = Joi.object({
  user_id: Joi.string().required(),
  displayName: Joi.string().required(),
  email: Joi.string().email().default(''),
  photoURL: Joi.string().required(),
  notifies: Joi.array().default([]),
  phoneNumber: Joi.string().default(''),
  loginMethod: Joi.string()
    .valid('phone', 'email', 'facebook')
    .default('facebook'),
  refreshToken: Joi.string().required(),
  createdAt: Joi.date().timestamp('javascript').default(Date.now()),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false),
});

export const userSchema = {
  USER_COLLECTION_NAME,
  USER_COLLECTION_SCHEMA,
  USER_LOGIN_PHONE_SCHEMA,
  USER_LOGIN_FACEBOOK_SCHEMA,
};
