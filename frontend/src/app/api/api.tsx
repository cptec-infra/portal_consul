import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { Machine } from '../utilities/machines/types';

const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://150.163.212.76:8000/api',
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


export const fetchMachines = async (): Promise<Machine[]> => {
  const response = await api.get<Machine[]>('/nodes');
  return response.data;
};

export const fetchMachinesDetails = async (): Promise<Machine[]> => {
  const response = await api.get<Machine[]>('/servicos');
  return response.data;
};


export default api;
