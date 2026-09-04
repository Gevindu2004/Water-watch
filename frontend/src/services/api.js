import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

// Bowser API endpoints
export const bowserService = {
  getAll: () => api.get('/bowsers'),
  create: (data) => api.post('/bowsers', data),
  update: (id, data) => api.put(`/bowsers/${id}`, data),
  updateStatus: (id, status, currentLocation) => api.patch(`/bowsers/${id}/status`, { status, currentLocation })
};

// Delivery API endpoints
export const deliveryService = {
  getAll: () => api.get('/deliveries'),
  create: (data) => api.post('/deliveries', data),
  update: (id, data) => api.put(`/deliveries/${id}`, data),
  updateStatus: (id, status) => api.patch(`/deliveries/${id}/status`, { status }),
  getByVillage: (villageId) => api.get(`/deliveries/village/${villageId}`),
  updateQueue: (id, actionPayload) => api.patch(`/deliveries/${id}/queue`, actionPayload)
};

// Health Check
export const checkHealth = () => api.get('/health');

export default api;
