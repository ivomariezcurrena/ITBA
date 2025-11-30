// Helper to call backend with Authorization header when token is available
export async function authFetch(url, options = {}, token) {
  const headers = options.headers ? { ...options.headers } : {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const opts = { ...options, headers };
  const res = await fetch(url, opts);
  return res;
}
