import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { connectDB } from '@/lib/db';
import { Vehicle } from '@/models/Vehicle';
import { Contact } from '@/models/Contact';

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as { role?: string })?.role !== 'admin') {
    redirect('/admin/login');
  }

  await connectDB();
  const [totalVehicles, publishedVehicles, totalContacts] = await Promise.all([
    Vehicle.countDocuments(),
    Vehicle.countDocuments({ published: true }),
    Contact.countDocuments(),
  ]);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Panel de administración</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border bg-card p-6">
          <p className="text-muted-foreground text-sm">Vehículos totales</p>
          <p className="text-2xl font-bold">{totalVehicles}</p>
          <Link href="/admin/vehiculos">
            <Button variant="outline" size="sm" className="mt-2">
              Gestionar
            </Button>
          </Link>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <p className="text-muted-foreground text-sm">Publicados</p>
          <p className="text-2xl font-bold">{publishedVehicles}</p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <p className="text-muted-foreground text-sm">Contactos</p>
          <p className="text-2xl font-bold">{totalContacts}</p>
          <Link href="/admin/contactos">
            <Button variant="outline" size="sm" className="mt-2">
              Ver lista
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
