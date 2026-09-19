import axiosClient from './axiosClient';

export function getAllStates() {
  return axiosClient.get('/api/states');
}

export function getStateById(id) {
  return axiosClient.get(`/api/states/${id}`);
}

export function createState(request) {
  return axiosClient.post('/api/states', request);
}

export function deleteState(id) {
  return axiosClient.delete(`/api/states/${id}`);
}
