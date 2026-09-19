import axiosClient from './axiosClient.js';

export function getAllVerifications() {
  return axiosClient.get('/api/verifications');
}

export function getVerificationById(id) {
  return axiosClient.get(`/api/verifications/${id}`);
}

export function createVerification(request) {
  return axiosClient.post('/api/verifications', request);
}

export function updateVerification(id, request) {
  return axiosClient.put(`/api/verifications/${id}`, request);
}

export function deleteVerification(id) {
  return axiosClient.delete(`/api/verifications/${id}`);
}
