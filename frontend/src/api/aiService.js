const API_BASE = import.meta.env.VITE_API_URL || '/api';

async function request(path, options = {}) {
  const { headers: optHeaders, ...fetchOpts } = options;
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'GET',
    ...fetchOpts,
    headers: { 'Content-Type': 'application/json', ...optHeaders },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error || `Request failed (${res.status})`);
  return body;
}

export function apiGet(path, token) {
  return request(path, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
}

export function apiPost(path, data, token) {
  return request(path, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}

export function apiDel(path, token) {
  return request(path, {
    method: 'DELETE',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}

export async function generateArchitecture(prompt) {
  return apiPost('/ai/generate-architecture', { prompt });
}

export async function listModels() {
  const res = await apiGet('/ai/models');
  return res.data;
}
