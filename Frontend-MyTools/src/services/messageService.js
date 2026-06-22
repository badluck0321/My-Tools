import interceptor from '../interceptors/auth.interceptor';

export const messageService = {
  conversations: () => interceptor.get('/messages/conversations'),
  messages: (conversationId) => interceptor.get(`/messages/conversations/${conversationId}`),
  send: (payload) => interceptor.post('/messages', payload),
};
