import axiosClient from './axiosClient';

export function getAllUsers() {
  return axiosClient.get('/api/users');
}

export function getUserById(id) {
  return axiosClient.get(`/api/users/${id}`);
}

export function createUser(request) {
  return axiosClient.post('/api/users', request);
}

export function updateUser(id, request) {
  return axiosClient.put(`/api/users/${id}`, request);
}

export function deleteUser(id) {
  return axiosClient.delete(`/api/users/${id}`);
}
