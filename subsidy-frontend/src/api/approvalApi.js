import axiosClient from './axiosClient';

export function getAllApprovals() { return axiosClient.get('/api/approvals'); }
export function getApprovalById(id) { return axiosClient.get(`/api/approvals/${id}`); }
export function createApproval(request) { return axiosClient.post('/api/approvals', request); }
export function updateApproval(id, request) { return axiosClient.put(`/api/approvals/${id}`, request); }
export function deleteApproval(id) { return axiosClient.delete(`/api/approvals/${id}`); }
