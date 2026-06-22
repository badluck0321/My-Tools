import interceptor from '../interceptors/auth.interceptor';

export const paymentService = {
  createCheckout: (orderId) => interceptor.post(`/payments/checkout/${orderId}`),
  confirm: (paymentId) => interceptor.post(`/payments/${paymentId}/confirm`),
  refund: (paymentId) => interceptor.post(`/payments/${paymentId}/refund`),
};
