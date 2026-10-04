/**
 * Resolves the backend API base URL for Cartify Admin.
 * Prioritizes NEXT_PUBLIC_API_URL environment variable if set.
 * In production/Vercel (non-localhost), falls back safely to the live Render backend.
 * In local development, targets http://localhost:8000/api/v1.
 */
export const getApiBase = (): string => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/+$/, '');
  }

  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (host === 'localhost' || host === '127.0.0.1') {
      return `http://${host}:8000/api/v1`;
    }
    // Deployed on Vercel or any public domain
    return 'https://cartify-dmgl.onrender.com/api/v1';
  }

  return process.env.NODE_ENV === 'production'
    ? 'https://cartify-dmgl.onrender.com/api/v1'
    : 'http://127.0.0.1:8000/api/v1';
};
