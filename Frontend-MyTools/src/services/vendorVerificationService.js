import interceptor from '../interceptors/auth.interceptor';

export const vendorVerificationService = {
  mine: () => interceptor.get('/vendor-verifications/mine'),
  submit: (verification, document) => {
    const fd = new FormData();
    fd.append('verification', JSON.stringify(verification));
    fd.append('document', document);
    return interceptor.post('/vendor-verifications', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  pending: () => interceptor.get('/vendor-verifications/pending'),
  review: (id, status, comment = '') =>
    interceptor.patch(`/vendor-verifications/${id}/review`, null, { params: { status, comment } }),
};
