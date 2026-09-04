import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getVillages = () => api.get('/villages');
export const addVillage = (data) => api.post('/villages', data);
export const getVillageStatus = (id) => api.get(`/villages/${id}/status`);
export const updateVillage = (id, data) => api.put(`/villages/${id}`, data);
export const createWaterReport = (data) => api.post('/water-reports', data);
export const getVillageReports = (villageId) => api.get(`/water-reports/village/${villageId}`);
export const getVillageDeliveries = (villageId) => api.get(`/deliveries/village/${villageId}`);
export const joinDeliveryQueue = (deliveryId) => api.post(`/deliveries/${deliveryId}/join-queue`);

export default api;
