import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { Contact } from '@/models/Contact';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PER_PAGE = 20;

export default async function AdminContactsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as { role?: string })?.role !== 'admin') {
    redirect('/admin/login');
  }

  const { page: pageStr } = await searchParams;
  const page = Math.max(1, parseInt(pageStr ?? '1', 10));

  await connectDB();
  const skip = (page - 1) * PER_PAGE;
  const [contacts, total] = await Promise.all([
    Contact.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(PER_PAGE)
      .lean(),
    Contact.countDocuments(),
  ]);

  const totalPages = Math.ceil(total / PER_PAGE);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Contactos</h1>
      <Card>
        <CardHeader>
          <CardTitle>Mensajes recibidos</CardTitle>
        </CardHeader>
        <CardContent>
          {contacts.length === 0 ? (
            <p className="text-muted-foreground">No hay contactos aún.</p>
          ) : (
            <ul className="space-y-4">
              {contacts.map((c) => (
                <li key={String(c._id)} className="border-b pb-4 last:border-0">
                  <p className="font-medium">{c.name}</p>
                  <p className="text-sm text-muted-foreground">{c.email} {c.phone && `· ${c.phone}`}</p>
                  <p className="mt-2 text-sm whitespace-pre-wrap">{c.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(c.createdAt).toLocaleString('es-AR')}
                  </p>
                </li>
              ))}
            </ul>
          )}
          {totalPages > 1 && (
            <div className="mt-4 flex justify-center gap-2">
              {page > 1 && (
                <a href={`/admin/contactos?page=${page - 1}`} className="text-primary hover:underline">
                  Anterior
                </a>
              )}
              <span className="px-4 text-muted-foreground">
                {page} / {totalPages}
              </span>
              {page < totalPages && (
                <a href={`/admin/contactos?page=${page + 1}`} className="text-primary hover:underline">
                  Siguiente
                </a>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
