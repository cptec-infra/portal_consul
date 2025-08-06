import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { Machine } from '../utilities/machines/types';

const api: AxiosInstance = axios.create({
  baseURL: 'http://portal_backend:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


// export const fetchMachines = async (): Promise<Machine[]> => {
//   const response = await api.get<Machine[]>('/nodes');
//   console.log('API /nodes response.data:', response.data);
//   return response.data;
// };


export const fetchMachines = async (): Promise<Machine[]> => {
  try {
    const response = await api.get<Machine[]>('/nodes');
    if (Array.isArray(response.data)) {
      return response.data;
    } else {
      console.warn('API /nodes returned data that is not an array:', response.data);
      return [];
    }
  } catch (error) {
    console.error('Error fetching machines:', error);
    return [];
  }
};

export const fetchMachinesDetails = async (): Promise<Machine[]> => {
  const response = await api.get<Machine[]>('/servicos');
  return response.data;
};


export default api;
