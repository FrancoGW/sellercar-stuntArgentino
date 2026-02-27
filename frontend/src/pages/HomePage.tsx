import { Suspense, useEffect, useState } from 'react';
import { HeroSlider } from '@/components/HeroSlider';
import { VehicleGrid } from '@/components/VehicleGrid';
import { VehicleFilters } from '@/components/VehicleFilters';
import { VehicleCard } from '@/components/VehicleCard';
import { MotionSection } from '@/components/MotionSection';
import { Footer } from '@/components/Footer';
import { SiteHeader } from '@/components/SiteHeader';
import { apiFetch } from '@/lib/api';
import { motion } from 'motion/react';
// asdasdasdas
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
}

function FeaturedSection() {
  const [items, setItems] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/vehicles?featured=true&limit=6')
      .then((r) => r.ok ? r.json() : { items: [] })
      .then((data) => setItems(data?.items ?? []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-80 rounded-lg bg-muted animate-pulse" />
        ))}
      </div>
    );
  }

  if (!items.length) return null;

  return (
    <motion.div
      className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {items.map((v) => (
        <VehicleCard key={v._id} vehicle={v} />
      ))}
    </motion.div>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-black">
      <SiteHeader />

      <HeroSlider />
      <main className="flex-1 container mx-auto px-4 py-8">
        <MotionSection className="space-y-6 mb-10" delay={0.1}>
          <h2 id="destacados" className="text-2xl font-bold tracking-tight text-[#F4E17F]">
            Destacados
          </h2>
          <FeaturedSection />
        </MotionSection>

        <MotionSection id="vehiculos" className="space-y-6" delay={0.15}>
          <Suspense fallback={<div className="h-24 rounded-2xl border border-[#B59F02]/30 bg-black/40 animate-pulse" />}>
            <VehicleFilters />
            <VehicleGrid />
          </Suspense>
        </MotionSection>
      </main>

      <Footer />
    </div>
  );
}
