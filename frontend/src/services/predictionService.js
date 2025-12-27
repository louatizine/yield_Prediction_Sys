import axios from 'axios';

const API_URL = 'http://localhost:8000/api/predict';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const predictCrop = async (data) => {
  const response = await axios.post(`${API_URL}/crop`, data, {
    headers: getAuthHeader(),
  });
  return response.data;
};

export const predictFertilizer = async (data) => {
  const response = await axios.post(`${API_URL}/fertilizer`, data, {
    headers: getAuthHeader(),
  });
  return response.data;
};

export const checkModelHealth = async () => {
  const response = await axios.get(`${API_URL}/health`);
  return response.data;
};
