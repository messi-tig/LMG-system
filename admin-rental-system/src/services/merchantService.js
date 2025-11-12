import axios from 'axios';

const API_URL = "http://localhost:3000/merchant";

export const registerMerchant = async (payload) => {
  const token = localStorage.getItem('token');
  return axios.post(API_URL + '/register', payload, {
    headers: { Authorization: `Bearer ${token}` }
  });
};
