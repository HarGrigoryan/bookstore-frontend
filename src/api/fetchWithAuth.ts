const API_BASE = ''; // keep empty if proxy is working

async function refreshToken() {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) return null;

  const res = await fetch(`${API_BASE}/api/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });

  if (!res.ok) {
    localStorage.removeItem('jwt');
    localStorage.removeItem('refreshToken');
    return null;
  }

  const data = await res.json();
  localStorage.setItem('jwt', data.accessToken);
  return data.accessToken;
}

export async function fetchWithAuth(
  input: RequestInfo,
  init: RequestInit = {}
) {
  const token = localStorage.getItem('jwt');

  const res = await fetch(input, {
    ...init,
    headers: {
      ...(init.headers || {}),
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (res.status !== 401) return res;

  //token expired → try refresh
  const newToken = await refreshToken();
  if (!newToken) throw new Error('Unauthorized');

  return fetch(input, {
    ...init,
    headers: {
      ...(init.headers || {}),
      'Content-Type': 'application/json',
      Authorization: `Bearer ${newToken}`,
    },
  });
}
