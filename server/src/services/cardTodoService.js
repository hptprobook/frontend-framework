import { ObjectId } from 'mongodb';
import { cardModel } from '~/models/cardModel';
import { cardSchema } from '~/models/schema/cardSchema';

const addTodo = async (cardId, todoData) => {
  try {
    const { error, value } = cardSchema.TODO_SCHEMA.validate(todoData);
    if (error) {
      throw new Error(
        `Validation error: ${error.details.map((x) => x.message).join(', ')}`
      );
    }

    const newTodoId = new ObjectId();
    const card = await cardModel.findOneById(cardId);
    if (!card) {
      throw new Error(`Card not found for id ${cardId}`);
    }

    card.todos.push({ ...value, _id: newTodoId });
    card.todoOrderIds.push(newTodoId);

    await cardModel.update(cardId, {
      todos: card.todos,
      todoOrderIds: card.todoOrderIds,
    });

    return { ...value, _id: newTodoId };
  } catch (error) {
    throw new Error(error);
  }
};

const addTodoChild = async (cardId, childData) => {
  try {
    const { error, value } = cardSchema.CHILD_TODO_SCHEMA.validate(childData);
    if (error) {
      throw new Error(
        `Validation error: ${error.details.map((x) => x.message).join(', ')}`
      );
    }

    const newChildId = new ObjectId();
    const card = await cardModel.findOneById(cardId);
    if (!card) {
      throw new Error(`Card not found for id ${cardId}`);
    }

    const todo = card.todos.find((todo) =>
      todo._id.equals(new ObjectId(value.todoId))
    );
    if (!todo) {
      throw new Error(`Todo not found in card ${cardId}`);
    }

    const todoChildData = { ...value, _id: newChildId };

    todo.childs.push(todoChildData);
    todo.childOrderIds.push(newChildId);

    return await cardModel.update(cardId, { todos: card.todos });
  } catch (error) {
    throw new Error(error);
  }
};

const updateTodo = async (cardId, todoId, updateData) => {
  try {
    const card = await cardModel.findOneById(cardId);
    if (!card) {
      throw new Error(`Card not found for id ${cardId}`);
    }

    const todoIndex = card.todos.findIndex((todo) =>
      todo._id.equals(new ObjectId(todoId))
    );
    if (todoIndex === -1) {
      throw new Error(`Todo not found in card ${cardId}`);
    }

    Object.assign(card.todos[todoIndex], updateData);
    return await cardModel.update(cardId, { todos: card.todos });
  } catch (error) {
    throw new Error(error);
  }
};

const updateTodoChild = async (cardId, todoId, childId, updateData) => {
  try {
    const card = await cardModel.findOneById(cardId);
    if (!card) {
      throw new Error(`Card not found for id ${cardId}`);
    }

    const todo = card.todos.find((todo) =>
      todo._id.equals(new ObjectId(todoId))
    );
    if (!todo) {
      throw new Error(`Todo not found in card ${cardId}`);
    }

    const childIndex = todo.childs.findIndex((child) =>
      child._id.equals(new ObjectId(childId))
    );
    if (childIndex === -1) {
      throw new Error(`Child not found in todo ${todoId}`);
    }

    Object.assign(todo.childs[childIndex], updateData);
    return await cardModel.update(cardId, { todos: card.todos });
  } catch (error) {
    throw new Error(error);
  }
};

const childDone = async (cardId, childId, reqBody) => {
  try {
    const card = await cardModel.findOneById(cardId);

    if (!card) {
      throw new Error(`Card not found for cardId ${cardId}`);
    }

    const todo = card.todos.find((todo) =>
      todo.childs.some((child) => child._id.equals(new ObjectId(childId)))
    );

    if (!todo) {
      throw new Error(`Todo not found for childId ${childId}`);
    }

    const child = todo.childs.find((child) =>
      child._id.equals(new ObjectId(childId))
    );

    if (!child) {
      throw new Error(`Child not found with id ${childId}`);
    }

    child.done = reqBody.done;

    await cardModel.update(card._id, { todos: card.todos });

    return { ...child, done: true };
  } catch (error) {
    throw new Error(error);
  }
};

const deleteTodo = async (cardId, todoId) => {
  try {
    const card = await cardModel.findOneById(cardId);
    if (!card) {
      throw new Error(`Card not found for id ${cardId}`);
    }

    card.todos = card.todos.filter(
      (todo) => !todo._id.equals(new ObjectId(todoId))
    );
    card.todoOrderIds = card.todoOrderIds.filter(
      (id) => !id.equals(new ObjectId(todoId))
    );

    return await cardModel.update(cardId, {
      todos: card.todos,
      todoOrderIds: card.todoOrderIds,
    });
  } catch (error) {
    throw new Error(error);
  }
};

const deleteTodoChild = async (cardId, todoId, childId) => {
  try {
    const card = await cardModel.findOneById(cardId);
    if (!card) {
      throw new Error(`Card not found for id ${cardId}`);
    }

    const todo = card.todos.find((todo) =>
      todo._id.equals(new ObjectId(todoId))
    );
    if (!todo) {
      throw new Error(`Todo not found in card ${cardId}`);
    }

    todo.childs = todo.childs.filter(
      (child) => !child._id.equals(new ObjectId(childId))
    );
    todo.childOrderIds = todo.childOrderIds.filter(
      (id) => !id.equals(new ObjectId(childId))
    );

    return await cardModel.update(cardId, { todos: card.todos });
  } catch (error) {
    throw new Error(error);
  }
};

export const cardTodoServices = {
  addTodo,
  addTodoChild,
  updateTodo,
  updateTodoChild,
  childDone,
  deleteTodo,
  deleteTodoChild,
};
