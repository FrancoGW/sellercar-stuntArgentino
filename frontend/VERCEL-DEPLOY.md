# Deploy del frontend en Vercel

Este proyecto es **Vite + React** (sitio estático). El backend se despliega por separado.

## Si el proyecto de Vercel del frontend tiene raíz en el repo

Cuando el proyecto del **frontend** en Vercel tiene **Root Directory** en la raíz del repo (sin poner `frontend`), Vercel usa el archivo **`vercel.json` en la raíz del repo**. Ese archivo ya está configurado para construir solo el frontend (framework: Vite, output: `frontend/dist`) y no afecta al deploy del backend.

## Si preferís que la raíz del proyecto sea solo `frontend`

1. En el **proyecto del frontend** en Vercel → **Settings** → **General**.
2. **Root Directory** → **Edit** → **`frontend`** → **Save**.
3. **Framework Preset** → **Vite**.

En ese caso Vercel usará solo `frontend/vercel.json` (npm ci, npm run build, dist).
