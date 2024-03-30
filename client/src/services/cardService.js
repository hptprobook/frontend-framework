import { handleRequest } from '~/utils/request';

const columnServices = {
  createNewCardAPI: (data) => handleRequest('post', '/v1/cards', data),
  updateCardDetailsAPI: (id, data) =>
    handleRequest('put', `/v1/cards/${id}`, data),
  deleteCardAPI: (id) => handleRequest('delete', `/v1/cards/${id}`),
};

export default columnServices;
