import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { Vehicle } from '@/models/Vehicle';
import { vehicleSchema, vehicleQuerySchema } from '@/lib/validations/vehicle';
import { sanitizeObject } from '@/lib/validations/sanitize';
import { corsHeaders, handleCorsPreflight } from '@/lib/api-middleware';

/**
 * GET /api/admin/vehicles - Listado admin con filtros (sin restricción published).
 */
async function getHandler(req: NextRequest): Promise<NextResponse> {
  const preflight = handleCorsPreflight(req);
  if (preflight) return preflight;

  const session = await getServerSession(authOptions);
  if (!session || (session.user as { role?: string })?.role !== 'admin') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const parsed = vehicleQuerySchema.safeParse({
    page: searchParams.get('page') ?? 1,
    limit: searchParams.get('limit') ?? 12,
    brand: searchParams.get('brand') ?? undefined,
    minPrice: searchParams.get('minPrice') ?? undefined,
    maxPrice: searchParams.get('maxPrice') ?? undefined,
    featured: searchParams.get('featured') ?? undefined,
  });

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Parámetros inválidos' },
      { status: 400, headers: corsHeaders(req.headers.get('origin') ?? undefined) }
    );
  }

  const { page, limit, brand, minPrice, maxPrice, featured } = parsed.data;
  const filter: Record<string, unknown> = {};
  if (brand) filter.brand = new RegExp(brand, 'i');
  if (minPrice != null) filter.price = { ...((filter.price as object) || {}), $gte: minPrice };
  if (maxPrice != null) filter.price = { ...((filter.price as object) || {}), $lte: maxPrice };
  if (featured === true) filter.featured = true;

  try {
    await connectDB();
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      Vehicle.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Vehicle.countDocuments(filter),
    ]);
    return NextResponse.json(
      { items, total, page, limit, totalPages: Math.ceil(total / limit) },
      { headers: corsHeaders(req.headers.get('origin') ?? undefined) }
    );
  } catch (err) {
    console.error('[API admin vehicles]', err);
    return NextResponse.json(
      { error: 'Error al listar' },
      { status: 500, headers: corsHeaders(req.headers.get('origin') ?? undefined) }
    );
  }
}

/**
 * POST /api/admin/vehicles - Crear vehículo.
 */
async function postHandler(req: NextRequest): Promise<NextResponse> {
  const preflight = handleCorsPreflight(req);
  if (preflight) return preflight;

  const session = await getServerSession(authOptions);
  if (!session || (session.user as { role?: string })?.role !== 'admin') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: 'Body JSON inválido' },
      { status: 400, headers: corsHeaders(req.headers.get('origin') ?? undefined) }
    );
  }

  const parsed = vehicleSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Datos inválidos', details: parsed.error.flatten() },
      { status: 400, headers: corsHeaders(req.headers.get('origin') ?? undefined) }
    );
  }

  const data = parsed.data;
  const toSave = {
    ...data,
    vtvExpiresAt: data.vtvExpiresAt ? new Date(data.vtvExpiresAt) : undefined,
    patentExpiresAt: data.patentExpiresAt ? new Date(data.patentExpiresAt) : undefined,
  };

  try {
    await connectDB();
    const vehicle = await Vehicle.create(sanitizeObject(toSave as Record<string, unknown>));
    return NextResponse.json(vehicle, {
      status: 201,
      headers: corsHeaders(req.headers.get('origin') ?? undefined),
    });
  } catch (err) {
    console.error('[API admin vehicles POST]', err);
    return NextResponse.json(
      { error: 'Error al crear vehículo' },
      { status: 500, headers: corsHeaders(req.headers.get('origin') ?? undefined) }
    );
  }
}

export const GET = getHandler;
export const POST = postHandler;
