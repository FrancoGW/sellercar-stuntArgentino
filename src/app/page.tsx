import Link from 'next/link';
import { Suspense } from 'react';
import { VehicleGrid } from '@/components/VehicleGrid';
import { VehicleFilters } from '@/components/VehicleFilters';
import { MotionSection } from '@/components/MotionSection';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-semibold text-primary">
            SellerCar Stunt Argentino
          </Link>
          <nav className="flex gap-4">
            <Link href="/#vehiculos">
              <Button variant="ghost">Vehículos</Button>
            </Link>
            <Link href="/admin">
              <Button variant="outline">Admin</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <MotionSection className="text-center py-12">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Encontrá tu próximo vehículo
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto mb-6">
            Catálogo profesional con las mejores opciones. Filtros por marca, año y precio.
          </p>
        </MotionSection>

        <MotionSection id="vehiculos" className="space-y-6" delay={0.15}>
          <Suspense fallback={<div className="h-24 rounded-lg bg-muted animate-pulse" />}>
            <VehicleFilters />
            <VehicleGrid />
          </Suspense>
        </MotionSection>
      </main>

      <footer className="border-t bg-muted/50 py-8 mt-auto">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          SellerCar Stunt Argentino — Diseño profesional y moderno
        </div>
      </footer>
    </div>
  );
}
