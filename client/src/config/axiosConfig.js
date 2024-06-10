import axios from 'axios';
import { API_ROOT } from '../utils/constants';
import { jwtDecode } from 'jwt-decode';
import dayjs from 'dayjs';

const accessToken = localStorage.getItem('accessToken');

const request = axios.create({
  baseURL: API_ROOT,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${accessToken}`,
  },
  withCredentials: true,
});

axios.interceptors.request.use(
  async (config) => {
    if (accessToken) {
      config.headers['Authorization'] = 'Bearer ' + accessToken;
    }

    const user = jwtDecode(accessToken);
    const isTokenExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;
    if (!isTokenExpired) return config;

    const response = await axios.get(`${API_ROOT}/v1/auth/refresh`);
    localStorage.setItem('accessToken', response.data.accessToken);

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default request;
