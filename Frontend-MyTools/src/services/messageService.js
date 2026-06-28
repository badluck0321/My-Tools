import interceptor from '../interceptors/auth.interceptor';

const getData = async (request) => {
  const response = await request;
  return response?.data ?? [];
};

export const messageService = {
  conversations: () => getData(interceptor.get('/messages/conversations')),
  messages: (conversationId) => getData(interceptor.get(`/messages/conversations/${conversationId}`)),
  send: (payload) => getData(interceptor.post('/messages', payload)),
};
