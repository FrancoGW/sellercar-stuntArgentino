# SellerCar Stunt Argentino

Aplicación web profesional para venta de vehículos: catálogo público, filtros, contacto y panel de administración.

## Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS** + **shadcn/ui** (Radix)
- **MongoDB** + Mongoose
- **NextAuth** (credenciales, protección rutas admin)
- **Cloudinary** (uploads de imágenes)
- **SendGrid** (emails)
- **Zod** (validación), **React Hook Form**

## Diseño y UX

- Paleta profesional y moderna (variables CSS en `globals.css`)
- Alto contraste para precios y CTAs (variante `cta` en botones, clase `price-cta`)
- Estados claros de vencimiento: verde (vigente), amarillo (por vencer), rojo (vencido)
- **Mobile-first**: filtros colapsables en móvil (Accordion), galería optimizada para touch
- Next.js Image con lazy loading y tamaños responsive
- Paginación eficiente en listado (infinite scroll opcional; aquí se usa paginación clásica)

## Seguridad

- Validación de inputs con Zod (frontend y backend)
- Rate limiting en APIs públicas (en memoria; en producción considerar Redis)
- Sanitización de datos (lib/validations/sanitize.ts)
- CORS configurado en `next.config.js` y en respuestas API
- NextAuth con middleware para protección de rutas `/admin` (excepto `/admin/login`)

## Setup

### 1. Clonar e instalar

```bash
cd sellercar-stuntArgentino
npm install
```

### 2. Variables de entorno

Copiar `.env.example` a `.env.local` y completar:

```bash
cp .env.example .env.local
```

- `MONGODB_URI`: conexión a MongoDB
- `NEXTAUTH_SECRET`: generar con `openssl rand -base64 32`
- `NEXTAUTH_URL`: en local `http://localhost:3000`
- `ADMIN_EMAIL` / `ADMIN_PASSWORD`: para crear el primer admin y notificaciones
- Cloudinary y SendGrid según uso

### 3. Crear usuario admin (primera vez)

Con MongoDB corriendo y env cargado:

```bash
ADMIN_EMAIL=admin@example.com ADMIN_PASSWORD=tuPassword MONGODB_URI=... npx ts-node --compiler-options '{"module":"CommonJS"}' scripts/seed-admin.ts
```

O usar un script en `package.json`:

```json
"seed:admin": "dotenv -e .env.local -- ts-node --compiler-options '{\"module\":\"CommonJS\"}' scripts/seed-admin.ts"
```

(Requiere `dotenv-cli`: `npm i -D dotenv-cli`.)

### 4. Desarrollo

```bash
npm run dev
```

- Sitio: http://localhost:3000
- Admin: http://localhost:3000/admin (login en `/admin/login`)

### 5. Build y producción

```bash
npm run build
npm start
```

## Estructura relevante

```
src/
  app/                    # App Router
    api/                  # API routes (vehicles, contact, analytics, admin)
    admin/                # Panel admin (login, dashboard, vehículos, contactos)
    vehiculos/[id]/       # Detalle público de vehículo
  components/             # UI y componentes de dominio
    ui/                   # shadcn (button, card, input, select, accordion, dialog)
    admin/                # AdminVehicleList, VehicleForm, ImageUpload
  lib/                    # db, auth, cloudinary, sendgrid, validations, rate-limit
  models/                 # Mongoose (User, Vehicle, Contact, AnalyticsEvent)
  types/                  # next-auth.d.ts
```

## APIs

| Ruta | Método | Descripción |
|------|--------|-------------|
| `/api/vehicles` | GET | Listado público con filtros y paginación |
| `/api/vehicles/[id]` | GET | Detalle público de un vehículo |
| `/api/contact` | POST | Formulario de contacto (validación + SendGrid) |
| `/api/analytics` | POST | Registrar evento (nombre, payload, path) |
| `/api/admin/vehicles` | GET, POST | Listar y crear vehículos (admin) |
| `/api/admin/vehicles/[id]` | GET, PUT, DELETE | CRUD vehículo (admin) |
| `/api/admin/upload` | POST | Subir imagen a Cloudinary (admin) |

## Tests

```bash
npm test
```

Tests básicos en `src/__tests__/` (utils, sanitize).

## Documentación de setup (resumen)

1. **Estructura**: Next.js + TypeScript + Tailwind + shadcn/ui.
2. **Dependencias**: Ver `package.json`; incluye next-auth, mongoose, cloudinary, @sendgrid/mail, zod, react-hook-form, etc.
3. **Configuración**: `tailwind.config.ts` (paleta, estados, radius), `next.config.js` (images Cloudinary, headers CORS).
4. **Autenticación**: NextAuth con CredentialsProvider; middleware protege `/admin` (no `/admin/login`).
5. **MongoDB**: `lib/db.ts` con caché; modelos en `models/`.
6. **API**: validación Zod, rate limit, CORS y sanitización donde aplica.
7. **Admin**: dashboard, ABM vehículos (con upload Cloudinary), listado de contactos.
8. **Emails**: SendGrid en `lib/sendgrid.ts`; notificación de nuevos contactos a `ADMIN_EMAIL`.

---

Código listo para producción: comentado donde aporta, manejo de errores y tipos TypeScript en todo el proyecto.
