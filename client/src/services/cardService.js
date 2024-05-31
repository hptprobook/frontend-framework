import { handleRequest } from '~/utils/request';

const cardServices = {
  createNewCardAPI: (data) => handleRequest('post', '/v1/cards', data),
  getDetails: (id) => handleRequest('get', `/v1/cards/${id}`),
  updateCardDetailsAPI: (id, data) =>
    handleRequest('put', `/v1/cards/${id}`, data),
  addTodo: (id, data) => handleRequest('put', `/v1/cards/${id}/addTodo`, data),
  addTodoChild: (id, data) =>
    handleRequest('post', `/v1/cards/${id}/addTodo`, data),
  addComment: (id, data) =>
    handleRequest('post', `/v1/cards/${id}/comments`, data),
  replyComment: (id, commentId, replyData) =>
    handleRequest('put', `/v1/cards/${id}/comments/${commentId}`, replyData),
  deleteCardAPI: (id) => handleRequest('delete', `/v1/cards/${id}`),
  deleteTodoAPI: (id, todoId) =>
    handleRequest('delete', `/v1/cards/${id}/todos/${todoId}`),
  deleteTodoChildAPI: (id, todoId, childId) =>
    handleRequest('delete', `/v1/cards/${id}/todos/${todoId}/child/${childId}`),
};

export default cardServices;
