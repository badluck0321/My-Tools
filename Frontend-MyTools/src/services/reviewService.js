import interceptor from '../interceptors/auth.interceptor';

export const reviewService = {
  getReviews: (productId) => interceptor.get(`/reviews/product/${productId}`),
  getAverage: (productId) => interceptor.get(`/reviews/product/${productId}/average`),
  getMasteryReviews: (masteryId) => interceptor.get(`/reviews/mastery/${masteryId}`),
  getMasteryAverage: (masteryId) => interceptor.get(`/reviews/mastery/${masteryId}/average`),
  addReview: (payload) => interceptor.post('/reviews', payload),
  deleteReview: (reviewId) => interceptor.delete(`/reviews/${reviewId}`),
};
