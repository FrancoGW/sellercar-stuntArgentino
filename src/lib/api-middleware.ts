import { NextRequest, NextResponse } from 'next/server';
import { rateLimit } from '@/lib/rate-limit';

/**
 * Obtiene IP del request para rate limiting (considerar X-Forwarded-For en producción).
 */
function getClientIdentifier(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return req.headers.get('x-real-ip') ?? 'unknown';
}

/**
 * Aplica rate limiting y devuelve 429 si se excede.
 * Pasa el context (ej. params) al handler.
 */
export function withRateLimit<T = unknown>(
  handler: (req: NextRequest, context?: T) => Promise<NextResponse>
) {
  return async (req: NextRequest, context?: T): Promise<NextResponse> => {
    const id = getClientIdentifier(req);
    const result = rateLimit(id);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Demasiadas solicitudes. Intente más tarde.' },
        { status: 429, headers: { 'Retry-After': '60' } }
      );
    }
    return handler(req, context);
  };
}

/**
 * Headers CORS para respuestas API.
 */
export function corsHeaders(origin?: string): Record<string, string> {
  const allowOrigin = origin || process.env.NEXT_PUBLIC_APP_URL || '*';
  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
  };
}

/**
 * Responde a preflight OPTIONS con CORS.
 */
export function handleCorsPreflight(req: NextRequest): NextResponse | null {
  if (req.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 204,
      headers: corsHeaders(req.headers.get('origin') ?? undefined),
    });
  }
  return null;
}
