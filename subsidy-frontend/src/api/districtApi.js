import axiosClient from './axiosClient';

export function getAllDistricts() {
  return axiosClient.get('/api/districts');
}

export function getDistrictById(id) {
  return axiosClient.get(`/api/districts/${id}`);
}

export function createDistrict(request) {
  return axiosClient.post('/api/districts', request);
}

export function updateDistrict(id, request) {
  return axiosClient.put(`/api/districts/${id}`, request);
}

export function deleteDistrict(id) {
  return axiosClient.delete(`/api/districts/${id}`);
}
