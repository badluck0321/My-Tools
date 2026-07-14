import interceptor from '../interceptors/auth.interceptor';

export const messageService = {
  conversations: () => interceptor.get('/messages/conversations'),
  messages: (conversationId) => interceptor.get(`/messages/conversations/${conversationId}`),
  send: (payload) => interceptor.post('/messages', payload),
    startConversation: ({ resourceType, resourceId, initialMessage }) =>
    interceptor.post('/messages/start', { resourceType, resourceId, initialMessage }),
  // startConversation: async ({ resourceType, resourceId, initialMessage }) => {
  //   const res = await api.post('/messages/start', {
  //     resourceType,
  //     resourceId,
  //     initialMessage,
  //   });
  //   return res.data;
  // },
};
