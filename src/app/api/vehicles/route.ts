import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Vehicle } from '@/models/Vehicle';
import { vehicleQuerySchema } from '@/lib/validations/vehicle';
import { withRateLimit, corsHeaders, handleCorsPreflight } from '@/lib/api-middleware';

const PER_PAGE = 12;

/**
 * GET /api/vehicles - Listado público con filtros y paginación (caché recomendado en producción).
 */
async function getHandler(req: NextRequest): Promise<NextResponse> {
  const preflight = handleCorsPreflight(req);
  if (preflight) return preflight;

  const { searchParams } = new URL(req.url);
  const parsed = vehicleQuerySchema.safeParse({
    page: searchParams.get('page') ?? 1,
    limit: searchParams.get('limit') ?? PER_PAGE,
    brand: searchParams.get('brand') ?? undefined,
    minPrice: searchParams.get('minPrice') ?? undefined,
    maxPrice: searchParams.get('maxPrice') ?? undefined,
    minYear: searchParams.get('minYear') ?? undefined,
    maxYear: searchParams.get('maxYear') ?? undefined,
    featured: searchParams.get('featured') ?? undefined,
  });

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Parámetros inválidos', details: parsed.error.flatten() },
      { status: 400, headers: corsHeaders(req.headers.get('origin') ?? undefined) }
    );
  }

  const { page, limit, brand, minPrice, maxPrice, minYear, maxYear, featured } = parsed.data;

  try {
    await connectDB();
    const filter: Record<string, unknown> = { published: true };
    if (brand) filter.brand = new RegExp(brand, 'i');
    if (minPrice != null) filter.price = { ...((filter.price as object) || {}), $gte: minPrice };
    if (maxPrice != null) filter.price = { ...((filter.price as object) || {}), $lte: maxPrice };
    if (minYear != null) filter.year = { ...((filter.year as object) || {}), $gte: minYear };
    if (maxYear != null) filter.year = { ...((filter.year as object) || {}), $lte: maxYear };
    if (featured === true) filter.featured = true;

    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      Vehicle.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Vehicle.countDocuments(filter),
    ]);

    const headers = corsHeaders(req.headers.get('origin') ?? undefined);
    return NextResponse.json(
      { items, total, page, limit, totalPages: Math.ceil(total / limit) },
      { headers }
    );
  } catch (err) {
    console.error('[API vehicles]', err);
    return NextResponse.json(
      { error: 'Error al listar vehículos' },
      { status: 500, headers: corsHeaders(req.headers.get('origin') ?? undefined) }
    );
  }
}

export const GET = withRateLimit(getHandler);
