import axios from 'axios';
import { API_ROOT } from '../utils/constants';

const accessToken = localStorage.getItem('accessToken');

const request = axios.create({
  baseURL: API_ROOT,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${accessToken}`,
  },
});

axios.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers['Authorization'] = 'Bearer ' + accessToken;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default request;
