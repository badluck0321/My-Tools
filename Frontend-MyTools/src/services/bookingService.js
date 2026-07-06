import interceptor from '../interceptors/auth.interceptor';

const normalizeResource = ({ resourceType = 'PRODUCT', resourceId, productId, masteryId }) => ({
  resourceType,
  resourceId: resourceId || (resourceType === 'MASTERY' ? masteryId : productId),
});

export const bookingService = {
  checkAvailability: ({ resourceType = 'PRODUCT', resourceId, productId, masteryId, startDate, endDate }) =>
    interceptor.get('/bookings/availability', {
      params: { ...normalizeResource({ resourceType, resourceId, productId, masteryId }), startDate, endDate },
    }),
  unavailableDates: (resourceType, resourceId) =>
    interceptor.get('/bookings/unavailable-dates', { params: { resourceType, resourceId } }),
  myBookings: () => interceptor.get('/bookings/my'),
  ownerBookings: () => interceptor.get('/bookings/owner'),
  adminBookings: () => interceptor.get('/bookings/admin'),
  resourceBookings: (resourceType, resourceId) => interceptor.get(`/bookings/resource/${resourceType}/${resourceId}`),
  productBookings: (productId) => interceptor.get(`/bookings/product/${productId}`),
  masteryBookings: (masteryId) => interceptor.get(`/bookings/mastery/${masteryId}`),
  create: (payload) => interceptor.post('/bookings', payload),
  updateStatus: (bookingId, status) => interceptor.patch(`/bookings/${bookingId}/status/${status}`),
};
