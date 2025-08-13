import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { Machine } from '../utilities/machines/types';

const api: AxiosInstance = axios.create({
  baseURL: process.env.CONSUL_HOST_LOCAL || 'http://localhost:8000/api',
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
  const response = await api.get<{nodes: Machine[]}>('/nodes/');
  return response.data.nodes;
};

export const fetchMachinesDetails = async (): Promise<Machine[]> => {
  const response = await api.get<Machine[]>('/servicos/');
  return response.data;
};

export async function fetchMachineHistory(node: string) {
  try {
    const res = await api.get(`/history/${node}`);
    return res.data;
  } catch (error) {
    throw new Error('Erro ao buscar histórico');
  }
}


export default api;