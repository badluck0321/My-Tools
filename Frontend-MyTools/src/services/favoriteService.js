import interceptor from '../interceptors/auth.interceptor';

export const favoriteService = {
  list: () => interceptor.get('/favorites'),
  toggleProduct: (productId) => interceptor.post(`/favorites/products/${productId}`),
  toggleMastery: (masteryId) => interceptor.post(`/favorites/masterys/${masteryId}`),
  statusProduct: (productId) => interceptor.get(`/favorites/products/${productId}/status`),
  statusMastery: (masteryId) => interceptor.get(`/favorites/masterys/${masteryId}/status`),
  removeProduct: (productId) => interceptor.delete(`/favorites/products/${productId}`),
  removeMastery: (masteryId) => interceptor.delete(`/favorites/masterys/${masteryId}`),
};
