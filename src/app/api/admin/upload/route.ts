import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { corsHeaders, handleCorsPreflight } from '@/lib/api-middleware';

const FOLDER = 'sellercar/vehicles';

/**
 * POST /api/admin/upload - Sube imagen a Cloudinary (solo admin).
 * Body: multipart/form-data con campo "file".
 */
async function postHandler(req: NextRequest): Promise<NextResponse> {
  const preflight = handleCorsPreflight(req);
  if (preflight) return preflight;

  const session = await getServerSession(authOptions);
  if (!session || (session.user as { role?: string })?.role !== 'admin') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file');
    if (!file || !(file instanceof Blob)) {
      return NextResponse.json(
        { error: 'Falta el archivo "file"' },
        { status: 400, headers: corsHeaders(req.headers.get('origin') ?? undefined) }
      );
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    const { secure_url, public_id } = await uploadToCloudinary(buffer, FOLDER);
    return NextResponse.json(
      { url: secure_url, publicId: public_id },
      { headers: corsHeaders(req.headers.get('origin') ?? undefined) }
    );
  } catch (err) {
    console.error('[API admin upload]', err);
    return NextResponse.json(
      { error: 'Error al subir imagen' },
      { status: 500, headers: corsHeaders(req.headers.get('origin') ?? undefined) }
    );
  }
}

export const POST = postHandler;
