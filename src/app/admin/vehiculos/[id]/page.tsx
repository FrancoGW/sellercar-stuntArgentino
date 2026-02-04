import { redirect, notFound } from 'next/navigation';
import mongoose from 'mongoose';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { Vehicle } from '@/models/Vehicle';
import { VehicleForm } from '@/components/admin/VehicleForm';

export default async function EditVehiclePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as { role?: string })?.role !== 'admin') {
    redirect('/admin/login');
  }

  const { id } = await params;
  if (!mongoose.Types.ObjectId.isValid(id)) notFound();

  await connectDB();
  const vehicle = await Vehicle.findById(id).lean();
  if (!vehicle) notFound();

  const serialized = {
    ...vehicle,
    _id: vehicle._id.toString(),
    vtvExpiresAt: vehicle.vtvExpiresAt?.toISOString?.() ?? null,
    patentExpiresAt: vehicle.patentExpiresAt?.toISOString?.() ?? null,
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Editar vehículo</h1>
      <VehicleForm vehicle={serialized} />
    </div>
  );
}
