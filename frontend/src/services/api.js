import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 8000
});

export const getPriorities = async () => {
  const res = await api.get('/priorities');
  return res.data;
};

export const getPriorityByVillage = async (villageId) => {
  const res = await api.get(`/priorities/${villageId}`);
  return res.data;
};

export const getRecommendation = async () => {
  const res = await api.get('/ai/recommendation');
  return res.data;
};

export const generateExplanation = async (data) => {
  const res = await api.post('/ai/explanation', data);
  return res.data;
};

export const getAiHealth = async () => {
  const res = await api.get('/ai/health');
  return res.data;
};

export const getBowsers = async () => {
  const res = await api.get('/bowsers');
  return res.data;
};

export const dispatchBowser = async (payload) => {
  const res = await api.post('/bowsers/dispatch', payload);
  return res.data;
};

export const getResidentFeed = async (villageId = null) => {
  const params = villageId ? { villageId } : {};
  const res = await api.get('/notifications/resident-feed', { params });
  return res.data;
};

export const resetDemoScenario = async () => {
  const res = await api.post('/demo/reset');
  return res.data;
};

export const updateShortage = async (payload) => {
  const res = await api.post('/demo/update-shortage', payload);
  return res.data;
};

export default api;
