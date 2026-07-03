import interceptor from '../interceptors/auth.interceptor';

export const orderService = {
  checkout: (payload = {}) => interceptor.post('/orders/checkout', payload),
  myOrders: () => interceptor.get('/orders/my'),
  sellerOrders: () => interceptor.get('/orders/seller'),
  adminOrders: () => interceptor.get('/orders/admin'),
  getOrder: (orderId) => interceptor.get(`/orders/${orderId}`),
  updateStatus: (orderId, status) => interceptor.patch(`/orders/${orderId}/status`, { status }),
  downloadInvoice: async (orderId) => {
    const response = await interceptor.get(`/orders/${orderId}/invoice`, { responseType: 'blob' });
    return URL.createObjectURL(response.data);
  },
};
