import interceptor from '../interceptors/auth.interceptor';

export const bookingService = {
  checkAvailability: (productId, startDate, endDate) =>
    interceptor.get('/bookings/availability', { params: { productId, startDate, endDate } }),
  myBookings: () => interceptor.get('/bookings/my'),
  productBookings: (productId) => interceptor.get(`/bookings/product/${productId}`),
};
