import interceptor from '../interceptors/auth.interceptor';

export const reviewService = {
  getReviews:   (productId) => interceptor.get(`/reviews/product/${productId}`),
  getAverage:   (productId) => interceptor.get(`/reviews/product/${productId}/average`),
  addReview:    (payload)   => interceptor.post('/reviews', payload),
  deleteReview: (reviewId)  => interceptor.delete(`/reviews/${reviewId}`),
};