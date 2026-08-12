# Portfolio AI — Portafolio Conversacional

Portafolio profesional donde el mecanismo principal de navegación es un chatbot con IA (Gemini). El backend recupera contexto relevante desde MongoDB y se lo entrega a Gemini, que responde en un formato JSON estructurado que el frontend usa para renderizar componentes visuales (proyectos, habilidades, experiencia, contacto). Incluye un panel de administración completo para gestionar todo el contenido sin tocar código.

Sigue la arquitectura y los principios definidos en `CLAUDE.md` / el prompt maestro original: MongoDB como única fuente de verdad, Gemini solo como capa de interpretación, sin datos inventados, API key únicamente en el backend.

## Stack

- **Frontend**: Next.js 14 (App Router) + React + Tailwind CSS + Framer Motion
- **Backend**: Node.js + Express
- **Base de datos**: MongoDB + Mongoose
- **IA**: Gemini API (`@google/genai`)
- **Imágenes**: Cloudinary
- **Auth**: JWT en cookies HTTP-only

## Estructura

```
portfolio-ai/
  backend/            API REST (Express + Mongoose + Gemini + Cloudinary)
    src/
      config/          env y conexión a MongoDB
      models/          Profile, Project, Skill, Experience, Education, Admin
      controllers/      lógica de cada recurso
      routes/           definición de endpoints
      middleware/       auth (JWT), rate limiting, validación, manejo de errores
      services/         gemini.service.js, cloudinary.service.js, context.service.js
      validators/       reglas de express-validator
      scripts/seed.js    datos de ejemplo + admin inicial
  frontend/           Next.js App Router
    app/               páginas (home + /admin/*)
    components/        chat, proyectos, admin, ui primitivos
    lib/               cliente HTTP y helpers de datos server-side
    hooks/, context/    estado del chat y de la sesión admin
```

## 1. Requisitos previos

