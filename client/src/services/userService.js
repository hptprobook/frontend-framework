import { handleRequest } from '~/utils/request';

const userService = {
  getCurrent: () => handleRequest('get', '/v1/users/current'),
  findUser: (data) => handleRequest('post', '/v1/users/find', data),
  updateUser: (data) => handleRequest('put', '/v1/users', data),
  readNotify: (data) => handleRequest('post', '/v1/users/readNotify', data),
};

export default userService;
