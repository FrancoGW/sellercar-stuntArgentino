import { AdminVehicleList } from '@/components/admin/AdminVehicleList';

export default function VehiculosPage() {
  return (
    <div>
      <h1 className="text-xl font-bold text-white mb-4 sm:text-2xl sm:mb-6">Vehículos</h1>
      <AdminVehicleList />
    </div>
  );
}
