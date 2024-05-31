import Joi from 'joi';
import { GET_DB } from '~/config/mongodb';
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators';
import { ObjectId } from 'mongodb';

const todoSchema = Joi.object({
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
  content: Joi.string().required().min(1).max(500).trim().strict(),
  emotion: Joi.string()
    .optional()
    .valid('like', 'love', 'haha', 'wow', 'sad', 'angry')
    .default(null),
  replies: Joi.array()
    .items(
      Joi.object({
        userId: Joi.string().required(),
        userName: Joi.string().required().min(3).max(50).trim().strict(),
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
  content: Joi.string().required().min(1).max(500).trim().strict(),
  emotion: Joi.string()
    .optional()
    .valid('like', 'love', 'haha', 'wow', 'sad', 'angry')
    .default(null),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
});

const INVALID_UPDATE_FIELDS = ['_id', 'boardId', 'createdAt'];

const validateBeforeCreate = async (data) => {
  return await CARD_COLLECTION_SCHEMA.validateAsync(data, {
    abortEarly: false,
  });
};

const validateComment = async (data) => {
  return await COMMENT_SCHEMA.validateAsync(data, { abortEarly: false });
};

const validateReplyComment = async (data) => {
  return await REPLY_COMMENT_SCHEMA.validateAsync(data, { abortEarly: false });
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

    const newTodoId = new ObjectId();
    const result = await GET_DB()
      .collection(CARD_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(cardId) },
        {
          $push: {
            todos: { ...value, _id: newTodoId },
            todoOrderIds: newTodoId,
          },
        },
        { returnDocument: 'after' }
      );

    return result.value;
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

    const newChildId = new ObjectId();
    await GET_DB()
      .collection(CARD_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(cardId), 'todos._id': new ObjectId(value.todoId) },
        {
          $push: {
            'todos.$.childs': { ...value, _id: newChildId },
            'todos.$.childOrderIds': newChildId,
          },
        },
        { returnDocument: 'after' }
      );
  } catch (error) {
    throw new Error(error);
  }
};

const updateTodo = async (cardId, todoId, updateData) => {
  try {
    const result = await GET_DB()
      .collection(CARD_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(cardId), 'todos._id': new ObjectId(todoId) },
        { $set: { 'todos.$': updateData } },
        { returnDocument: 'after' }
      );

    if (!result.value) throw new Error(`Todo not found in card ${cardId}`);
    return result.value;
  } catch (error) {
    throw new Error(error);
  }
};

const updateTodoChild = async (cardId, todoId, childId, updateData) => {
  try {
    const result = await GET_DB()
      .collection(CARD_COLLECTION_NAME)
      .findOneAndUpdate(
        {
          _id: new ObjectId(cardId),
          'todos._id': new ObjectId(todoId),
          'todos.childs._id': new ObjectId(childId),
        },
        { $set: { 'todos.$[i].childs.$[j]': updateData } },
        {
          arrayFilters: [
            { 'i._id': new ObjectId(todoId) },
            { 'j._id': new ObjectId(childId) },
          ],
          returnDocument: 'after',
        }
      );

    if (!result.value) throw new Error(`Child not found in todo ${todoId}`);
    return result.value;
  } catch (error) {
    throw new Error(error);
  }
};

const addComment = async (cardId, commentData) => {
  try {
    const validCommentData = await validateComment(commentData);

    return await GET_DB()
      .collection(CARD_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(cardId) },
        { $push: { comments: { ...validCommentData, _id: new ObjectId() } } },
        { returnDocument: 'after' }
      );
  } catch (error) {
    throw new Error(error);
  }
};

const updateComment = async (cardId, commentId, updateData) => {
  try {
    updateData.updatedAt = Date.now();

    const result = await GET_DB()
      .collection(CARD_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(cardId), 'comments._id': new ObjectId(commentId) },
        { $set: { 'comments.$': updateData } },
        { returnDocument: 'after' }
      );

    if (!result.value) throw new Error(`Comment not found in card ${cardId}`);
    return result.value;
  } catch (error) {
    throw new Error(error);
  }
};

const deleteComment = async (cardId, commentId) => {
  try {
    const result = await GET_DB()
      .collection(CARD_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(cardId) },
        { $pull: { comments: { _id: new ObjectId(commentId) } } },
        { returnDocument: 'after' }
      );

    if (!result.value) throw new Error(`Comment not found in card ${cardId}`);
    return result.value;
  } catch (error) {
    throw new Error(error);
  }
};

const replyComment = async (cardId, commentId, replyData) => {
  try {
    const validReplyCommentData = await validateReplyComment(replyData);

    return await GET_DB()
      .collection(CARD_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(cardId), 'comments._id': new ObjectId(commentId) },
        { $push: { 'comments.$.replies': validReplyCommentData } },
        { returnDocument: 'after' }
      );
  } catch (error) {
    throw new Error(error);
  }
};

const deleteTodo = async (cardId, todoId) => {
  try {
    const result = await GET_DB()
      .collection(CARD_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(cardId) },
        {
          $pull: {
            todos: { _id: new ObjectId(todoId) },
            todoOrderIds: new ObjectId(todoId),
          },
        },
        { returnDocument: 'after' }
      );
    if (!result.value) throw new Error(`Todo not found in card ${cardId}`);
    return result.value;
  } catch (error) {
    throw new Error(error);
  }
};

const deleteTodoChild = async (cardId, todoId, childId) => {
  try {
    const result = await GET_DB()
      .collection(CARD_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(cardId), 'todos._id': new ObjectId(todoId) },
        {
          $pull: {
            'todos.$.childs': { _id: new ObjectId(childId) },
            'todos.$.childOrderIds': new ObjectId(childId),
          },
        },
        { returnDocument: 'after' }
      );
    if (!result.value) throw new Error(`Child not found in todo ${todoId}`);
    return result.value;
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
  updateTodo,
  updateTodoChild,
  addComment,
  updateComment,
  replyComment,
  deleteComment,
  deleteTodo,
  deleteTodoChild,
  deleteManyByColumnId,
  deleteOneById,
  deleteManyByBoardId,
  CARD_COLLECTION_NAME,
  CARD_COLLECTION_SCHEMA,
};
