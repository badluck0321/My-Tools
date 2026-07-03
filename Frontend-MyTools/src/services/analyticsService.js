import interceptor from '../interceptors/auth.interceptor';

export const analyticsService = {
  dashboard: () => interceptor.get('/analytics/dashboard'),
  downloadOrdersCsv: async () => {
    const response = await interceptor.get('/analytics/orders.csv', { responseType: 'blob' });
    return URL.createObjectURL(response.data);
  },
};
