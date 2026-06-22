import interceptor from '../interceptors/auth.interceptor';

export const profileService = {
  getProfile: () => interceptor.get('/profile'),
  updateProfile: (payload) => interceptor.put('/profile', payload),
};
