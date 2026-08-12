const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

// Estos helpers corren en el servidor (Server Components) y se usan para el
// primer render de la página pública. Si el backend no está disponible
// (por ejemplo durante el build o en un entorno sin MongoDB configurado),
// degradan a valores vacíos en lugar de romper la página: el chat sigue
// siendo la vía principal para obtener la información en tiempo real.

export async function getProfile() {
  try {
    const res = await fetch(`${API_URL}/profile`, { cache: 'no-store' });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data;
  } catch (_) {
    return null;
  }
}

export async function getFeaturedProjects() {
  try {
    const res = await fetch(`${API_URL}/projects?featured=true`, { cache: 'no-store' });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (_) {
    return [];
  }
}

// Categorías reales de todos los proyectos publicados (no solo destacados),
// usadas para alimentar los chips de sugerencia del hero con datos reales
// en vez de placeholders genéricos.
export async function getProjectCategories() {
  try {
    const res = await fetch(`${API_URL}/projects`, { cache: 'no-store' });
    if (!res.ok) return [];
    const json = await res.json();
    const categories = (json.data || []).flatMap((p) => p.categories || []);
    return Array.from(new Set(categories));
  } catch (_) {
    return [];
  }
}
