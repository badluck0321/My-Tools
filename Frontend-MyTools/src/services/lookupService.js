import interceptor from '../interceptors/auth.interceptor';

export const lookupService = {
  list: (params = {}) => interceptor.get('/api/Lookups', { params }),
  listByType: (type) => interceptor.get(`/api/Lookups/type/${encodeURIComponent(type)}`),
  get: (id) => interceptor.get(`/api/Lookups/${id}`),
  create: (payload) => interceptor.post('/api/Lookups', payload),
  update: (id, payload) => interceptor.put(`/api/Lookups/${id}`, payload),
  remove: (id) => interceptor.delete(`/api/Lookups/${id}`),
};
