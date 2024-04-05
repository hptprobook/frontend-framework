import { handleRequest } from '~/utils/request';

const userService = {
  getCurrent: () => handleRequest('get', '/v1/user/current'),
};

export default userService;
