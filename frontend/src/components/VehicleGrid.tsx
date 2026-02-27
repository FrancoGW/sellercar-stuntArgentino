import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { apiFetch } from '@/lib/api';
import { motion } from 'motion/react';
import { VehicleCard } from '@/components/VehicleCard';
import { Button } from '@/components/ui/button';

const PER_PAGE = 12;

interface Vehicle {
  _id: string;
  title: string;
  price: number;
  currency: string;
  brand: string;
  model: string;
  year: number;
  images: string[];
  featured?: boolean;
  vehicleType?: 'auto' | 'moto';
  mileage?: number | null;
  vtvExpiresAt?: string;
  patentExpiresAt?: string;
  sellerPhone?: string | null;
  sellerEmail?: string | null;
}

interface ApiResponse {
  items: Vehicle[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function VehicleGrid() {
  const [searchParams] = useSearchParams();
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const query = new URLSearchParams();
  searchParams.forEach((v: string, k: string) => query.set(k, v));
  if (!query.has('limit')) query.set('limit', String(PER_PAGE));
  const queryStr = query.toString();

  useEffect(() => {
    setLoading(true);
    setError(null);
    apiFetch(`/vehicles?${queryStr}`)
      .then((res) => {
        if (!res.ok) throw new Error('Error al cargar');
        return res.json();
      })
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [queryStr]);

  if (loading && !data) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-80 rounded-lg bg-muted animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
        {error}
      </div>
    );
  }

  if (!data?.items.length) {
    return (
      <p className="text-center text-muted-foreground py-12">
        No hay vehículos que coincidan con los filtros.
      </p>
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.06 },
    },
  };

  return (
    <div className="space-y-6">
      <motion.div
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {data.items.map((v) => (
          <VehicleCard key={v._id} vehicle={v} />
        ))}
      </motion.div>

      {/* Paginación eficiente */}
      {data.totalPages > 1 && (
        <div className="flex flex-wrap justify-center gap-2">
          {data.page > 1 && (
            <Button
              variant="outline"
              asChild
            >
              <a href={`/?${new URLSearchParams({ ...Object.fromEntries(Array.from(searchParams.entries())), page: String(data.page - 1) }).toString()}`}>
                Anterior
              </a>
            </Button>
          )}
          <span className="flex items-center px-4 text-sm text-muted-foreground">
            Página {data.page} de {data.totalPages}
          </span>
          {data.page < data.totalPages && (
            <Button
              variant="outline"
              asChild
            >
              <a href={`/?${new URLSearchParams({ ...Object.fromEntries(Array.from(searchParams.entries())), page: String(data.page + 1) }).toString()}`}>
                Siguiente
              </a>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
