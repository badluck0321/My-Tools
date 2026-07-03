import interceptor from '../interceptors/auth.interceptor';

// Central axios instance kept for legacy imports. New feature code uses the domain services
// (productService, orderService, bookingService, etc.) directly.
export const api = interceptor;

export const eventService = {
  // The current backend does not expose an events module. Returning an empty list keeps
  // the optional map component safe if it is mounted by older UI code.
  getEvents: async () => ({ results: [] }),
};

export default api;
