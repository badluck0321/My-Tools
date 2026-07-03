import interceptor from '../interceptors/auth.interceptor';

export const adminService = {
  hideProduct: (productId) => interceptor.patch(`/admin/products/${productId}/hide`),
};
