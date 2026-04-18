import axios, { AxiosError, AxiosRequestConfig } from 'axios';

// Reads from .env.production on Vercel, falls back to local dev backend
const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // 30s — Render free tier cold starts can take ~15-20s
});

// Attach JWT token to every request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Retry helper — retries once on network errors (handles Render cold starts)
async function retryRequest(config: AxiosRequestConfig, retries = 1): Promise<any> {
  try {
    return await api.request(config);
  } catch (err) {
    const axiosErr = err as AxiosError;
    // Only retry on network/timeout errors, not 4xx/5xx
    if (retries > 0 && !axiosErr.response) {
      await new Promise(resolve => setTimeout(resolve, 3000)); // wait 3s before retry
      return retryRequest(config, retries - 1);
    }
    throw err;
  }
}

// Handle auth errors globally
api.interceptors.response.use(
  response => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

/**
 * Pings /health to wake the Render instance before making real requests.
 * Call this once on app load to pre-warm the backend.
 */
export async function wakeBackend(): Promise<void> {
  try {
    await axios.get(`${BASE_URL}/health`, { timeout: 25000 });
  } catch {
    // Silently fail — the real requests have their own retry logic
  }
}

export { retryRequest };
export default api;
