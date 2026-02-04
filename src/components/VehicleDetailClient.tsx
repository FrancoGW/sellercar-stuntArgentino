'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ContactForm } from '@/components/ContactForm';

export function VehicleDetailClient({
  vehicleId,
  vehicleTitle,
}: {
  vehicleId: string;
  vehicleTitle: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="cta" size="lg">
          Contactar por este vehículo
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Contacto — {vehicleTitle}</DialogTitle>
        </DialogHeader>
        <ContactForm
          vehicleId={vehicleId}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
