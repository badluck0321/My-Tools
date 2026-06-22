import interceptor from '../interceptors/auth.interceptor';

export const cartService = {
  getCart: () => interceptor.get('/cart'),
  addItem: ({ productId, listingType = 'SALE', quantity = 1, startDate = null, endDate = null }) =>
    interceptor.post('/cart/items', { productId, listingType, quantity, startDate, endDate }),
  updateQuantity: (productId, quantity) => interceptor.put(`/cart/items/${productId}`, { quantity }),
  removeItem: (productId) => interceptor.delete(`/cart/items/${productId}`),
  clearCart: () => interceptor.delete('/cart'),
};
