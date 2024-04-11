import { handleRequest } from '~/utils/request';

const columnServices = {
  createNewCardAPI: (data) => handleRequest('post', '/v1/cards', data),
  getDetails: (id) => handleRequest('get', `/v1/cards/${id}`),
  updateCardDetailsAPI: (id, data) =>
    handleRequest('put', `/v1/cards/${id}`, data),
  addTodo: (id, data) => handleRequest('put', `/v1/cards/${id}/addTodo`, data),
  addTodoChild: (id, data) =>
    handleRequest('post', `/v1/cards/${id}/addTodo`, data),
  deleteCardAPI: (id) => handleRequest('delete', `/v1/cards/${id}`),
};

export default columnServices;
