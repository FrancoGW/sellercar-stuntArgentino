import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { VehicleCard } from '@/components/VehicleCard';
import { motion } from 'motion/react';

interface VehicleRecommendationsProps {
  excludeId: string;
}

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
  vtvExpiresAt?: string | null;
  patentExpiresAt?: string | null;
  sellerPhone?: string | null;
  sellerEmail?: string | null;
}

export function VehicleRecommendations({ excludeId }: VehicleRecommendationsProps) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/vehicles?limit=8')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.items) {
          const filtered = (data.items as Vehicle[]).filter((v) => v._id !== excludeId).slice(0, 4);
          setVehicles(filtered);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [excludeId]);

  if (loading || vehicles.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="mt-12 pt-8 border-t border-[#B59F02]/20"
    >
      <h2 className="text-xl md:text-2xl font-bold uppercase tracking-wide text-[#F4E17F] mb-6">
        Te puede interesar
      </h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {vehicles.map((v) => (
          <VehicleCard key={v._id} vehicle={v} />
        ))}
      </div>
    </motion.section>
  );
}
