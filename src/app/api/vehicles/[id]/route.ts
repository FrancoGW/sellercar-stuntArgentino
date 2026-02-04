import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/db';
import { Vehicle } from '@/models/Vehicle';
import { corsHeaders, handleCorsPreflight, withRateLimit } from '@/lib/api-middleware';

/**
 * GET /api/vehicles/[id] - Detalle público de un vehículo (solo publicado).
 */
async function getHandler(
  req: NextRequest,
  context?: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const preflight = handleCorsPreflight(req);
  if (preflight) return preflight;
  const params = context?.params;
  if (!params) {
    return NextResponse.json(
      { error: 'Not found' },
      { status: 404, headers: corsHeaders(req.headers.get('origin') ?? undefined) }
    );
  }
  const { id } = await params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { error: 'ID inválido' },
      { status: 400, headers: corsHeaders(req.headers.get('origin') ?? undefined) }
    );
  }

  try {
    await connectDB();
    const vehicle = await Vehicle.findOne({ _id: id, published: true }).lean();
    if (!vehicle) {
      return NextResponse.json(
        { error: 'Vehículo no encontrado' },
        { status: 404, headers: corsHeaders(req.headers.get('origin') ?? undefined) }
      );
    }
    return NextResponse.json(vehicle, {
      headers: corsHeaders(req.headers.get('origin') ?? undefined),
    });
  } catch (err) {
    console.error('[API vehicles id]', err);
    return NextResponse.json(
      { error: 'Error al obtener vehículo' },
      { status: 500, headers: corsHeaders(req.headers.get('origin') ?? undefined) }
    );
  }
}

export const GET = withRateLimit(getHandler);
