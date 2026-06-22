import interceptor from '../interceptors/auth.interceptor';


export const forumService = {
  getQuestions: (params) =>
    interceptor.get('/forum/questions', { params }),

  getQuestion: (id) =>
    interceptor.get(`/forum/questions/${id}`),

  getAnswers: (questionId) =>
    interceptor.get(`/forum/questions/${questionId}/answers`),

  askQuestion: (questionJson, photos = []) => {
    const fd = new FormData();
    fd.append('question', JSON.stringify(questionJson));
    photos.forEach(f => fd.append('photos', f));
    return interceptor.post('/forum/questions', fd, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  postAnswer: (answerJson, photos = []) => {
    const fd = new FormData();
    fd.append('answer', JSON.stringify(answerJson));
    photos.forEach(f => fd.append('photos', f));
    return interceptor.post('/forum/answers', fd, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  upvoteQuestion: (id) => interceptor.post(`/forum/questions/${id}/upvote`),
  upvoteAnswer:   (id) => interceptor.post(`/forum/answers/${id}/upvote`),
  acceptAnswer:   (id) => interceptor.post(`/forum/answers/${id}/accept`),
  deleteQuestion: (id) => interceptor.delete(`/forum/questions/${id}`),
  deleteAnswer:   (id) => interceptor.delete(`/forum/answers/${id}`),

  getPhoto: (photoId) =>
    interceptor.get(`/forum/photos/${photoId}`, { responseType: 'blob' })
      .then(r => URL.createObjectURL(r.data)),
};