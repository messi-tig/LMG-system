import api from './api';

export const bookingService = {
  async getBookings() {
    return await api.get('/merchant/bookings');
  },

  async updateBookingStatus(id, status) {
    return await api.patch(`/merchant/bookings/${id}/status`, { status });
  },

  async deleteBooking(id) {
    return await api.delete(`/merchant/bookings/${id}`);
  },
};
