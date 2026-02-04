'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactSchema, type ContactInput } from '@/lib/validations/contact';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function ContactForm({
  vehicleId,
  onSuccess,
}: {
  vehicleId?: string;
  onSuccess?: () => void;
}) {
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { vehicleId, source: 'web' },
  });

  const onSubmit = async (data: ContactInput) => {
    setSubmitStatus('loading');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, vehicleId }),
      });
      const json = await res.json();
      if (!res.ok) {
        setSubmitStatus('error');
        return;
      }
      setSubmitStatus('success');
      onSuccess?.();
    } catch {
      setSubmitStatus('error');
    }
  };

  if (submitStatus === 'success') {
    return (
      <p className="text-status-ok font-medium">
        Mensaje enviado. Te contactaremos a la brevedad.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nombre</Label>
        <Input id="name" {...register('name')} />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" {...register('email')} />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Teléfono (opcional)</Label>
        <Input id="phone" {...register('phone')} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">Mensaje</Label>
        <textarea
          id="message"
          className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          {...register('message')}
        />
        {errors.message && (
          <p className="text-sm text-destructive">{errors.message.message}</p>
        )}
      </div>
      {submitStatus === 'error' && (
        <p className="text-sm text-destructive">Error al enviar. Intentá de nuevo.</p>
      )}
      <Button type="submit" variant="cta" disabled={submitStatus === 'loading'}>
        {submitStatus === 'loading' ? 'Enviando...' : 'Enviar'}
      </Button>
    </form>
  );
}
