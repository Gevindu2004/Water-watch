import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchTanks = async () => {
  const response = await api.get('/tanks');
  return response.data;
};

export const fetchTankById = async (id) => {
  const response = await api.get(`/tanks/${id}`);
  return response.data;
};

export const fetchTankAlerts = async () => {
  const response = await api.get('/tanks/alerts');
  return response.data;
};

export const fetchDashboardSummary = async () => {
  const response = await api.get('/dashboard/summary');
  return response.data;
};

export const updateTankLevel = async (id, levelData) => {
  const response = await api.patch(`/tanks/${id}/level`, levelData);
  return response.data;
};

export const updateTankDetails = async (id, tankData) => {
  const response = await api.put(`/tanks/${id}`, tankData);
  return response.data;
};

export const seedDatabaseApi = async () => {
  const response = await api.post('/tanks/seed');
  return response.data;
};

export default api;