- Node.js 18 o superior
- Una base de datos MongoDB (local o [MongoDB Atlas](https://www.mongodb.com/atlas), capa gratuita es suficiente)
- Una API key de [Gemini](https://ai.google.dev/) (Google AI Studio)
- Una cuenta de [Cloudinary](https://cloudinary.com/) (capa gratuita es suficiente) — solo necesaria para subir imágenes de proyectos/avatar

## 2. Backend

```bash
cd backend
cp .env.example .env
```

Completa `.env` con tus valores reales:

```
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/portfolio-ai
JWT_SECRET=un-secreto-largo-y-aleatorio
GEMINI_API_KEY=tu-api-key-de-gemini
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
ADMIN_USERNAME=admin
ADMIN_PASSWORD=elige-una-contraseña-segura
```

Instala dependencias y **carga datos de ejemplo** (admin + perfil + 3 proyectos + habilidades + experiencia + educación) para tener la demo lista de inmediato:

```bash
npm install
npm run seed
npm run dev
```

El backend queda en `http://localhost:4000`. Verifica con `curl http://localhost:4000/api/health`.

## 3. Frontend

En otra terminal:

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

El sitio queda en `http://localhost:3000`. El panel admin está en `http://localhost:3000/admin` — inicia sesión con el `ADMIN_USERNAME` / `ADMIN_PASSWORD` que definiste en `backend/.env` antes de correr el seed.

## 4. Diseño del home (chat conversacional)

La página de inicio (`/`) fue rediseñada como una interfaz de búsqueda conversacional inmersiva, inspirada en un estilo "cósmico": fondo animado con blobs de color y estrellas que reaccionan al movimiento del mouse (parallax), saludo con tu nombre real tomado del perfil, y un input tipo píldora que migra del centro de la pantalla hacia una barra fija superior en cuanto se envía la primera pregunta.

Piezas clave (`frontend/components/home/`):

- `CosmicBackground.js` — fondo fijo con blobs (`blur` + drift autónomo) y estrellas, con parallax por mouse vía `requestAnimationFrame` (sin afectar el rendimiento con re-renders de React).
- `Hero.js` — saludo, nombre, título y bio corta del perfil (ya no hay texto genérico de placeholder).
- `SearchBar.js` — input único (misma instancia) que se anima con Framer Motion (`layout`) entre el estado centrado y la barra superior; incluye dictado por voz (Web Speech API, con detección de soporte del navegador).
- `FloatingSuggestions.js` — chips dispersos con nombres reales de habilidades y categorías de proyectos (no texto de relleno); en móvil se muestran en fila en vez de flotando.
- `ConversationFeed.js` / `ConversationTurn.js` — el chat vive "afuera", sin caja contenedora: cada pregunta se muestra como una tarjeta de vidrio con estado de búsqueda → "Listo" + etiquetas de qué se encontró (Proyectos, Habilidades, etc.), la respuesta, y los bloques de UI correspondientes.
- `components/shared/TechTile.js` — las tecnologías ya no se muestran como etiquetas de texto: son tarjetas grandes con el ícono subido desde el admin (Cloudinary) o, si no hay ícono, un monograma de color determinista.

El panel admin (`/admin`) no fue rediseñado (tal como se pidió), salvo un cambio puntual: el formulario de Habilidades ahora permite subir una imagen/ícono por tecnología vía Cloudinary (campo `icon` + `iconPublicId` en el modelo `Skill`), que es lo que alimenta las tarjetas grandes del home.

## 5. Flujo del chat

```
Visitante → Frontend → Backend (/api/chat)
  → context.service.js recupera perfil + proyectos/habilidades/experiencia relevantes desde MongoDB
  → gemini.service.js envía ese contexto + instrucciones estrictas a Gemini
  → Gemini responde en JSON: { "message": "...", "ui": [ { "type": "...", "data": {...} } ] }
  → el frontend renderiza el texto y los componentes visuales correspondientes
```

Gemini tiene instrucciones explícitas de responder **solo** con la información del contexto recibido y de reconocer cuando algo no existe, en vez de inventarlo.

## 6. Qué se validó y qué falta por probar con credenciales reales

En el entorno donde se generó este proyecto no hay acceso a MongoDB, Gemini ni Cloudinary reales, así que se validó lo siguiente de forma local:

- ✅ `npm install` sin vulnerabilidades en backend y frontend
- ✅ Sintaxis de **todos** los archivos del backend (`node --check`)
- ✅ El servidor Express arranca y responde correctamente en `/api/health`, rutas inexistentes (404) y rutas que dependen de Mongo (fallan de forma controlada sin credenciales, en vez de colgarse)
- ✅ `next build` de producción compila sin errores y genera las 9 rutas (home + 8 vistas de admin)
- ✅ `next dev` sirve todas las rutas probadas con `200 OK` y sin errores de renderizado
- ✅ Verificación visual con Playwright (capturas reales): estado idle del hero, parallax del fondo al mover el mouse, transición del input al enviar una pregunta, estado de carga y de error, y una previsualización con datos de ejemplo para los bloques de proyectos/habilidades

Lo que **debes probar tú** con tus propias credenciales, porque no se pudo ejecutar aquí:

- Conexión real a MongoDB y persistencia de datos (`npm run seed`)
- Llamadas reales a Gemini y el parseo de su respuesta JSON
- Subida real de imágenes a Cloudinary desde el admin (proyectos, perfil y ahora también íconos de habilidades)

## 7. Extender con RAG/búsqueda semántica

`backend/src/services/context.service.js` concentra toda la lógica de "qué contexto se le manda a Gemini". Hoy usa búsqueda de texto simple de MongoDB (`$text`); es el único punto que habría que tocar para migrar a embeddings/búsqueda vectorial más adelante, sin afectar `gemini.service.js` ni el resto de la app.

## 8. Seguridad ya implementada

- JWT en cookies `httpOnly` (no accesibles desde JS del navegador)
- Rate limiting en `/api/chat` (40 req / 15 min) y en `/api/auth/login` (10 req / 15 min)
- Validación de entradas con `express-validator` en todos los endpoints de escritura
- CORS restringido al origen del frontend (`CORS_ORIGIN`)
- Manejo centralizado de errores — nunca se exponen stack traces en producción
- Endpoints administrativos protegidos con middleware `protect`
