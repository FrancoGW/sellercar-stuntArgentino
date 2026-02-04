import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { Vehicle } from '@/models/Vehicle';
import { vehicleSchema } from '@/lib/validations/vehicle';
import { sanitizeObject } from '@/lib/validations/sanitize';
import { corsHeaders, handleCorsPreflight } from '@/lib/api-middleware';

/**
 * GET /api/admin/vehicles/[id]
 */
async function getHandler(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const preflight = handleCorsPreflight(req);
  if (preflight) return preflight;

  const session = await getServerSession(authOptions);
  if (!session || (session.user as { role?: string })?.role !== 'admin') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
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
    const vehicle = await Vehicle.findById(id).lean();
    if (!vehicle) {
      return NextResponse.json(
        { error: 'No encontrado' },
        { status: 404, headers: corsHeaders(req.headers.get('origin') ?? undefined) }
      );
    }
    return NextResponse.json(vehicle, {
      headers: corsHeaders(req.headers.get('origin') ?? undefined),
    });
  } catch (err) {
    console.error('[API admin vehicles id]', err);
    return NextResponse.json(
      { error: 'Error al obtener' },
      { status: 500, headers: corsHeaders(req.headers.get('origin') ?? undefined) }
    );
  }
}

/**
 * PUT /api/admin/vehicles/[id]
 */
async function putHandler(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const preflight = handleCorsPreflight(req);
  if (preflight) return preflight;

  const session = await getServerSession(authOptions);
  if (!session || (session.user as { role?: string })?.role !== 'admin') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const { id } = await params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { error: 'ID inválido' },
      { status: 400, headers: corsHeaders(req.headers.get('origin') ?? undefined) }
    );
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
    const vehicle = await Vehicle.findByIdAndUpdate(
      id,
      { $set: sanitizeObject(toSave as Record<string, unknown>) },
      { new: true }
    ).lean();
    if (!vehicle) {
      return NextResponse.json(
        { error: 'No encontrado' },
        { status: 404, headers: corsHeaders(req.headers.get('origin') ?? undefined) }
      );
    }
    return NextResponse.json(vehicle, {
      headers: corsHeaders(req.headers.get('origin') ?? undefined),
    });
  } catch (err) {
    console.error('[API admin vehicles PUT]', err);
    return NextResponse.json(
      { error: 'Error al actualizar' },
      { status: 500, headers: corsHeaders(req.headers.get('origin') ?? undefined) }
    );
  }
}

/**
 * DELETE /api/admin/vehicles/[id]
 */
async function deleteHandler(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const preflight = handleCorsPreflight(req);
  if (preflight) return preflight;

  const session = await getServerSession(authOptions);
  if (!session || (session.user as { role?: string })?.role !== 'admin') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
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
    const vehicle = await Vehicle.findByIdAndDelete(id);
    if (!vehicle) {
      return NextResponse.json(
        { error: 'No encontrado' },
        { status: 404, headers: corsHeaders(req.headers.get('origin') ?? undefined) }
      );
    }
    return NextResponse.json(
      { success: true },
      { headers: corsHeaders(req.headers.get('origin') ?? undefined) }
    );
  } catch (err) {
    console.error('[API admin vehicles DELETE]', err);
    return NextResponse.json(
      { error: 'Error al eliminar' },
      { status: 500, headers: corsHeaders(req.headers.get('origin') ?? undefined) }
    );
  }
}

export const GET = getHandler;
export const PUT = putHandler;
export const DELETE = deleteHandler;
