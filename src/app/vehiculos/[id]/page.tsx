import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { VehicleDetailClient } from '@/components/VehicleDetailClient';

async function getVehicle(id: string) {
  const base = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const res = await fetch(`${base}/api/vehicles/${id}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) return null;
  return res.json();
}

export default async function VehiclePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const vehicle = await getVehicle(id);
  if (!vehicle) notFound();

  const img = vehicle.images?.[0];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="text-primary font-semibold hover:underline">
            ← Volver al listado
          </Link>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-4">
            <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
              {img ? (
                <Image
                  src={img}
                  alt={vehicle.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                  Sin imagen
                </div>
              )}
            </div>
            {vehicle.images?.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {vehicle.images.slice(1, 5).map((url: string, i: number) => (
                  <div key={i} className="relative aspect-video rounded overflow-hidden bg-muted">
                    <Image
                      src={url}
                      alt={`${vehicle.title} ${i + 2}`}
                      fill
                      className="object-cover"
                      sizes="25vw"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              {vehicle.brand} {vehicle.model} — {vehicle.year}
            </h1>
            <p className="text-2xl font-bold text-foreground mb-4">
              {new Intl.NumberFormat('es-AR', {
                style: 'currency',
                currency: vehicle.currency || 'ARS',
                minimumFractionDigits: 0,
              }).format(vehicle.price)}
            </p>
            <p className="text-muted-foreground whitespace-pre-wrap mb-6">
              {vehicle.description}
            </p>
            <ul className="space-y-1 text-sm mb-6">
              {vehicle.mileage != null && (
                <li>
                  <strong>Kilometraje:</strong> {vehicle.mileage.toLocaleString('es-AR')} km
                </li>
              )}
              {vehicle.fuel && (
                <li>
                  <strong>Combustible:</strong> {vehicle.fuel}
                </li>
              )}
              {vehicle.transmission && (
                <li>
                  <strong>Transmisión:</strong> {vehicle.transmission}
                </li>
              )}
            </ul>
            <VehicleDetailClient vehicleId={vehicle._id} vehicleTitle={vehicle.title} />
          </div>
        </div>
      </main>
    </div>
  );
}
