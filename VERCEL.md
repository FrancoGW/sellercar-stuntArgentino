# Despliegue en Vercel

Este repo tiene **frontend** (Vite + React) y **backend** (NestJS + Express). Podés desplegar de dos formas.

---

## Opción 1: Un solo proyecto Vercel (recomendado para empezar)

Todo (frontend + API) en un mismo dominio. Ideal para conectar el repo una sola vez.

### Pasos

1. En [vercel.com](https://vercel.com) → **Add New** → **Project** → importá el repo.
2. Dejá **Root Directory** en blanco (raíz del repo).
3. Vercel usará el `vercel.json` de la raíz, que ya está configurado para:
   - instalar y compilar backend y frontend,
   - servir el frontend desde `frontend/dist`,
   - exponer la API en `/api/*` mediante `api/index.ts`.

### Variables de entorno (en el proyecto de Vercel)

En **Settings → Environment Variables** agregá las del **backend** (las que usa Nest):

- `MONGODB_URI` (obligatorio)
- `JWT_SECRET` (obligatorio)
- `FRONTEND_URL` → la URL del mismo proyecto, ej. `https://tu-proyecto.vercel.app`
- Opcionales: SendGrid, Cloudinary (ver `backend/.env.example`)

No hace falta `VITE_API_URL` en el frontend: al estar en el mismo dominio, las llamadas van a `/api` automáticamente.

---

## Opción 2: Dos proyectos Vercel (frontend y backend por separado)

Útil si querés escalar o desplegar backend y frontend con independencia.

### Proyecto Backend

1. **Add New** → **Project** → mismo repo.
2. **Root Directory** → **Edit** → `backend` → **Save**.
3. **Environment Variables**: todas las del backend (ver `backend/.env.example`).
   - `FRONTEND_URL` = URL del proyecto **frontend** (ej. `https://tu-frontend.vercel.app`).
4. Deploy. Anotá la URL del backend (ej. `https://sellercar-api.vercel.app`).

### Proyecto Frontend

1. **Add New** → **Project** → mismo repo.
2. **Root Directory** → `frontend`.
3. **Environment Variables**:
   - `VITE_API_URL` = URL del proyecto **backend** (ej. `https://sellercar-api.vercel.app`), **sin** barra final.
4. Deploy.

Con esto el frontend llama al backend por su URL y el backend acepta ese origen por CORS (`FRONTEND_URL`).

---

## Resumen

| Opción | Root Directory | Archivo de config      | VITE_API_URL |
|--------|----------------|------------------------|--------------|
| **1 – Un proyecto** | (raíz)         | `vercel.json` (raíz)  | No hace falta |
| **2 – Dos proyectos** | Backend: `backend`<br>Frontend: `frontend` | `backend/vercel.json`<br>`frontend/vercel.json` | URL del backend |

---

## Chequeos rápidos

- **Backend**: después del deploy, `https://tu-dominio/api` o `https://tu-api.vercel.app/api` debería responder algo como "Backend funcionando".
- **Frontend**: la web carga y los listados de vehículos y el login del panel usan la API sin errores de CORS ni 404.
