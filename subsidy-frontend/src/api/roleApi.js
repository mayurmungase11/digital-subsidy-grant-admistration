import axiosClient from './axiosClient';

export function getAllRoles() {
  return axiosClient.get('/api/roles');
}

export function getRoleById(id) {
  return axiosClient.get(`/api/roles/${id}`);
}

export function createRole(request) {
  return axiosClient.post('/api/roles', request);
}

export function updateRole(id, request) {
  return axiosClient.put(`/api/roles/${id}`, request);
}

export function deleteRole(id) {
  return axiosClient.delete(`/api/roles/${id}`);
}
