import axiosClient from './axiosClient';

export function getAllEligibilityCriteria() {
  return axiosClient.get('/api/eligibility-criteria');
}

export function getEligibilityCriteriaById(id) {
  return axiosClient.get(`/api/eligibility-criteria/${id}`);
}

export function createEligibilityCriteria(request) {
  return axiosClient.post('/api/eligibility-criteria', request);
}

export function updateEligibilityCriteria(id, request) {
  return axiosClient.put(`/api/eligibility-criteria/${id}`, request);
}

export function deleteEligibilityCriteria(id) {
  return axiosClient.delete(`/api/eligibility-criteria/${id}`);
}
