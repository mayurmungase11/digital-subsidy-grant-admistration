import axiosClient from './axiosClient';

export function getAllSchemes() {
  return axiosClient.get('/api/schemes');
}

export function getSchemeById(id) {
  return axiosClient.get(`/api/schemes/${id}`);
}

export function createScheme(request) {
  return axiosClient.post('/api/schemes', request);
}

export function updateScheme(id, request) {
  return axiosClient.put(`/api/schemes/${id}`, request);
}

export function deleteScheme(id) {
  return axiosClient.delete(`/api/schemes/${id}`);
}
