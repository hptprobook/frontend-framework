import axios from 'axios';
import { API_ROOT } from '../utils/constants';
import { toast } from 'react-toastify';

const accessToken = localStorage.getItem('accessToken');

const request = axios.create({
  baseURL: API_ROOT,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${accessToken}`,
  },
});

request.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await axios.post(
          `${API_ROOT}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const newAccessToken = response.data.accessToken;

        localStorage.setItem('accessToken', newAccessToken);
        axios.defaults.headers.common[
          'Authorization'
        ] = `Bearer ${newAccessToken}`;

        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

        return axios(originalRequest);
      } catch (e) {
        toast.error('Session expired. Please log in again.');
        return Promise.reject(e);
      }
    }

    return Promise.reject(error);
  }
);

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
