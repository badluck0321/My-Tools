import interceptor from '../interceptors/auth.interceptor';

export const forumService = {

  // Public — no auth needed
  getQuestions: (params) =>
    interceptor.get('/forum/questions', { params }),

  getQuestion: (id) =>
    interceptor.get(`/forum/questions/${id}`),

  getAnswers: (questionId) =>
    interceptor.get(`/forum/questions/${questionId}/answers`),

  // Auth required
  askQuestion: (questionJson, photos = []) => {
    const fd = new FormData();
    fd.append('question', JSON.stringify(questionJson));
    photos.forEach(f => fd.append('photos', f));
    return interceptor.post('/forum/questions', fd, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  postAnswer: (questionId, answerJson, photos = []) => {
    const fd = new FormData();
    fd.append('answer', JSON.stringify(answerJson));
    photos.forEach(f => fd.append('photos', f));
    return interceptor.post(`/forum/questions/${questionId}/answers`, fd, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  voteQuestion: (id, type = 'up') =>
    interceptor.put(`/forum/questions/${id}/vote`, null, { params: { type } }),

  voteAnswer: (id, type = 'up') =>
    interceptor.put(`/forum/answers/${id}/vote`, null, { params: { type } }),

  acceptAnswer: (id) =>
    interceptor.put(`/forum/answers/${id}/accept`),

  deleteQuestion: (id) =>
    interceptor.delete(`/forum/questions/${id}`),

  deleteAnswer: (id) =>
    interceptor.delete(`/forum/answers/${id}`),

  getPhoto: (photoId) =>
    interceptor.get(`/forum/photos/${photoId}`, { responseType: 'blob' })
      .then(r => URL.createObjectURL(r.data)),
};