import axiosClient from './axiosClient';

// POST /api/eligibility/application/{id}/evaluate
// No request body. Response: { eligible, score, threshold, message }
export function evaluateApplication(id) {
  return axiosClient.post(`/api/eligibility/application/${id}/evaluate`);
}
