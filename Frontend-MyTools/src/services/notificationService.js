import interceptor from '../interceptors/auth.interceptor';

export const notificationService = {
  list: () => interceptor.get('/notifications'),
  unreadCount: () => interceptor.get('/notifications/unread-count'),
  markRead: (id) => interceptor.patch(`/notifications/${id}/read`),
  markAllRead: () => interceptor.patch('/notifications/read-all'),
};
