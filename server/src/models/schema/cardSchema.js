import Joi from 'joi';
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators';
import { REACTION_TYPES } from '~/utils/constants';

const CARD_COLLECTION_NAME = 'cards';

const TODO_SCHEMA = Joi.object({
  text: Joi.string().required(),
  childOrderIds: Joi.array().default([]),
  childs: Joi.array()
    .items(
      Joi.object({
        text: Joi.string().required(),
        done: Joi.boolean().default(false),
      })
    )
    .default([]),
});

const CARD_COLLECTION_SCHEMA = Joi.object({
  boardId: Joi.string()
    .required()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE),
  columnId: Joi.string()
    .required()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE),
  title: Joi.string().required().min(3).max(50).trim().strict(),
  description: Joi.string().optional(),
  todos: Joi.array().items(TODO_SCHEMA).default([]),
  todoOrderIds: Joi.array()
    .items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE))
    .default([]),
  imgCover: Joi.string().default(null),
  members: Joi.array().items(Joi.string()).default([]),
  attachments: Joi.array().items(Joi.string()).default([]),
  comments: Joi.array()
    .items(
      Joi.object({
        userId: Joi.string().required(),
        photoURL: Joi.string().default(null),
        userName: Joi.string().required().min(3).max(50).trim().strict(),
        text: Joi.string().required(),
      })
    )
    .default([]),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false),
});

const COMMENT_SCHEMA = Joi.object({
  userId: Joi.string().required(),
  userName: Joi.string().required().min(3).max(50).trim().strict(),
  photoURL: Joi.string().default(null),
  content: Joi.string().required().min(1).max(500).trim().strict(),
  emotions: Joi.object()
    .keys(
      REACTION_TYPES.reduce((acc, reaction) => {
        acc[reaction] = Joi.array().items(Joi.string());
        return acc;
      }, {})
    )
    .default(
      REACTION_TYPES.reduce((acc, reaction) => {
        acc[reaction] = [];
        return acc;
      }, {})
    ),
  replies: Joi.array()
    .items(
      Joi.object({
        userId: Joi.string().required(),
        content: Joi.string().required().min(1).max(500).trim().strict(),
        createdAt: Joi.date().timestamp('javascript').default(Date.now),
      })
    )
    .default([]),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
});

const REPLY_COMMENT_SCHEMA = Joi.object({
  userId: Joi.string().required(),
  userName: Joi.string().required().min(3).max(50).trim().strict(),
  photoURL: Joi.string().default(null),
  content: Joi.string().required().min(1).max(500).trim().strict(),
  emotions: Joi.object()
    .keys(
      REACTION_TYPES.reduce((acc, reaction) => {
        acc[reaction] = Joi.array().items(
          Joi.object({
            userId: Joi.string().required(),
            userName: Joi.string().required(),
          })
        );
        return acc;
      }, {})
    )
    .default(
      REACTION_TYPES.reduce((acc, reaction) => {
        acc[reaction] = [];
        return acc;
      }, {})
    ),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
});

const CHILD_TODO_SCHEMA = Joi.object({
  todoId: Joi.string()
    .required()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE),
  text: Joi.string().required(),
  done: Joi.boolean().default(false),
});

export const cardSchema = {
  TODO_SCHEMA,
  CARD_COLLECTION_NAME,
  CARD_COLLECTION_SCHEMA,
  COMMENT_SCHEMA,
  REPLY_COMMENT_SCHEMA,
  CHILD_TODO_SCHEMA,
};
