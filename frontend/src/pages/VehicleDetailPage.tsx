import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { ContactSeller } from '@/components/ContactSeller';
import { VehicleDetailMotion } from '@/components/VehicleDetailMotion';
import { VehicleImageGallery } from '@/components/VehicleImageGallery';
import { VehicleRecommendations } from '@/components/VehicleRecommendations';
import { Footer } from '@/components/Footer';
import { SiteHeader } from '@/components/SiteHeader';

// Comment

export default function VehicleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [vehicle, setVehicle] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    apiFetch(`/vehicles/${id}`)
      .then((res) => res.ok ? res.json() : null)
      .then(setVehicle)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading || !vehicle) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#B59F02] border-t-transparent" />
      </div>
    );
  }

  const title = (vehicle.title as string) ?? '';
  const currency = (vehicle.currency as string) ?? 'ARS';
  const _id = (vehicle._id as string) ?? '';
  const images = (Array.isArray(vehicle.images) ? vehicle.images : []) as string[];
  const vehicleType = vehicle.vehicleType as 'auto' | 'moto' | undefined;

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <SiteHeader
        leftContent={
          <Link to="/#vehiculos" className="text-gray-400 hover:text-[#F4E17F] text-sm font-medium transition-colors">
            ← Volver al listado
          </Link>
        }
      />

      <main className="flex-1 container mx-auto px-4 py-8">
        <VehicleDetailMotion className="grid gap-8 lg:grid-cols-2">
          <div>
            <VehicleImageGallery images={images} title={title} />
          </div>

          <div>
            <h1 className="text-2xl md:text-3xl font-bold uppercase tracking-wide text-white mb-2">
              {vehicle.brand} {vehicle.model} — {vehicle.year}
            </h1>
            <p className="text-2xl font-bold text-[#F4E17F] mb-4">
              {new Intl.NumberFormat('es-AR', { style: 'currency', currency, minimumFractionDigits: 0 }).format((vehicle.price as number) ?? 0)}
            </p>
            <p className="text-gray-300 whitespace-pre-wrap mb-6">{String(vehicle.description ?? '')}</p>
            <ul className="space-y-1 text-sm text-gray-300 mb-6">
              {vehicle.location && (
                <li><strong className="text-[#B59F02]">Ubicación:</strong> {String(vehicle.location)}</li>
              )}
              {vehicle.mileage != null && (
                <li><strong className="text-[#B59F02]">Kilometraje:</strong> {Number(vehicle.mileage).toLocaleString('es-AR')} km</li>
              )}
              {vehicle.fuel && <li><strong className="text-[#B59F02]">Combustible:</strong> {String(vehicle.fuel)}</li>}
              {vehicle.transmission && <li><strong className="text-[#B59F02]">Transmisión:</strong> {String(vehicle.transmission)}</li>}
              {vehicle.color && <li><strong className="text-[#B59F02]">Color:</strong> {String(vehicle.color)}</li>}
              {vehicle.bodyType && <li><strong className="text-[#B59F02]">Carrocería:</strong> {String(vehicle.bodyType)}</li>}
              {vehicleType !== 'moto' && vehicle.doors != null && Number(vehicle.doors) > 0 && (
                <li><strong className="text-[#B59F02]">Puertas:</strong> {Number(vehicle.doors)}</li>
              )}
              {Array.isArray(vehicle.details) && vehicle.details.length > 0 && (
                <li className="pt-2">
                  <strong className="text-[#B59F02]">Detalles:</strong>
                  <ul className="mt-1 list-disc list-inside text-gray-300 space-y-0.5">
                    {(vehicle.details as string[]).map((d: string, i: number) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>
                </li>
              )}
            </ul>
            <ContactSeller
              vehicleTitle={title}
              sellerPhone={vehicle.sellerPhone as string | undefined}
              sellerEmail={vehicle.sellerEmail as string | undefined}
            />
          </div>
        </VehicleDetailMotion>

        <VehicleRecommendations excludeId={_id} />
      </main>
      <Footer />
    </div>
  );
}
