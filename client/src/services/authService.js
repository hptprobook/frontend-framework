import { handleRequest } from '~/utils/request';

const authServices = {
  loginGoogle: (data) => handleRequest('post', '/v1/auth/google', data),
};

export default authServices;
