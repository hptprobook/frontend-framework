import axios from 'axios';
import { API_ROOT } from '~/utils/constants';

const API_URL = `${API_ROOT}/v1`;

export const updateCardDetails = async ({ id, data }) => {
  const response = await axios.put(`${API_URL}/cards/${id}`, data);
  return response.data;
};

export const addTodoAPI = async ({ id, data }) => {
  const response = await axios.put(`${API_URL}/cards/${id}/addTodo`, data);
  return response.data;
};

export const updateTodoAPI = async ({ id, todoId, data }) => {
  const response = await axios.put(
    `${API_URL}/cards/${id}/todos/${todoId}`,
    data
  );

  return response.data;
};

export const addTodoChild = async ({ id, data }) => {
  const response = await axios.post(`${API_URL}/cards/${id}/addTodo`, data);
  return response.data;
};

export const addComment = async ({ id, data }) => {
  const response = await axios.post(`${API_URL}/cards/${id}/comments`, data);
  return response.data;
};

export const childDone = async ({ id, childId, data }) => {
  const response = await axios.put(
    `${API_URL}/cards/${id}/child/${childId}/done`,
    data
  );
  return response.data;
};

export const updateTodoChild = async ({ id, todoId, childId, data }) => {
  const response = await axios.put(
    `${API_URL}/cards/${id}/todos/${todoId}/child/${childId}`,
    data
  );

  return response.data;
};

export const updateCommentAPI = async ({ id, commentId, data }) => {
  const response = await axios.put(
    `${API_URL}/cards/${id}/comments/${commentId}/edit`,
    data
  );

  return response.data;
};

export const updateReplyCommentAPI = async ({
  id,
  commentId,
  replyId,
  data,
}) => {
  const response = await axios.put(
    `${API_URL}/cards/${id}/comments/${commentId}/replies/${replyId}`,
    data
  );

  return response.data;
};

export const deleteCommentAPI = async ({ id, commentId }) => {
  const response = await axios.delete(
    `${API_URL}/cards/${id}/comments/${commentId}`
  );

  return response.data;
};

export const deleteReplyCommentAPI = async ({ id, commentId, replyId }) => {
  const response = await axios.delete(
    `${API_URL}/cards/${id}/comments/${commentId}/replies/${replyId}`
  );

  return response.data;
};

export const deleteCardDetails = async ({ id }) => {
  const response = await axios.delete(`${API_URL}/cards/${id}`);
  return response.data;
};

export const deleteTodo = async ({ id, todoId }) => {
  const response = await axios.delete(`${API_URL}/cards/${id}/todos/${todoId}`);
  return response.data;
};

export const deleteTodoChild = async ({ id, todoId, childId }) => {
  const response = await axios.delete(
    `${API_URL}/cards/${id}/todos/${todoId}/child/${childId}`
  );
  return response.data;
};
