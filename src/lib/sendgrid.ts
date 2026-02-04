import sgMail from '@sendgrid/mail';

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL ?? 'noreply@example.com';

if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY);
}

export interface SendEmailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

/**
 * Envía un email vía SendGrid. Si no hay API key, solo loguea en desarrollo.
 */
export async function sendEmail({
  to,
  subject,
  text,
  html,
}: SendEmailOptions): Promise<{ success: boolean; error?: string }> {
  if (!SENDGRID_API_KEY) {
    if (process.env.NODE_ENV === 'development') {
      console.log('[SendGrid] No API key. Would send:', { to, subject, text: text.slice(0, 80) });
    }
    return { success: true };
  }
  try {
    await sgMail.send({
      to,
      from: FROM_EMAIL,
      subject,
      text,
      html: html ?? text.replace(/\n/g, '<br>'),
    });
    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[SendGrid]', message);
    return { success: false, error: message };
  }
}

/**
 * Notifica al admin sobre un nuevo contacto desde el formulario.
 */
export async function notifyNewContact(params: {
  name: string;
  email: string;
  phone?: string;
  message: string;
  vehicleTitle?: string;
}): Promise<{ success: boolean; error?: string }> {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) {
    console.warn('[SendGrid] ADMIN_EMAIL no definido');
    return { success: true };
  }
  const subject = `Nuevo contacto: ${params.name}`;
  const text = [
    `Nombre: ${params.name}`,
    `Email: ${params.email}`,
    params.phone ? `Teléfono: ${params.phone}` : '',
    params.vehicleTitle ? `Vehículo: ${params.vehicleTitle}` : '',
    '',
    params.message,
  ]
    .filter(Boolean)
    .join('\n');
  return sendEmail({
    to: adminEmail,
    subject,
    text,
    html: text.replace(/\n/g, '<br>'),
  });
}
