# Deploy en Vercel (configuración obligatoria)

Este proyecto es **Vite + React** (sitio estático), no Next.js. Para que el deploy funcione en Vercel hay que usar esta carpeta como raíz del proyecto.

## Pasos en el dashboard de Vercel

1. Entrá a tu proyecto → **Settings** → **General**.
2. En **Root Directory** hacé clic en **Edit**.
3. Escribí: **`frontend`** y guardá.
4. En **Framework Preset** asegurate que diga **Vite** (no Next.js). Si dice otro, cambiá a **Vite** y guardá.
5. Dejá el resto por defecto (Build Command: `npm run build`, Output: `dist`, Install: `npm ci`).

Con eso Vercel usará este `vercel.json` y desplegará el build estático correctamente. Si la raíz del proyecto queda en el repo (fuera de `frontend`), Vercel detecta Next.js y falla con errores como "routes-manifest" o "No serverless pages were built".
