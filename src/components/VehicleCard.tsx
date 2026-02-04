'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatPrice, getExpirationStatus } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface VehicleCardProps {
  vehicle: {
    _id: string;
    title: string;
    price: number;
    currency: string;
    brand: string;
    model: string;
    year: number;
    images: string[];
    featured?: boolean;
    vtvExpiresAt?: string | null;
    patentExpiresAt?: string | null;
  };
}

function ExpirationBadge({ date, label }: { date: string | null | undefined; label: string }) {
  const status = getExpirationStatus(date ?? null);
  if (!status) return null;
  return (
    <span
      className={cn(
        'text-xs font-medium px-2 py-0.5 rounded',
        status === 'ok' && 'bg-status-ok/20 text-status-ok',
        status === 'warning' && 'bg-status-warning/20 text-status-warning',
        status === 'error' && 'bg-status-error/20 text-status-error'
      )}
    >
      {label}: {status === 'ok' ? 'Vigente' : status === 'warning' ? 'Por vencer' : 'Vencido'}
    </span>
  );
}

export function VehicleCard({ vehicle }: VehicleCardProps) {
  const img = vehicle.images?.[0];
  const vtvStatus = getExpirationStatus(vehicle.vtvExpiresAt ?? null);
  const patentStatus = getExpirationStatus(vehicle.patentExpiresAt ?? null);

  return (
    <Card className="overflow-hidden flex flex-col h-full">
      <Link href={`/vehiculos/${vehicle._id}`} className="block">
        <div className="relative aspect-[4/3] bg-muted">
          {img ? (
            <Image
              src={img}
              alt={vehicle.title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              loading="lazy"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
              Sin imagen
            </div>
          )}
          {vehicle.featured && (
            <span className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
              Destacado
            </span>
          )}
        </div>
      </Link>
      <CardHeader className="pb-2">
        <h3 className="font-semibold text-lg leading-tight">
          <Link href={`/vehiculos/${vehicle._id}`} className="hover:underline">
            {vehicle.brand} {vehicle.model}
          </Link>
        </h3>
        <p className="text-sm text-muted-foreground">{vehicle.year}</p>
      </CardHeader>
      <CardContent className="pb-2 flex-1">
        {(vtvStatus || patentStatus) && (
          <div className="flex flex-wrap gap-1 mb-2">
            <ExpirationBadge date={vehicle.vtvExpiresAt} label="VTV" />
            <ExpirationBadge date={vehicle.patentExpiresAt} label="Patente" />
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pt-4 border-t">
        {/* Alto contraste para precio y CTA */}
        <p className="text-xl font-bold text-foreground">
          {formatPrice(vehicle.price, vehicle.currency)}
        </p>
        <Button variant="cta" asChild className="w-full sm:w-auto">
          <Link href={`/vehiculos/${vehicle._id}`}>Ver detalle</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
