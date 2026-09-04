/**
 * Resuelve la URL base de la API:
 * - En local: http://localhost:4000/api
 * - En VPS (cuando el visitante entra por IP o dominio ej. http://ip:3005):
 *   llama a http://ip:4000/api en vez de llamar al localhost del cliente.
 * - Con dominio o variable explícita: usa NEXT_PUBLIC_API_URL.
 */
function getApiUrl() {
  if (typeof window !== 'undefined') {
    const { hostname, protocol } = window.location;
    const envUrl = process.env.NEXT_PUBLIC_API_URL;

    if (envUrl && !envUrl.includes('localhost') && !envUrl.includes('127.0.0.1')) {
      return envUrl;
    }

    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return envUrl || 'http://localhost:4000/api';
    }

    // Acceso remoto a VPS por IP o hostname
    return `${protocol}//${hostname}:4000/api`;
  }

  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
}

const API_URL = getApiUrl();

class ApiClientError extends Error {
  constructor(message, statusCode, details) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}

async function request(path, { method = 'GET', body, isFormData = false } = {}) {
  const headers = {};
  if (!isFormData) headers['Content-Type'] = 'application/json';

  const baseUrl = getApiUrl();
  let res;
  try {
    res = await fetch(`${baseUrl}${path}`, {
      method,
      headers,
      credentials: 'include', // envía/recibe la cookie HTTP-only de sesión admin
      body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
    });
  } catch (networkError) {
    throw new ApiClientError(
      'No se pudo conectar con el servidor. Verifica que el backend esté corriendo.',
      0
    );
  }

  let json = null;
  try {
    json = await res.json();
  } catch (_) {
    // respuesta sin cuerpo JSON
  }

  if (!res.ok) {
    throw new ApiClientError(json?.message || 'Ocurrió un error inesperado', res.status, json?.details);
  }

  return json?.data;
}

export const api = {
  get: (path) => request(path),
  post: (path, body, opts = {}) => request(path, { method: 'POST', body, ...opts }),
  put: (path, body) => request(path, { method: 'PUT', body }),
  del: (path, body) => request(path, { method: 'DELETE', body }),
};

export { ApiClientError, API_URL };
