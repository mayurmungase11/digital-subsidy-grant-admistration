import axiosClient from './axiosClient';

export function getAllSchemeDistricts() {
  return axiosClient.get('/api/schemeDistricts');
}

export function getSchemeDistrictById(id) {
  return axiosClient.get(`/api/schemeDistricts/${id}`);
}

export function createSchemeDistrict(request) {
  return axiosClient.post('/api/schemeDistricts', request);
}

export function updateSchemeDistrict(id, request) {
  return axiosClient.put(`/api/schemeDistricts/${id}`, request);
}

export function deleteSchemeDistrict(id) {
  return axiosClient.delete(`/api/schemeDistricts/${id}`);
}
