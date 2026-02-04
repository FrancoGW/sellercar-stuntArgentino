import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { VehicleForm } from '@/components/admin/VehicleForm';

export default async function NewVehiclePage() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as { role?: string })?.role !== 'admin') {
    redirect('/admin/login');
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Nuevo vehículo</h1>
      <VehicleForm />
    </div>
  );
}
