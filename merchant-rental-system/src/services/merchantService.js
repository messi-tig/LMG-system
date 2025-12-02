// src/services/merchantService.js
import api from './api';

export const merchantService = {
  // 🔑 Authentication
  login(email, password) {
    return api.post('/merchant/login', { email, password });
  },

  // 👤 Merchant Info
  getProfile(lang = 'en') {
    return api.get(`/merchant/operations/profile?lang=${lang}`);
  },

  updateProfile(formData, lang = 'en') {
    return api.patch(`/merchant/operations/profile?lang=${lang}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  // 🏢 Properties CRUD
  getProperties(lang = 'en') {
    return api.get(`/merchant/operations/properties?lang=${lang}`);
  },

  addProperty(formData, token) {
    return api.post(`/merchant/operations/properties`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });
  },

  updateProperty(id, data, token) {
    return api.patch(`/merchant/operations/properties/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  deleteProperty(id, token) {
    return api.delete(`/merchant/operations/properties/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // 📘 Bookings
  getBookings(lang = 'en') {
    return api.get(`/merchant/operations/bookings?lang=${lang}`);
  },

  updateBookingStatus(id, status, token) {
    return api.patch(
      `/merchant/operations/bookings/${id}/status`,
      { status },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  },

  deleteBooking(id, token) {
    return api.delete(`/merchant/operations/bookings/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};
