import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/db';
import { Contact } from '@/models/Contact';
import { Vehicle } from '@/models/Vehicle';
import { contactSchema } from '@/lib/validations/contact';
import { sanitizeString } from '@/lib/validations/sanitize';
import { notifyNewContact } from '@/lib/sendgrid';
import { withRateLimit, corsHeaders, handleCorsPreflight } from '@/lib/api-middleware';

/**
 * POST /api/contact - Formulario de contacto con validación y notificación por email.
 */
async function postHandler(req: NextRequest): Promise<NextResponse> {
  const preflight = handleCorsPreflight(req);
  if (preflight) return preflight;

  if (req.method !== 'POST') {
    return NextResponse.json(
      { error: 'Método no permitido' },
      { status: 405, headers: corsHeaders(req.headers.get('origin') ?? undefined) }
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

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Datos inválidos', details: parsed.error.flatten() },
      { status: 400, headers: corsHeaders(req.headers.get('origin') ?? undefined) }
    );
  }

  const { name, email, phone, message, vehicleId, source } = parsed.data;

  try {
    await connectDB();

    const validVehicleId = vehicleId && mongoose.Types.ObjectId.isValid(vehicleId)
      ? new mongoose.Types.ObjectId(vehicleId)
      : undefined;

    const contact = await Contact.create({
      name: sanitizeString(name),
      email: sanitizeString(email),
      phone: phone ? sanitizeString(phone) : undefined,
      message: sanitizeString(message, 2000),
      vehicleId: validVehicleId,
      source: sanitizeString(source ?? 'web'),
    });

    let vehicleTitle: string | undefined;
    if (validVehicleId) {
      const v = await Vehicle.findById(validVehicleId).select('title').lean();
      vehicleTitle = v?.title;
    }

    await notifyNewContact({
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      message: contact.message,
      vehicleTitle,
    });

    return NextResponse.json(
      { success: true, id: contact._id },
      { status: 201, headers: corsHeaders(req.headers.get('origin') ?? undefined) }
    );
  } catch (err) {
    console.error('[API contact]', err);
    return NextResponse.json(
      { error: 'Error al enviar el mensaje' },
      { status: 500, headers: corsHeaders(req.headers.get('origin') ?? undefined) }
    );
  }
}

export const POST = withRateLimit(postHandler);
