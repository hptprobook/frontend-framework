import axios from 'axios';
import { API_ROOT } from './constants';

const request = axios.create({
  baseURL: API_ROOT,
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'token',
  },
});

request.interceptors.request.use((config) => {
  config.headers.Authorization = 'token';

  return config;
});

export default request;
