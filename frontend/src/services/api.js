import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

// Request Interceptor: Attach JWT Token automatically
api.interceptors.request.use(config => {
  const token = localStorage.getItem('waterwatch_token') || 'demo-officer-token';
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => Promise.reject(error));

// Helper for district param
const withDistrict = (url, district) => {
  if (!district || district === 'All') return url;
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}district=${encodeURIComponent(district)}`;
};

// Auth Service
export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
  registerOfficer: (details) => api.post('/auth/register-officer', details)
};

// Bowser API endpoints
export const bowserService = {
  getAll: (district) => api.get(withDistrict('/bowsers', district)),
  create: (data) => api.post('/bowsers', data),
  update: (id, data) => api.put(`/bowsers/${id}`, data),
  updateStatus: (id, status, currentLocation) => api.patch(`/bowsers/${id}/status`, { status, currentLocation }),
  delete: (id) => api.delete(`/bowsers/${id}`)
};

// Delivery API endpoints
export const deliveryService = {
  getAll: (district) => api.get(withDistrict('/deliveries', district)),
  create: (data) => api.post('/deliveries', data),
  update: (id, data) => api.put(`/deliveries/${id}`, data),
  updateStatus: (id, status) => api.patch(`/deliveries/${id}/status`, { status }),
  getByVillage: (villageId) => api.get(`/deliveries/village/${villageId}`),
  updateQueue: (id, actionPayload) => api.patch(`/deliveries/${id}/queue`, actionPayload)
};

// Water Shortage Reports API endpoints
export const reportService = {
  getAll: (district) => api.get(withDistrict('/water-reports', district)),
  verify: (id, statusPayload) => api.patch(`/water-reports/${id}/verify`, statusPayload)
};

// Tank Monitoring API endpoints
export const tankService = {
  getAll: (district) => api.get(withDistrict('/tanks', district)),
  getAlerts: (district) => api.get(withDistrict('/tanks/alerts', district)),
  getById: (id) => api.get(`/tanks/${id}`),
  updateLevel: (id, payload) => api.patch(`/tanks/${id}/level`, payload),
  getHistory: (id) => api.get(`/tanks/${id}/history`)
};

// Admin Control Center API endpoints
export const adminService = {
  getDashboard: (district) => api.get(withDistrict('/admin/dashboard', district)),
  getUsers: () => api.get('/admin/users'),
  updateUserStatus: (id, status) => api.patch(`/admin/users/${id}/status`, { status }),
  updateUserRole: (id, role) => api.patch(`/admin/users/${id}/role`, { role }),
  getAnalytics: (district) => api.get(withDistrict('/admin/analytics', district))
};

// Smart AI Priority Engine API endpoints
export const aiService = {
  getPriorities: (district) => api.get(withDistrict('/priorities', district)),
  getVillagePriority: (villageId) => api.get(`/priorities/${villageId}`),
  getRecommendation: () => api.get('/ai/recommendation'),
  getExplanation: (payload) => api.post('/ai/explanation', payload),
  getHealth: () => api.get('/ai/health')
};

// Health Check
export const checkHealth = () => api.get('/health');

export default api;
