import { handleRequest } from '~/utils/request';

const authServices = {
  loginGoogle: (data) => handleRequest('post', '/v1/auth/google', data),
  loginWithPhoneNumber: (data) => handleRequest('post', '/v1/auth/phone', data),
  loginWithFacebook: (data) => handleRequest('post', '/v1/auth/facebook', data),
};

export default authServices;
