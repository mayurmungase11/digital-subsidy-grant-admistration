import axiosClient from './axiosClient';

// Application endpoints — kept 1:1 with the backend controller.
export function getAllApplications() {
  return axiosClient.get('/api/applications');
}

export function getApplicationById(id) {
  return axiosClient.get(`/api/applications/${id}`);
}

export function getMyApplications() {
  return axiosClient.get('/api/applications/my');
}

export function createApplication(request) {
  return axiosClient.post('/api/applications', request);
}

export function createMyApplication(request) {
  return axiosClient.post('/api/applications/my', request);
}

export function updateApplication(id, request) {
  return axiosClient.put(`/api/applications/${id}`, request);
}

export function deleteApplication(id) {
  return axiosClient.delete(`/api/applications/${id}`);
}
