import { handleRequest } from '~/utils/request';

export const fetchBoardDetailsAPI = async (boardId) => {
  return handleRequest('get', `/v1/boards/${boardId}`);
};

export const updateBoardDetailsAPI = async (boardId, updateData) => {
  return handleRequest('put', `/v1/boards/${boardId}`, updateData);
};

export const moveCardDifferentColumnAPI = async (updateData) => {
  return handleRequest('put', '/v1/boards/supports/moving_card', updateData);
};

/* Columns */
export const createNewColumnAPI = async (newColumnData) => {
  return handleRequest('post', '/v1/columns', newColumnData);
};

export const updateColumnDetailsAPI = async (columnId, updateData) => {
  return handleRequest('put', `/v1/columns/${columnId}`, updateData);
};

export const changeColumnTitleAPI = async (columnId, updateData) => {
  return handleRequest('put', `/v1/columns/${columnId}/title`, updateData);
};

export const deleteColumnDetailsAPI = async (columnId) => {
  return handleRequest('delete', `/v1/columns/${columnId}`);
};

/* Cards */
export const createNewCardAPI = async (newCardData) => {
  return handleRequest('post', '/v1/cards', newCardData);
};
