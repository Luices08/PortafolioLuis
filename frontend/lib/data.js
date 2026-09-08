// Helpers para Server Components que obtienen datos en el primer render.
// Soporta tanto desarrollo local de alta velocidad como entornos de contenedores Docker / VPS.

let cachedBaseUrl = null;

function getCandidates() {
  const candidates = [];

  // 1. Si existe INTERNAL_API_URL explícita (configurada en Docker VPS), usarla primero
  if (process.env.INTERNAL_API_URL) {
    candidates.push(process.env.INTERNAL_API_URL);
  }

  // 2. En desarrollo local o cliente, priorizar la URL local para respuesta inmediata (<10ms)
  if (process.env.NEXT_PUBLIC_API_URL) {
    candidates.push(process.env.NEXT_PUBLIC_API_URL);
  }
  candidates.push('http://localhost:4000/api');
  candidates.push('http://127.0.0.1:4000/api');

  // 3. Fallbacks para red interna de contenedores Docker si no se especificó INTERNAL_API_URL
  if (typeof window === 'undefined') {
    candidates.push('http://backend:4000/api');
    candidates.push('http://portfolio-backend:4000/api');
  }

  return [...new Set(candidates)];
}

async function fetchFromApi(endpoint) {
  // Si ya se comprobó una URL base que funciona, intentarla primero directamente
  if (cachedBaseUrl) {
    try {
      const res = await fetch(`${cachedBaseUrl}${endpoint}`, {
        cache: 'no-store',
        signal: AbortSignal.timeout(2000),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (_) {
      cachedBaseUrl = null; // Si falló la URL previamente memorizada, re-escanear
    }
  }

  const candidates = getCandidates();

  for (const base of candidates) {
    try {
      const res = await fetch(`${base}${endpoint}`, {
        cache: 'no-store',
        signal: AbortSignal.timeout(1500),
      });
      if (res.ok) {
        cachedBaseUrl = base;
        return await res.json();
      }
    } catch (_) {
      // Probar siguiente candidato si la conexión falla
    }
  }
  return null;
}

export async function getProfile() {
  try {
    const json = await fetchFromApi('/profile');
    return json?.data || null;
  } catch (_) {
    return null;
  }
}

export async function getFeaturedProjects() {
  try {
    const json = await fetchFromApi('/projects?featured=true');
    return json?.data || [];
  } catch (_) {
    return [];
  }
}

// Categorías reales de todos los proyectos publicados (no solo destacados),
// usadas para alimentar los chips de sugerencia del hero con datos reales.
export async function getProjectCategories() {
  try {
    const json = await fetchFromApi('/projects');
    const categories = (json?.data || []).flatMap((p) => p.categories || []);
    return Array.from(new Set(categories));
  } catch (_) {
    return [];
  }
}
