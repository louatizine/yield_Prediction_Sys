import axios from 'axios';

const API_URL = 'http://localhost:8000/api/disease';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const detectDisease = async (imageFile) => {
  const formData = new FormData();
  formData.append('file', imageFile);

  const response = await axios.post(`${API_URL}/detect`, formData, {
    headers: {
      ...getAuthHeader(),
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const checkDiseaseModelHealth = async () => {
  const response = await axios.get(`${API_URL}/health`);
  return response.data;
};
