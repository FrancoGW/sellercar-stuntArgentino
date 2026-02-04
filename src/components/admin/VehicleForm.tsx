'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { vehicleSchema, type VehicleInput } from '@/lib/validations/vehicle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ImageUpload } from '@/components/admin/ImageUpload';

interface VehicleFormProps {
  vehicle?: Record<string, unknown> & { _id: string };
}

export function VehicleForm({ vehicle }: VehicleFormProps) {
  const router = useRouter();
  const [submitError, setSubmitError] = useState('');
  const isEdit = !!vehicle?._id;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<VehicleInput>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: vehicle
      ? {
          title: (vehicle.title as string) ?? '',
          description: (vehicle.description as string) ?? '',
          price: (vehicle.price as number) ?? 0,
          currency: (vehicle.currency as string) ?? 'ARS',
          brand: (vehicle.brand as string) ?? '',
          model: (vehicle.model as string) ?? '',
          year: (vehicle.year as number) ?? new Date().getFullYear(),
          mileage: (vehicle.mileage as number) ?? undefined,
          fuel: (vehicle.fuel as string) ?? '',
          transmission: (vehicle.transmission as string) ?? '',
          images: (vehicle.images as string[]) ?? [],
          featured: (vehicle.featured as boolean) ?? false,
          published: (vehicle.published as boolean) ?? false,
          vtvExpiresAt: (vehicle.vtvExpiresAt as string)?.slice(0, 10) ?? '',
          patentExpiresAt: (vehicle.patentExpiresAt as string)?.slice(0, 10) ?? '',
        }
      : {
          currency: 'ARS',
          images: [],
          featured: false,
          published: false,
          vtvExpiresAt: '',
          patentExpiresAt: '',
        },
  });

  const images = watch('images');

  const onSubmit = async (data: VehicleInput) => {
    setSubmitError('');
    const url = isEdit ? `/api/admin/vehicles/${vehicle!._id}` : '/api/admin/vehicles';
    const method = isEdit ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) {
      setSubmitError(json.error || 'Error al guardar');
      return;
    }
    router.push('/admin/vehiculos');
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label>Título</Label>
        <Input {...register('title')} />
        {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
      </div>
      <div className="space-y-2">
        <Label>Descripción</Label>
        <textarea
          className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          {...register('description')}
        />
        {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Precio</Label>
        <Input type="number" {...register('price', { valueAsNumber: true })} />
          {errors.price && <p className="text-sm text-destructive">{errors.price.message}</p>}
        </div>
        <div className="space-y-2">
          <Label>Moneda</Label>
          <Input {...register('currency')} />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Marca</Label>
          <Input {...register('brand')} />
          {errors.brand && <p className="text-sm text-destructive">{errors.brand.message}</p>}
        </div>
        <div className="space-y-2">
          <Label>Modelo</Label>
          <Input {...register('model')} />
          {errors.model && <p className="text-sm text-destructive">{errors.model.message}</p>}
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Año</Label>
          <Input type="number" {...register('year', { valueAsNumber: true })} />
          {errors.year && <p className="text-sm text-destructive">{errors.year.message}</p>}
        </div>
        <div className="space-y-2">
          <Label>Kilometraje</Label>
          <Input type="number" {...register('mileage', { valueAsNumber: true })} />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Combustible</Label>
          <Input {...register('fuel')} />
        </div>
        <div className="space-y-2">
          <Label>Transmisión</Label>
          <Input {...register('transmission')} />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Imágenes (URLs o subir)</Label>
        <ImageUpload
          urls={images}
          onChange={(urls) => setValue('images', urls)}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>VTV vence</Label>
          <Input type="date" {...register('vtvExpiresAt')} />
        </div>
        <div className="space-y-2">
          <Label>Patente vence</Label>
          <Input type="date" {...register('patentExpiresAt')} />
        </div>
      </div>
      <div className="flex gap-4">
        <label className="flex items-center gap-2">
          <input type="checkbox" {...register('featured')} />
          Destacado
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" {...register('published')} />
          Publicado
        </label>
      </div>
      {submitError && <p className="text-sm text-destructive">{submitError}</p>}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Crear vehículo'}
      </Button>
    </form>
  );
}
