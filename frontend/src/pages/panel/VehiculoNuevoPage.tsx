import { VehicleForm } from '@/components/admin/VehicleForm';

export default function VehiculoNuevoPage() {
  return (
    <div>
      <h1 className="text-xl font-bold text-white mb-4 sm:text-2xl sm:mb-6">Nuevo vehículo</h1>
      <VehicleForm />
    </div>
  );
}
