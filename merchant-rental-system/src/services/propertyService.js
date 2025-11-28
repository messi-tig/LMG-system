import api from './api';

export const propertyService = {
  // Create property (multipart/form-data)
  async createProperty(formData) {
    return await api.post('/merchant/propertiesss', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  // Get all properties
  async getPropertiesss() {
    return await api.get('/merchant/propertiesss');
  },

  // Update a property
  async updateProperty(id, body) {
    return await api.patch(`/merchant/propertiesss/${id}`, body);
  },

  // Delete a property
  async deleteProperty(id) {
    return await api.delete(`/merchant/propertiesss/${id}`);
  },
};
