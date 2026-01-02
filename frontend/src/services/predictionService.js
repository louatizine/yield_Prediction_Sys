import axios from 'axios';

const API_URL = 'http://localhost:8000/api/predict';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const predictCrop = async (data) => {
  // Convert string values to numbers
  const formattedData = {
    N: parseFloat(data.N),
    P: parseFloat(data.P),
    K: parseFloat(data.K),
    temperature: parseFloat(data.temperature),
    humidity: parseFloat(data.humidity),
    ph: parseFloat(data.ph),
    rainfall: parseFloat(data.rainfall),
  };
  
  const response = await axios.post(`${API_URL}/crop`, formattedData, {
    headers: getAuthHeader(),
  });
  return response.data;
};

export const predictFertilizer = async (data) => {
  // Convert string values to numbers
  const formattedData = {
    N: parseFloat(data.N),
    P: parseFloat(data.P),
    K: parseFloat(data.K),
    temperature: parseFloat(data.temperature),
    humidity: parseFloat(data.humidity),
    ph: parseFloat(data.ph),
    rainfall: parseFloat(data.rainfall),
    crop_type: data.crop_type,
  };
  
  const response = await axios.post(`${API_URL}/fertilizer`, formattedData, {
    headers: getAuthHeader(),
  });
  return response.data;
};

export const checkModelHealth = async () => {
  const response = await axios.get(`${API_URL}/health`);
  return response.data;
};

export const getCropHistory = async () => {
  const response = await axios.get(`${API_URL}/crop/history`, {
    headers: getAuthHeader(),
  });
  return response.data.predictions || [];
};

export const getFertilizerHistory = async () => {
  const response = await axios.get(`${API_URL}/fertilizer/history`, {
    headers: getAuthHeader(),
  });
  return response.data.predictions || [];
};
