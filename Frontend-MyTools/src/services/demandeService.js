import interceptor from '../interceptors/auth.interceptor';

export const demandeService = {
  list: () => interceptor.get('/demandes'),
  get: (id) => interceptor.get(`/demandes/${id}`),
  create: (payload) => interceptor.post('/demandes', payload),
  update: (id, payload) => interceptor.put(`/demandes/${id}`, payload),
  remove: (id) => interceptor.delete(`/demandes/${id}`),
};
