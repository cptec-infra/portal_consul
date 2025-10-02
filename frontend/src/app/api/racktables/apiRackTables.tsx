import { Racks } from '@/app/utilities/racks/types';
import { RackDetails, RackObject } from '@/app/utilities/racks/[id]/page';
import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL_RACKTABLES,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    console.log('API Base URL:', process.env.NEXT_PUBLIC_API_BASE_URL_RACKTABLES);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const fetchRacks = async (): Promise<Racks[]> => {
  try {
    const response = await api.get<Racks[]>('/racks');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar racks:', error);
    throw new Error('Erro ao buscar racks');
  }
};

export const fetchRackDetails = async (rackId: string): Promise<{ rack: RackDetails; objects: RackObject[] }> => {
  try {
    const response = await api.get<{ rack: RackDetails, objects: RackObject[] }>(`/rack/${rackId}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar detalhes do rack ${rackId}:`, error);
    throw new Error('Erro ao buscar detalhes do rack');
  }
};

// FUNÇÕES PARA EQUIPAMENTOS
export const fetchEquipments = async (): Promise<Equipment[]> => {
  try {
    const response = await api.get<Equipment[]>('/objects');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar equipamentos:', error);
    throw new Error('Erro ao buscar equipamentos');
  }
};

export const fetchEquipmentDetails = async (equipmentId: string): Promise<EquipmentResponse> => {
  try {
    const response = await api.get<EquipmentResponse>(`/object/${equipmentId}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar detalhes do equipamento ${equipmentId}:`, error);
    throw new Error('Erro ao buscar detalhes do equipamento');
  }
};

// NOVAS FUNÇÕES PARA RESPONSÁVEIS
export const fetchContacts = async (): Promise<Contact[]> => {
  try {
    const response = await api.get<Contact[]>('/contacts');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar contatos:', error);
    throw new Error('Erro ao buscar contatos');
  }
};

export const fetchContactEquipments = async (contactName: string): Promise<ContactEquipment[]> => {
  try {
    const encodedName = encodeURIComponent(contactName);
    const response = await api.get<ContactEquipment[]>(`/objects/by_person/${encodedName}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar equipamentos do contato ${contactName}:`, error);
    throw new Error('Erro ao buscar equipamentos do contato');
  }
};

// FUNÇÕES DE EXPORTAÇÃO
export const exportRacksToXLSX = async (): Promise<Blob> => {
  try {
    const response = await api.get('/racks/export/xlsx', {
      responseType: 'blob', // Importante para arquivos
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao exportar racks:', error);
    throw new Error('Erro ao exportar racks para XLSX');
  }
};

export const exportRackObjectsToXLSX = async (rackId: string): Promise<Blob> => {
  try {
    const response = await api.get(`/objects/rack/${rackId}/export/xlsx`, {
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
    console.error(`Erro ao exportar objetos do rack ${rackId}:`, error);
    throw new Error('Erro ao exportar objetos para XLSX');
  }
};

export const exportEquipmentsToXLSX = async (): Promise<Blob> => {
  try {
    const response = await api.get('/objects/export/xlsx', {
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao exportar equipamentos:', error);
    throw new Error('Erro ao exportar equipamentos para XLSX');
  }
};

export const exportContactsToXLSX = async (): Promise<Blob> => {
  try {
    const response = await api.get('/contacts/export/xlsx', {
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao exportar contatos:', error);
    throw new Error('Erro ao exportar contatos para XLSX');
  }
};