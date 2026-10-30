// Talks to the dashboard API. In production the site and API share an
// address (Render forwards /api), so the session cookie is first-party.
export const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

export async function api(path, { method = 'GET', body } = {}) {
  const res = await fetch(`${API_BASE}/api${path}`, {
    method,
    credentials: 'include',
    headers: {
      'X-Requested-With': 'led-admin',
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  let data = {};
  try {
    data = await res.json();
  } catch {
    // empty or non-JSON body
  }
  if (res.status === 401 && path.startsWith('/admin/') && !path.startsWith('/admin/login')) {
    if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/admin/login')) {
      // Outside React here, and a full load also clears any stale page state.
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.assign(`/admin/login/?next=${encodeURIComponent(window.location.pathname + window.location.search)}`);
    }
  }
  if (!res.ok) throw new ApiError(data.message || 'Something went wrong. Try again.', res.status, data);
  return data;
}

export const adminApi = {
  get: (path) => api(`/admin${path}`),
  post: (path, body = {}) => api(`/admin${path}`, { method: 'POST', body }),
  patch: (path, body) => api(`/admin${path}`, { method: 'PATCH', body }),
  put: (path, body) => api(`/admin${path}`, { method: 'PUT', body }),
  del: (path) => api(`/admin${path}`, { method: 'DELETE' }),
};

export const pdfUrl = (kind, id) => `${API_BASE}/api/admin/${kind}s/${id}/pdf`;
