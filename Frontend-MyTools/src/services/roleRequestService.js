import interceptor from '../interceptors/auth.interceptor';

export const roleRequestService = {
  // Authenticated user submits a request to become a Store Owner or Craftsman.
  submit: (type, description = '') =>
    interceptor.post('/role-requests', { type, description }),

  // Current user's latest request.
  mine: () => interceptor.get('/role-requests/mine'),

  // Current user's full request history.
  history: () => interceptor.get('/role-requests/mine/history'),

  // Admin: pending requests.
  pending: () => interceptor.get('/role-requests/pending'),

  // Admin: all requests.
  all: () => interceptor.get('/role-requests'),

  // Admin: approve or reject a request.
  review: (id, status, comment = '') =>
    interceptor.patch(`/role-requests/${id}/review`, null, { params: { status, comment } }),

  // User deletes their own pending request.
  delete: (id) => interceptor.delete(`/role-requests/${id}`),
};
