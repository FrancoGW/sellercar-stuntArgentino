import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactSchema, type ContactInput } from '@/lib/validations/contact';
import { apiFetch } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

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
      const res = await apiFetch('/contact', {
        method: 'POST',
        body: JSON.stringify({ ...data, vehicleId }),
      });
      await res.json();
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
      <p className="text-green-400 font-medium">
        Mensaje enviado. Te contactaremos a la brevedad.
      </p>
    );
  }

  const inputClass =
    'bg-black/50 border-2 border-gray-600/50 focus:border-[#B59F02] focus:ring-2 focus:ring-[#B59F02]/20 text-white placeholder:text-gray-400 rounded-xl transition-all duration-300 hover:border-gray-500';
  const errorClass = 'text-sm text-red-300';

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nombre</Label>
        <Input id="name" {...register('name')} className={inputClass} />
        {errors.name && <p className={errorClass}>{errors.name.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" {...register('email')} className={inputClass} />
        {errors.email && <p className={errorClass}>{errors.email.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Teléfono (opcional)</Label>
        <Input id="phone" {...register('phone')} className={inputClass} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">Mensaje</Label>
        <textarea
          id="message"
          className={cn(
            'flex min-h-[100px] w-full rounded-xl border-2 border-gray-600/50 bg-black/50 px-3 py-2 text-sm text-white placeholder:text-gray-400 transition-all duration-300',
            'hover:border-gray-500 focus:outline-none focus:border-[#B59F02] focus:ring-2 focus:ring-[#B59F02]/20'
          )}
          {...register('message')}
        />
        {errors.message && <p className={errorClass}>{errors.message.message}</p>}
      </div>
      {submitStatus === 'error' && (
        <p className={errorClass}>Error al enviar. Intentá de nuevo.</p>
      )}
      <Button
        type="submit"
        variant="cta"
        disabled={submitStatus === 'loading'}
        className="rounded-xl"
      >
        {submitStatus === 'loading' ? 'Enviando...' : 'Enviar'}
      </Button>
    </form>
  );
}
