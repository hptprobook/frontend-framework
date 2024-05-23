import { handleRequest } from '~/utils/request';

const workspaceService = {
  getAllWorkspaceAPI: () => handleRequest('get', '/v1/w'),
  getDetailWorkspaceAPI: (id) => handleRequest('get', `/v1/w/${id}`),
  createNewWorkspaceAPI: (data) => handleRequest('post', '/v1/w', data),
  updateWorkspaceAPI: (id, data) => handleRequest('put', `/v1/w/${id}`, data),
  inviteMemberToWorkspaceAPI: (id, data) =>
    handleRequest('post', `/v1/w/invite/${id}`, data),
  deleteWorkspaceAPI: (id) => handleRequest('delete', `/v1/w/${id}`),
};

export default workspaceService;
