import { handleRequest } from '~/utils/request';

const authServices = {
  loginGoogle: (data) => handleRequest('post', '/v1/auth/google', data),
  loginWithPhoneNumber: (data) => handleRequest('post', '/v1/auth/phone', data),
};

export default authServices;
