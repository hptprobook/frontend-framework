import Joi from 'joi';
import { GET_DB } from '~/config/mongodb';
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators';
import { ObjectId } from 'mongodb';

const todoSchema = Joi.object({
  text: Joi.string().required(),
  childs: Joi.array()
    .items(
      Joi.object({
        text: Joi.string().required(),
        done: Joi.boolean().default(false),
      })
    )
    .default([]),
});

const CARD_COLLECTION_NAME = 'cards';

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
  todos: Joi.array().items(todoSchema).default([]),
  imgCover: Joi.string().default(null),
  members: Joi.array().items(Joi.string()).default([]),
  attachments: Joi.array().items(Joi.string()).default([]),
  comments: Joi.array()
    .items(
      Joi.object({
        userId: Joi.string().required(),
        text: Joi.string().required(),
      })
    )
    .default([]),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false),
});

const INVALID_UPDATE_FIELDS = ['_id', 'boardId', 'createdAt'];

const validateBeforeCreate = async (data) => {
  return await CARD_COLLECTION_SCHEMA.validateAsync(data, {
    abortEarly: false,
  });
};

const createNew = async (data) => {
  try {
    const validData = await validateBeforeCreate(data);

    return await GET_DB()
      .collection(CARD_COLLECTION_NAME)
      .insertOne({
        ...validData,
        boardId: new ObjectId(data.boardId),
        columnId: new ObjectId(data.columnId),
      });
  } catch (error) {
    throw new Error(error);
  }
};

const findOneById = async (id) => {
  try {
    const result = await GET_DB()
      .collection(CARD_COLLECTION_NAME)
      .findOne({ _id: new ObjectId(id) });
    if (!result) throw new Error(`Card not found for ${CARD_COLLECTION_NAME}`);
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const update = async (cardId, updateData) => {
  try {
    Object.keys(updateData).forEach((fieldName) => {
      if (INVALID_UPDATE_FIELDS.includes(fieldName)) {
        delete updateData[fieldName];
      }
    });

    if (updateData.columnId)
      updateData.columnId = new ObjectId(updateData.columnId);

    const result = await GET_DB()
      .collection(CARD_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(cardId) },
        { $set: updateData },
        { returnDocument: 'after' }
      );

    return result || null;
  } catch (error) {
    throw new Error(error);
  }
};

const addTodo = async (cardId, todoData) => {
  try {
    const { error, value } = todoSchema.validate(todoData);
    if (error)
      throw new Error(
        `Validation error: ${error.details.map((x) => x.message).join(', ')}`
      );

    await GET_DB()
      .collection(CARD_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(cardId) },
        { $push: { todos: { ...value, _id: new ObjectId() } } },
        { returnDocument: 'after' }
      );
  } catch (error) {
    throw new Error(error);
  }
};

const addTodoChild = async (cardId, childData) => {
  const childTodoSchema = Joi.object({
    todoId: Joi.string()
      .required()
      .pattern(OBJECT_ID_RULE)
      .message(OBJECT_ID_RULE_MESSAGE),
    text: Joi.string().required(),
    done: Joi.boolean().default(false),
  });

  try {
    const { error, value } = childTodoSchema.validate(childData);
    if (error) {
      throw new Error(
        `Validation error: ${error.details.map((x) => x.message).join(', ')}`
      );
    }

    await GET_DB()
      .collection(CARD_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(cardId), 'todos._id': new ObjectId(value.todoId) },
        {
          $push: {
            'todos.$.childs': {
              ...value,
              _id: new ObjectId(),
              done: value.done || false,
            },
          },
        },
        { returnDocument: 'after' }
      );
  } catch (error) {
    throw new Error(error);
  }
};

const deleteOneById = async (id) => {
  try {
    const result = await GET_DB()
      .collection(CARD_COLLECTION_NAME)
      .deleteOne({ _id: new ObjectId(id) });
    if (!result)
      throw new Error(`Column not found for ${CARD_COLLECTION_NAME}`);
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const deleteManyByColumnId = async (columnId) => {
  try {
    const result = await GET_DB()
      .collection(CARD_COLLECTION_NAME)
      .deleteMany({ columnId: new ObjectId(columnId) });
    if (!result)
      throw new Error(`Column not found for ${CARD_COLLECTION_NAME}`);
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const deleteManyByBoardId = async (boardId) => {
  try {
    const result = await GET_DB()
      .collection(CARD_COLLECTION_NAME)
      .deleteMany({ boardId: new ObjectId(boardId) });
    if (!result)
      throw new Error(`Column not found for ${CARD_COLLECTION_NAME}`);
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

export const cardModel = {
  createNew,
  findOneById,
  update,
  addTodo,
  addTodoChild,
  deleteManyByColumnId,
  deleteOneById,
  deleteManyByBoardId,
  CARD_COLLECTION_NAME,
  CARD_COLLECTION_SCHEMA,
};
