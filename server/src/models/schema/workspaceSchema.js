import Joi from 'joi';
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators';
import { BOARD_TYPES } from '~/utils/constants';

const WORKSPACE_COLLECTION_NAME = 'workspaces';
const WORKSPACE_COLLECTION_SCHEMA = Joi.object({
  title: Joi.string().required().min(3).max(50).trim().strict(),
  description: Joi.string().required().min(3).max(256).trim().strict(),
  type: Joi.string()
    .valid(...BOARD_TYPES)
    .required(),
  boardIds: Joi.array()
    .items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE))
    .default([]),
  members: Joi.array()
    .items(
      Joi.object({
        memberId: Joi.string(),
        rule: Joi.string().valid('creator', 'owner', 'member'),
      })
    )
    .default([]),
  createdAt: Joi.date().timestamp('javascript').default(Date.now()),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false),
});

export const workspaceSchema = {
  WORKSPACE_COLLECTION_NAME,
  WORKSPACE_COLLECTION_SCHEMA,
};
