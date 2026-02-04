import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { AnalyticsEvent } from '@/models/AnalyticsEvent';
import { withRateLimit, corsHeaders, handleCorsPreflight } from '@/lib/api-middleware';
import { z } from 'zod';

const eventSchema = z.object({
  name: z.string().min(1).max(100),
  payload: z.record(z.unknown()).optional(),
  path: z.string().max(500).optional(),
});

/**
 * POST /api/analytics - Registra un evento (ej. page_view, click_cta).
 */
async function postHandler(req: NextRequest): Promise<NextResponse> {
  const preflight = handleCorsPreflight(req);
  if (preflight) return preflight;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: 'Body JSON inválido' },
      { status: 400, headers: corsHeaders(req.headers.get('origin') ?? undefined) }
    );
  }

  const parsed = eventSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Datos inválidos' },
      { status: 400, headers: corsHeaders(req.headers.get('origin') ?? undefined) }
    );
  }

  try {
    await connectDB();
    await AnalyticsEvent.create({
      name: parsed.data.name,
      payload: parsed.data.payload,
      path: parsed.data.path,
      sessionId: req.headers.get('x-session-id') ?? undefined,
    });
    return NextResponse.json(
      { success: true },
      { headers: corsHeaders(req.headers.get('origin') ?? undefined) }
    );
  } catch (err) {
    console.error('[API analytics]', err);
    return NextResponse.json(
      { error: 'Error al registrar evento' },
      { status: 500, headers: corsHeaders(req.headers.get('origin') ?? undefined) }
    );
  }
}

export const POST = withRateLimit(postHandler);
