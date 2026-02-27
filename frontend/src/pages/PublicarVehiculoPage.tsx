import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { apiFetch } from '@/lib/api';
import { SiteHeader } from '@/components/SiteHeader';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

const schema = z.object({
  name: z.string().min(2, 'Nombre requerido').max(100),
  email: z.string().email('Email inválido'),
  phone: z.string().min(8, 'Teléfono requerido (mín. 8 dígitos)').max(30),
  tipo: z.enum(['auto', 'moto', 'otro'], { required_error: 'Elegí Auto, Moto u Otro' }),
});

type FormData = z.infer<typeof schema>;

export default function PublicarVehiculoPage() {
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { tipo: undefined },
  });

  const tipo = watch('tipo');

  const onSubmit = async (data: FormData) => {
    setSubmitStatus('loading');
    try {
      const tipoLabel = { auto: 'Auto', moto: 'Moto', otro: 'Otro' }[data.tipo];
      const message = `Solicitud de publicación: ${tipoLabel}`;
      const res = await apiFetch('/contact', {
        method: 'POST',
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
          message,
          source: 'publicar_vehiculo',
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setSubmitStatus('error');
        toast.error(json?.message || 'Error al enviar. Intentá de nuevo.');
        return;
      }
      setSubmitStatus('success');
      toast.success('Solicitud enviada. Te contactaremos a la brevedad.');
    } catch {
      setSubmitStatus('error');
      toast.error('Error al enviar. Intentá de nuevo.');
    }
  };

  const inputClass =
    'bg-black/50 border-2 border-gray-600/50 focus:border-[#B59F02] focus:ring-2 focus:ring-[#B59F02]/20 text-white placeholder:text-gray-400 rounded-xl transition-all duration-300 hover:border-gray-500';
  const errorClass = 'text-sm text-red-300';

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <SiteHeader />
      <main className="flex-1 container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-md mx-auto"
        >
          <Card className="border-2 border-[#B59F02]/30 bg-gradient-to-br from-gray-900/95 to-black">
            <CardHeader>
              <CardTitle className="text-xl text-[#F4E17F]">
                ¿Querés vender tu vehículo?
              </CardTitle>
              <p className="text-sm text-gray-400">
                Dejanos tus datos y nos ponemos en contacto.
              </p>
            </CardHeader>
            <CardContent>
              {submitStatus === 'success' ? (
                <div className="space-y-4">
                  <p className="text-green-400 font-medium">
                    Solicitud enviada. Te contactaremos a la brevedad.
                  </p>
                  <Button variant="outline" asChild className="border-[#B59F02]/50">
                    <Link to="/">Volver al inicio</Link>
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre *</Label>
                    <Input id="name" {...register('name')} className={inputClass} placeholder="Tu nombre" />
                    {errors.name && <p className={errorClass}>{errors.name.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input id="email" type="email" {...register('email')} className={inputClass} placeholder="tu@email.com" />
                    {errors.email && <p className={errorClass}>{errors.email.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono *</Label>
                    <Input id="phone" {...register('phone')} className={inputClass} placeholder="11 1234-5678" />
                    {errors.phone && <p className={errorClass}>{errors.phone.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label>Quiero vender *</Label>
                    <Select value={tipo} onValueChange={(v) => setValue('tipo', v as FormData['tipo'])}>
                      <SelectTrigger className={cn(inputClass, 'border-gray-600/50')}>
                        <SelectValue placeholder="Elegí Auto, Moto u Otro" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="auto">Auto</SelectItem>
                        <SelectItem value="moto">Moto</SelectItem>
                        <SelectItem value="otro">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.tipo && <p className={errorClass}>{errors.tipo.message}</p>}
                  </div>
                  {submitStatus === 'error' && (
                    <p className={errorClass}>Error al enviar. Intentá de nuevo.</p>
                  )}
                  <Button
                    type="submit"
                    disabled={submitStatus === 'loading'}
                    className="w-full rounded-xl bg-[#B59F02] text-black font-bold hover:bg-[#F4E17F]"
                  >
                    {submitStatus === 'loading' ? 'Enviando...' : 'Enviar solicitud'}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
