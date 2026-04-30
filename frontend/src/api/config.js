const trimTrailingSlash = (value = '') => value.replace(/\/+$/, '');

const rawApiUrl = import.meta.env.VITE_API_URL?.trim() || '';

export const apiBaseUrl = rawApiUrl
  ? trimTrailingSlash(rawApiUrl)
  : (import.meta.env.PROD ? `${window.location.origin}/api` : 'http://localhost:5000/api');

export const withApiPath = (path = '') => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${apiBaseUrl}${normalizedPath}`;
};
