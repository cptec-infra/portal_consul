import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { Machine } from '../utilities/machines/types';

const api: AxiosInstance = axios.create({
  baseURL: process.env.CONSUL_HOST_LOCAL || 'http://150.163.190.18:8000/api',
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


export async function fetchMachineHistory(node: string) {
  console.log('entrei?')
  const res = await fetch(`/history/${node}`);
  if (!res.ok) throw new Error('Erro ao buscar histórico');
  return res.json();
}

export default api;