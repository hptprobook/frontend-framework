import { handleRequest } from '~/utils/request';

/* Cards */
export const updateCardDetails = async ({ id, data }) => {
  return handleRequest('put', `/v1/cards/${id}`, data);
};

export const addTodoAPI = async ({ id, data }) => {
  return handleRequest('put', `/v1/cards/${id}/addTodo`, data);
};

export const updateTodoAPI = async ({ id, todoId, data }) => {
  return handleRequest('put', `/v1/cards/${id}/todos/${todoId}`, data);
};

export const addTodoChild = async ({ id, data }) => {
  return handleRequest('post', `/v1/cards/${id}/addTodo`, data);
};

export const addComment = async ({ id, data }) => {
  return handleRequest('post', `/v1/cards/${id}/comments`, data);
};

export const childDone = async ({ id, childId, data }) => {
  return handleRequest('put', `/v1/cards/${id}/child/${childId}/done`, data);
};

export const updateTodoChild = async ({ id, todoId, childId, data }) => {
  return handleRequest(
    'put',
    `/v1/cards/${id}/todos/${todoId}/child/${childId}`,
    data
  );
};

export const updateCommentAPI = async ({ id, commentId, data }) => {
  return handleRequest(
    'put',
    `/v1/cards/${id}/comments/${commentId}/edit`,
    data
  );
};

export const updateReplyCommentAPI = async ({
  id,
  commentId,
  replyId,
  data,
}) => {
  return handleRequest(
    'put',
    `/v1/cards/${id}/comments/${commentId}/replies/${replyId}`,
    data
  );
};

export const deleteCommentAPI = async ({ id, commentId }) => {
  return handleRequest('delete', `/v1/cards/${id}/comments/${commentId}`);
};

export const deleteReplyCommentAPI = async ({ id, commentId, replyId }) => {
  return handleRequest(
    'delete',
    `/v1/cards/${id}/comments/${commentId}/replies/${replyId}`
  );
};

export const deleteCardDetails = async ({ id }) => {
  return handleRequest('delete', `/v1/cards/${id}`);
};

export const deleteTodo = async ({ id, todoId }) => {
  return handleRequest('delete', `/v1/cards/${id}/todos/${todoId}`);
};

export const deleteTodoChild = async ({ id, todoId, childId }) => {
  return handleRequest(
    'delete',
    `/v1/cards/${id}/todos/${todoId}/child/${childId}`
  );
};
