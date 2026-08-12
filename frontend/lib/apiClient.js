const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

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

  let res;
  try {
    res = await fetch(`${API_URL}${path}`, {
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
