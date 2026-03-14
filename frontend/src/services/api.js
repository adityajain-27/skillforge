// Central API service — all fetch calls go through here
const BASE_URL = '/api';

// Helper: get auth token from localStorage
const getToken = () => localStorage.getItem('token');

// Helper: build headers (with or without auth)
const authHeaders = (isMultipart = false) => {
  const headers = {};
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (!isMultipart) headers['Content-Type'] = 'application/json';
  return headers;
};

// Helper: generic fetch wrapper
const request = async (path, options = {}) => {
  const res = await fetch(`${BASE_URL}${path}`, options);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
};

// ─── Auth ───────────────────────────────────────────────────
// POST /api/auth/signup
export const signup = (name, email, password, role) =>
  request('/auth/signup', {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ name, email, password, role }),
  });

// POST /api/auth/login
export const login = (email, password) =>
  request('/auth/login', {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ email, password }),
  });

// GET /api/auth/profile
export const getProfile = () =>
  request('/auth/profile', { headers: authHeaders() });

// PATCH /api/auth/upgrade
export const upgradeToPro = () =>
  request('/auth/upgrade', { method: 'PATCH', headers: authHeaders() });

// ─── Datasets ────────────────────────────────────────────────
// POST /api/dataset/upload (multipart)
export const uploadDataset = (formData) =>
  request('/dataset/upload', {
    method: 'POST',
    headers: authHeaders(true), // no Content-Type, let browser set boundary
    body: formData,
  });

// GET /api/dataset/list
export const listDatasets = () =>
  request('/dataset/list', { headers: authHeaders() });

// GET /api/dataset/:id
export const getDataset = (id) =>
  request(`/dataset/${id}`, { headers: authHeaders() });

// DELETE /api/dataset/:id
export const deleteDataset = (id) =>
  request(`/dataset/${id}`, { method: 'DELETE', headers: authHeaders() });

// PATCH /api/dataset/:id/share
export const shareDataset = (id, body) =>
  request(`/dataset/${id}/share`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify(body),
  });

// ─── Visualisation ───────────────────────────────────────────
// GET /api/viz/map-data?datasetId&variable&year
export const getMapData = (datasetId, variable, year = '') =>
  request(`/viz/map-data?datasetId=${datasetId}&variable=${encodeURIComponent(variable)}&year=${year}`, {
    headers: authHeaders(),
  });

// GET /api/viz/location-trend?datasetId&variable&lat&lon
export const getLocationTrend = (datasetId, variable, lat, lon) =>
  request(`/viz/location-trend?datasetId=${datasetId}&variable=${encodeURIComponent(variable)}&lat=${lat}&lon=${lon}`, {
    headers: authHeaders(),
  });

// GET /api/viz/compare-datasets?datasetIdA&datasetIdB&variable&yearA&yearB
export const compareDatasets = (datasetIdA, datasetIdB, variable, yearA = '', yearB = '') =>
  request(`/viz/compare-datasets?datasetIdA=${datasetIdA}&datasetIdB=${datasetIdB}&variable=${encodeURIComponent(variable)}&yearA=${yearA}&yearB=${yearB}`, {
    headers: authHeaders(),
  });

// ─── Predictions ─────────────────────────────────────────────
// GET /api/prediction/trend?datasetId&variable&lat&lon
export const getPredictionTrend = (datasetId, variable, lat, lon) =>
  request(`/prediction/trend?datasetId=${datasetId}&variable=${encodeURIComponent(variable)}&lat=${lat}&lon=${lon}`, {
    headers: authHeaders(),
  });

// ─── News ────────────────────────────────────────────────────
// GET /api/news?q=...
export const getNews = (q = '') =>
  request(`/news${q ? `?q=${encodeURIComponent(q)}` : ''}`, {
    headers: authHeaders(),
  });

// ─── Stories ─────────────────────────────────────────────────
// GET /api/stories
export const getStories = () =>
  request('/stories', { headers: authHeaders() });

// GET /api/stories/:id
export const getStory = (id) =>
  request(`/stories/${id}`, { headers: authHeaders() });

// ─── Collab ──────────────────────────────────────────────────
// POST /api/collab/comments  body: { datasetId?, storyId?, text, annotation? }
export const addComment = (body) =>
  request('/collab/comments', {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(body),
  });

// GET /api/collab/comments?datasetId=... OR ?storyId=...
export const getComments = ({ datasetId, storyId }) => {
  const qs = datasetId ? `datasetId=${datasetId}` : `storyId=${storyId}`;
  return request(`/collab/comments?${qs}`, { headers: authHeaders() });
};

// DELETE /api/collab/comments/:id
export const deleteComment = (id) =>
  request(`/collab/comments/${id}`, { method: 'DELETE', headers: authHeaders() });
