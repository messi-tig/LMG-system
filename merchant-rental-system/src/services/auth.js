import api from './api';

export const login = async (email, password) => {
  try {
    const response = await api.post('/merchant/login', {
      email,
      password,
    });
    return response.data; // contains token and merchant info
  } catch (error) {
    throw error.response?.data || { message: 'Login failed' };
  }
};
