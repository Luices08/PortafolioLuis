// Helpers para Server Components que obtienen datos en el primer render.
// Implementa resolución de múltiples candidatos para funcionar tanto en Docker VPS
// (red interna de contenedores http://backend:4000/api) como en local (http://localhost:4000/api).

async function fetchFromApi(endpoint) {
  const candidates = [];
  if (typeof window === 'undefined') {
    if (process.env.INTERNAL_API_URL) candidates.push(process.env.INTERNAL_API_URL);
    // En Docker (VPS), el contenedor frontend accede al backend vía la red interna:
    candidates.push('http://backend:4000/api');
    candidates.push('http://portfolio-backend:4000/api');
  }
  if (process.env.NEXT_PUBLIC_API_URL) candidates.push(process.env.NEXT_PUBLIC_API_URL);
  candidates.push('http://localhost:4000/api');

  const uniqueCandidates = [...new Set(candidates)];

  for (const base of uniqueCandidates) {
    try {
      const res = await fetch(`${base}${endpoint}`, { cache: 'no-store' });
      if (res.ok) {
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
