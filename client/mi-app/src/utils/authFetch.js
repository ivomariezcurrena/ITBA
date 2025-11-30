const BASE_URL = '/api';

const api = {
  get: (endpoint, token) => request('GET', endpoint, null, token),
  post: (endpoint, body, token) => request('POST', endpoint, body, token),
  put: (endpoint, body, token) => request('PUT', endpoint, body, token),
  delete: (endpoint, token) => request('DELETE', endpoint, null, token),
};

async function request(method, endpoint, body = null, token) {
  const headers = {
    'Content-Type': 'application/json',
  };

  const authToken = token || localStorage.getItem('auth_token');
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const options = {
    method,
    headers,
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, options);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.error || `Error ${response.status}: ${response.statusText}`;
    throw new Error(errorMessage);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export default api;
