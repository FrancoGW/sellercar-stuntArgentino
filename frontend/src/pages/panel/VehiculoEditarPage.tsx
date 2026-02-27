import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { VehicleForm } from '@/components/admin/VehicleForm';

export default function VehiculoEditarPage() {
  const { id } = useParams<{ id: string }>();
  const { token } = useAuth();
  const [vehicle, setVehicle] = useState<Record<string, unknown> & { _id: string } | null>(null);

  useEffect(() => {
    if (!id || !token) return;
    apiFetch(`/admin/vehicles/${id}`, { token })
      .then((res) => (res.ok ? res.json() : null))
      .then(setVehicle);
  }, [id, token]);

  if (!vehicle) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#B59F02] border-t-transparent" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-xl font-bold text-white mb-4 sm:text-2xl sm:mb-6">Editar vehículo</h1>
      <VehicleForm vehicle={vehicle} />
    </div>
  );
}
