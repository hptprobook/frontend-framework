import { handleRequest } from '~/utils/request';

const cardServices = {
  /* Card API */
  createNewCardAPI: (data) => handleRequest('post', '/v1/cards', data),

  getDetails: (id) => handleRequest('get', `/v1/cards/${id}`),

  updateCardDetailsAPI: (id, data) =>
    handleRequest('put', `/v1/cards/${id}`, data),

  /* Todo */
  addTodo: (id, data) => handleRequest('put', `/v1/cards/${id}/addTodo`, data),

  addTodoChild: (id, data) =>
    handleRequest('post', `/v1/cards/${id}/addTodo`, data),

  /* Comment */
  addComment: (id, data) =>
    handleRequest('post', `/v1/cards/${id}/comments`, data),

  updateCommentReaction: (cardId, commentId, data) =>
    handleRequest(
      'put',
      `/v1/cards/${cardId}/comments/${commentId}/reactions`,
      data
    ),

  updateReplyCommentReaction: (cardId, commentId, replyId, data) =>
    handleRequest(
      'put',
      `/v1/cards/${cardId}/${commentId}/${replyId}/reactions`,
      data
    ),

  removeCommentReaction: (cardId, commentId) =>
    handleRequest('get', `/v1/cards/${cardId}/comments/${commentId}/reactions`),

  removeReplyCommentReaction: (cardId, commentId, replyId) =>
    handleRequest(
      'get',
      `/v1/cards/${cardId}/${commentId}/${replyId}/reactions`
    ),

  replyComment: (id, commentId, replyData) =>
    handleRequest('put', `/v1/cards/${id}/comments/${commentId}`, replyData),

  deleteCardAPI: (id) => handleRequest('delete', `/v1/cards/${id}`),

  deleteTodoAPI: (id, todoId) =>
    handleRequest('delete', `/v1/cards/${id}/todos/${todoId}`),

  deleteTodoChildAPI: (id, todoId, childId) =>
    handleRequest('delete', `/v1/cards/${id}/todos/${todoId}/child/${childId}`),
};

export default cardServices;
