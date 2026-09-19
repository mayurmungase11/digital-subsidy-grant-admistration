import axiosClient from './axiosClient';

export function getAllDisbursements() {
  return axiosClient.get('/api/disbursements');
}

export function getDisbursementById(id) {
  return axiosClient.get(`/api/disbursements/${id}`);
}

export function createDisbursement(request) {
  return axiosClient.post('/api/disbursements', request);
}

export function updateDisbursement(id, request) {
  return axiosClient.put(`/api/disbursements/${id}`, request);
}

export function deleteDisbursement(id) {
  return axiosClient.delete(`/api/disbursements/${id}`);
}
