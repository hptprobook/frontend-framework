import { handleRequest } from '~/utils/request';

const columnServices = {
  createNewColumnAPI: (data) =>
    handleRequest('post', '/v1/boards/supports/moving_card', data),
  updateColumnDetailsAPI: (id, data) =>
    handleRequest('put', `/v1/columns/${id}`, data),
  changeTitle: (id, data) =>
    handleRequest('put', `/v1/columns/${id}/title`, data),
  deleteColumnDetailsAPI: (id) => handleRequest('delete', `/v1/columns/${id}`),
};

export default columnServices;
