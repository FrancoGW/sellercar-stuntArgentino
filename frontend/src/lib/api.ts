const getApiUrl = (): string => {
  const env = import.meta.env.VITE_API_URL;
  if (env && typeof env === 'string') return env.replace(/\/$/, '');
  return '';
};

export function apiBase(): string {
  return getApiUrl();
}

export async function apiFetch(
  path: string,
  options: RequestInit & { token?: string } = {}
): Promise<Response> {
  const base = apiBase();
  const url = path.startsWith('http') ? path : `${base}/api${path.startsWith('/') ? path : `/${path}`}`;
  const { token, ...rest } = options as RequestInit & { token?: string };
  const headers = new Headers(rest.headers);
  if (token) headers.set('Authorization', `Bearer ${token}`);
  if (!headers.has('Content-Type') && rest.body && typeof rest.body === 'string') headers.set('Content-Type', 'application/json');
  return fetch(url, { ...rest, headers });
}
