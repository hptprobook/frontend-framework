import { handleRequest } from '~/utils/request';

const userService = {
  getCurrent: () => handleRequest('get', '/v1/users/current'),
  findUser: (data) => handleRequest('post', '/v1/users/find', data),
  readNotify: (data) => handleRequest('post', '/v1/users/readNotify', data),
};

export default userService;
