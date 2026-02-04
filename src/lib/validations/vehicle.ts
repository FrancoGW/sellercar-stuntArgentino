import { z } from 'zod';

/** Validación frontend/backend para crear/actualizar vehículo */
export const vehicleSchema = z.object({
  title: z.string().min(3, 'Mínimo 3 caracteres').max(200),
  description: z.string().min(10).max(5000),
  price: z.number().min(0),
  currency: z.string().length(3).optional().default('ARS'),
  brand: z.string().min(1, 'Marca requerida').max(100),
  model: z.string().min(1, 'Modelo requerido').max(100),
  year: z.number().min(1900).max(new Date().getFullYear() + 1),
  mileage: z.number().min(0).optional().nullable(),
  fuel: z.string().max(50).optional().nullable(),
  transmission: z.string().max(50).optional().nullable(),
  images: z.array(z.string().url()).default([]),
  featured: z.boolean().default(false),
  published: z.boolean().default(false),
  vtvExpiresAt: z
    .string()
    .optional()
    .nullable()
    .transform((v) => (v ? new Date(v).toISOString() : null)),
  patentExpiresAt: z
    .string()
    .optional()
    .nullable()
    .transform((v) => (v ? new Date(v).toISOString() : null)),
});

export type VehicleInput = z.infer<typeof vehicleSchema>;

export const vehicleQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  brand: z.string().optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  minYear: z.coerce.number().optional(),
  maxYear: z.coerce.number().optional(),
  featured: z.coerce.boolean().optional(),
});

export type VehicleQuery = z.infer<typeof vehicleQuerySchema>;
