import axiosClient from './axiosClient';

// Beneficiary endpoints — kept 1:1 with the backend controller.
export function getAllBeneficiaries() {
  return axiosClient.get('/api/beneficiaries');
}

export function getBeneficiaryById(id) {
  return axiosClient.get(`/api/beneficiaries/${id}`);
}

export function createBeneficiary(request) {
  return axiosClient.post('/api/beneficiaries', request);
}

export function updateBeneficiary(id, request) {
  return axiosClient.put(`/api/beneficiaries/${id}`, request);
}

export function getMyBeneficiary() {
  return axiosClient.get('/api/beneficiaries/my');
}

export function updateMyBeneficiary(request) {
  return axiosClient.put('/api/beneficiaries/my', request);
}

export function deleteBeneficiary(id) {
  return axiosClient.delete(`/api/beneficiaries/${id}`);
}
