import { handleRequest } from '~/utils/request';

const boardServices = {
  createNewBoardAPI: (data) => handleRequest('post', '/v1/boards', data),
  getAllBoardsAPI: () => handleRequest('get', '/v1/boards'),
  getBoardDetailAPI: (id) => handleRequest('get', `/v1/boards/${id}`),
  getOtherBoard: () => handleRequest('get', '/v1/boards/invited'),
  updateBoardDetailsAPI: (id, data) =>
    handleRequest('put', `/v1/boards/${id}`, data),
  deleteBoardAPI: (id) => handleRequest('delete', `/v1/boards/${id}`),
};

export default boardServices;
