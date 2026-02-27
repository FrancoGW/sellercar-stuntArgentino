import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { apiFetch } from '@/lib/api';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { vehicleSchema, type VehicleInput } from '@/lib/validations/vehicle';
import { BASE_PLANS, ADDONS } from '@/lib/plans';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { Plus, Trash2 } from 'lucide-react';

function toDateInput(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function oneMonthFrom(d: Date): string {
  const next = new Date(d);
  next.setMonth(next.getMonth() + 1);
  return toDateInput(next);
}

interface VehicleFormProps {
  vehicle?: Record<string, unknown> & { _id: string };
}

export function VehicleForm({ vehicle }: VehicleFormProps) {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [submitError, setSubmitError] = useState('');
  const isEdit = !!vehicle?._id;

  const {
    register,
    control,
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
          vehicleType: (vehicle.vehicleType as 'auto' | 'moto') ?? 'auto',
          mileage: (vehicle.mileage as number) ?? undefined,
          fuel: (vehicle.fuel as string) ?? '',
          transmission: (vehicle.transmission as string) ?? '',
          color: (vehicle.color as string) ?? '',
          bodyType: (vehicle.bodyType as string) ?? '',
          doors: (vehicle.doors as number) ?? undefined,
          details: (vehicle.details as string[]) ?? [],
          location: (vehicle.location as string) ?? '',
          images: (vehicle.images as string[]) ?? [],
          featured: (vehicle.featured as boolean) ?? false,
          published: (vehicle.published as boolean) ?? false,
          vtvExpiresAt: (vehicle.vtvExpiresAt as string)?.slice(0, 10) ?? '',
          patentExpiresAt: (vehicle.patentExpiresAt as string)?.slice(0, 10) ?? '',
          clientFirstName: (vehicle.clientFirstName as string) ?? '',
          clientLastName: (vehicle.clientLastName as string) ?? '',
          clientDni: (vehicle.clientDni as string) ?? '',
          sellerPhone: (vehicle.sellerPhone as string) ?? '',
          sellerEmail: (vehicle.sellerEmail as string) ?? '',
          plan: (vehicle.plan as string) || 'ninguno',
          planExpiresAt: (vehicle.planExpiresAt as string)?.slice(0, 10) ?? '',
          addonDestacado24hUntil: (vehicle.addonDestacado24hUntil as string) ?? '',
          addonPrioritario7dUntil: (vehicle.addonPrioritario7dUntil as string) ?? '',
        }
      : {
          currency: 'ARS',
          vehicleType: 'auto',
          images: [],
          featured: false,
          published: false,
          vtvExpiresAt: '',
          patentExpiresAt: '',
          color: '',
          bodyType: '',
          doors: undefined,
          details: [],
          location: '',
          plan: 'ninguno',
          planExpiresAt: oneMonthFrom(new Date()),
          addonDestacado24hUntil: '',
          addonPrioritario7dUntil: '',
          clientFirstName: '',
          clientLastName: '',
          clientDni: '',
          sellerPhone: '',
          sellerEmail: '',
        },
  });

  const images = watch('images');
  const { fields: detailFields, append: appendDetail, remove: removeDetail } = useFieldArray({
    control,
    name: 'details',
  });
  const [newDetailText, setNewDetailText] = useState('');
  const createdAt = vehicle?.createdAt
    ? toDateInput(new Date((vehicle.createdAt as string | Date)))
    : null;

  const onSubmit = async (data: VehicleInput) => {
    setSubmitError('');
    const path = isEdit ? `/admin/vehicles/${vehicle!._id}` : '/admin/vehicles';
    const method = isEdit ? 'PUT' : 'POST';
    const res = await apiFetch(path, { method, body: JSON.stringify(data), token: token ?? undefined });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      setSubmitError((json.error as string) || 'Error al guardar');
      return;
    }
    navigate('/panel/vehiculos');
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
          className="flex min-h-[120px] w-full rounded-xl border-2 border-gray-600/50 bg-black/50 px-3 py-2 text-sm text-white placeholder:text-gray-400 transition-all duration-300 hover:border-gray-500 focus:outline-none focus:border-[#B59F02] focus:ring-2 focus:ring-[#B59F02]/20"
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
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-2">
          <Label>Tipo de vehículo</Label>
          <Select
            value={watch('vehicleType') ?? 'auto'}
            onValueChange={(v) => {
              setValue('vehicleType', v as 'auto' | 'moto');
              if (v === 'moto') setValue('doors', undefined);
            }}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="auto">Auto</SelectItem>
              <SelectItem value="moto">Moto</SelectItem>
            </SelectContent>
          </Select>
        </div>
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

      <div className="rounded-2xl border border-[#B59F02]/30 bg-black/30 p-4 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wide text-[#F4E17F]">
          Detalles del {watch('vehicleType') === 'moto' ? 'vehículo' : 'auto'}
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <Label>Color</Label>
            <Input {...register('color')} placeholder="Ej: Negro, Blanco" />
          </div>
          {watch('vehicleType') !== 'moto' && (
            <>
              <div className="space-y-2">
                <Label>Tipo de carrocería</Label>
                <Select
                  value={watch('bodyType') || 'ninguno'}
                  onValueChange={(v) => setValue('bodyType', v === 'ninguno' ? null : v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="— Elegir —" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ninguno">— Elegir —</SelectItem>
                    <SelectItem value="Sedan">Sedan</SelectItem>
                    <SelectItem value="SUV">SUV</SelectItem>
                    <SelectItem value="Pickup">Pickup</SelectItem>
                    <SelectItem value="Hatchback">Hatchback</SelectItem>
                    <SelectItem value="Coupé">Coupé</SelectItem>
                    <SelectItem value="Station Wagon">Station Wagon</SelectItem>
                    <SelectItem value="Van">Van</SelectItem>
                    <SelectItem value="Camioneta">Camioneta</SelectItem>
                    <SelectItem value="Otro">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Cant. puertas</Label>
                <Input
                  type="number"
                  min={2}
                  max={6}
                  {...register('doors', { valueAsNumber: true })}
                  placeholder="3, 5..."
                />
              </div>
            </>
          )}
        </div>
        <div className="space-y-2">
          <Label>Detalles (choques, abolladuras, etc.)</Label>
          <p className="text-xs text-gray-400">
            Agregá ítems manualmente, por ejemplo: choque en puerta derecha, abolladura en paragolpes.
          </p>
          <div className="flex gap-2">
            <Input
              value={newDetailText}
              onChange={(e) => setNewDetailText(e.target.value)}
              placeholder="Ej: Choque en puerta derecha"
              className="flex-1"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  if (newDetailText.trim()) {
                    appendDetail(newDetailText.trim());
                    setNewDetailText('');
                  }
                }
              }}
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => {
                if (newDetailText.trim()) {
                  appendDetail(newDetailText.trim());
                  setNewDetailText('');
                }
              }}
              title="Agregar detalle"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {detailFields.length > 0 && (
            <ul className="mt-2 space-y-1.5">
              {detailFields.map((field, index) => (
                <li
                  key={field.id}
                  className="flex items-center gap-2 rounded-lg border border-[#B59F02]/20 bg-black/30 px-3 py-2 text-sm text-gray-200"
                >
                  <span className="flex-1">{watch(`details.${index}`)}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0 text-gray-400 hover:text-red-400"
                    onClick={() => removeDetail(index)}
                    title="Quitar"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Ubicación</Label>
        <Input
          {...register('location')}
          placeholder="Ej: CABA, La Plata, Zona Norte, Avellaneda..."
        />
        <p className="text-xs text-gray-400">
          Ciudad, zona o referencia de dónde está el vehículo.
        </p>
      </div>

      <div className="rounded-2xl border border-[#B59F02]/40 bg-black/40 p-4 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wide text-[#F4E17F]">
          Datos del cliente
        </h3>
        <p className="text-xs text-gray-400">
          Nombre, apellido, DNI y contacto (teléfono o email) del dueño del vehículo.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <Label>Nombre</Label>
            <Input {...register('clientFirstName')} placeholder="Nombre del cliente" />
          </div>
          <div className="space-y-2">
            <Label>Apellido</Label>
            <Input {...register('clientLastName')} placeholder="Apellido del cliente" />
          </div>
          <div className="space-y-2">
            <Label>DNI</Label>
            <Input {...register('clientDni')} placeholder="Ej: 12345678" />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Teléfono / WhatsApp</Label>
            <Input
              {...register('sellerPhone')}
              placeholder="Ej: 11 1234-5678 o 54911 12345678"
            />
            {errors.sellerPhone && (
              <p className="text-sm text-destructive">{errors.sellerPhone.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              type="email"
              {...register('sellerEmail')}
              placeholder="email@ejemplo.com"
            />
            {errors.sellerEmail && (
              <p className="text-sm text-destructive">{errors.sellerEmail.message}</p>
            )}
          </div>
        </div>
        <p className="text-xs text-amber-300/90">
          Obligatorio: al menos uno (teléfono o email) para que los compradores puedan contactar.
        </p>
      </div>

      <div className="rounded-2xl border border-[#B59F02]/40 bg-black/40 p-4 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wide text-[#F4E17F]">
          Plan principal
        </h3>
        <p className="text-xs text-gray-400">
          Un solo plan por vehículo. El plan corre 1 mes desde el día en que se publica el vehículo.
        </p>
        <div className="space-y-2">
          <Label>Plan del cliente</Label>
          <Select
            value={watch('plan') ?? 'ninguno'}
            onValueChange={(v) => setValue('plan', v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="— Elegir plan —" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ninguno">— Elegir plan —</SelectItem>
              {BASE_PLANS.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name} — {p.price}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {(watch('plan') && watch('plan') !== 'ninguno' && watch('planExpiresAt')) && (
          <p className="text-sm text-gray-400">
            Vence: {new Date(watch('planExpiresAt')).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
          </p>
        )}
      </div>

      <div className="rounded-2xl border border-[#B59F02]/30 bg-black/30 p-4 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wide text-[#F4E17F]">
          Servicios adicionales
        </h3>
        <p className="text-xs text-gray-400">
          Destacado en la web (arriba) o prioridad en búsquedas. Activación simple.
        </p>
        <div className="space-y-4">
          <label className="flex items-start gap-3 rounded-lg border border-[#B59F02]/20 bg-black/30 p-3 cursor-pointer hover:border-[#B59F02]/40">
            <input
              type="checkbox"
              className="mt-1 rounded border-2 border-[#B59F02]/50 bg-black/50 text-[#B59F02]"
              checked={
                (() => {
                  const until = watch('addonDestacado24hUntil');
                  if (!until) return false;
                  return new Date(until) > new Date();
                })()
              }
              onChange={(e) => {
                if (e.target.checked) {
                  const d = new Date();
                  d.setHours(d.getHours() + 24);
                  setValue('addonDestacado24hUntil', d.toISOString());
                } else {
                  setValue('addonDestacado24hUntil', '');
                }
              }}
            />
            <div>
              <span className="font-medium text-gray-200">{ADDONS.find((a) => a.id === 'destacado_24hs')?.name}</span>
              <p className="text-xs text-gray-400">{ADDONS.find((a) => a.id === 'destacado_24hs')?.price} — Arriba en la web 24 hs</p>
              {watch('addonDestacado24hUntil') && new Date(watch('addonDestacado24hUntil')) > new Date() && (
                <p className="text-xs text-[#B59F02] mt-1">Activo hasta {new Date(watch('addonDestacado24hUntil')).toLocaleString('es-AR')}</p>
              )}
            </div>
          </label>
          <label className="flex items-start gap-3 rounded-lg border border-[#B59F02]/20 bg-black/30 p-3 cursor-pointer hover:border-[#B59F02]/40">
            <input
              type="checkbox"
              className="mt-1 rounded border-2 border-[#B59F02]/50 bg-black/50 text-[#B59F02]"
              checked={
                (() => {
                  const until = watch('addonPrioritario7dUntil');
                  if (!until) return false;
                  return new Date(until) > new Date();
                })()
              }
              onChange={(e) => {
                if (e.target.checked) {
                  const d = new Date();
                  d.setDate(d.getDate() + 7);
                  setValue('addonPrioritario7dUntil', d.toISOString());
                } else {
                  setValue('addonPrioritario7dUntil', '');
                }
              }}
            />
            <div>
              <span className="font-medium text-gray-200">{ADDONS.find((a) => a.id === 'prioritario_7d')?.name}</span>
              <p className="text-xs text-gray-400">{ADDONS.find((a) => a.id === 'prioritario_7d')?.price} — Prioridad en búsquedas 7 días</p>
              {watch('addonPrioritario7dUntil') && new Date(watch('addonPrioritario7dUntil')) > new Date() && (
                <p className="text-xs text-[#B59F02] mt-1">Activo hasta {new Date(watch('addonPrioritario7dUntil')).toLocaleString('es-AR')}</p>
              )}
            </div>
          </label>
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
        <label className="flex items-center gap-2 text-gray-200 cursor-pointer">
          <input
            type="checkbox"
            className="rounded border-2 border-[#B59F02]/50 bg-black/50 text-[#B59F02] focus:ring-[#B59F02]/20"
            {...register('featured')}
          />
          Destacado
        </label>
        <label className="flex items-center gap-2 text-gray-200 cursor-pointer">
          <input
            type="checkbox"
            className="rounded border-2 border-[#B59F02]/50 bg-black/50 text-[#B59F02] focus:ring-[#B59F02]/20"
            {...register('published')}
          />
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
