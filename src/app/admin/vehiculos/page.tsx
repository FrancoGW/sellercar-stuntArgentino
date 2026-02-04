import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AdminVehicleList } from '@/components/admin/AdminVehicleList';

export default async function AdminVehiclesPage() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as { role?: string })?.role !== 'admin') {
    redirect('/admin/login');
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Vehículos</h1>
        <Button asChild>
          <Link href="/admin/vehiculos/nuevo">Nuevo vehículo</Link>
        </Button>
      </div>
      <AdminVehicleList />
    </div>
  );
}
