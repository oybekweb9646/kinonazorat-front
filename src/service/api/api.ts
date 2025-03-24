import axios from 'axios';
import { getLanguage, getRefreshToken, getToken, setRefreshToken, setToken } from '../storage';
import { toast } from 'react-toastify';

export const baseURL = import.meta.env.VITE_APP_BASE_URL;
export const imageBaseUrl = import.meta.env.VITE_APP_BASE_URL;

export const api = axios.create({
  baseURL: `${baseURL}/api`,
});

api.interceptors.request.use(
  (config) => {
    config.headers.Authorization = `Bearer ${getToken()}`;
    config.headers['Accept-Language'] = getLanguage();
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

let failedQueue: any[] = [];
let isRefreshing: boolean = false;

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = token;
            return axios(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest.retry = true;
      isRefreshing = true;

      try {
        const { data } = await api.post('/auth/refresh-token', {
          refresh_token: getRefreshToken(),
        });

        setToken(data.data?.access_token);
        setRefreshToken(data.data?.refresh_token);

        originalRequest.headers.Authorization = `Bearer ${data.data?.access_token}`;

        processQueue(null, `Bearer ${data.data?.access_token}`);

        return await axios(originalRequest);
      } catch (err) {
        processQueue(err, null);
        window.location.href = `/login`;
      } finally {
        isRefreshing = false;
      }
    } else {
      if (error.response?.data?.data?.length > 0) {
        error.response.data.data?.map((item: any) => {
          return toast.error(item.message);
        });
      } else {
        toast.error(error.response?.data?.message || error.message);
      }
    }

    return Promise.reject(error);
  },
);
