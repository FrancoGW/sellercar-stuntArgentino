export type BasePlanId = 'clasico' | 'premium' | 'vip' | 'deluxe';
export type AddonId = 'destacado_24hs' | 'prioritario_7d';
export type PlanId = BasePlanId | AddonId;
export type PlanType = 'base' | 'adicional';

export interface Plan {
  id: PlanId;
  type: PlanType;
  name: string;
  price: string;
  description: string[];
}

export const PLANS: Plan[] = [
  { id: 'clasico', type: 'base', name: 'CLÁSICO', price: '$25.000/mes', description: ['Publicación en Instagram (feed)', 'Publicación en la web', 'Aparece en el catálogo general'] },
  { id: 'premium', type: 'base', name: 'PREMIUM', price: '$30.000/mes', description: ['Todo lo del plan Clásico', 'Destacado en la home por 24 horas', '1 republicación a los 30 días en Instagram'] },
  { id: 'vip', type: 'base', name: 'VIP', price: '$35.000/mes', description: ['Todo lo del plan Premium', 'Destacado en la home por 24 horas', '2 republicaciones cada 30 días en Instagram'] },
  { id: 'deluxe', type: 'base', name: 'DELUXE', price: '$45.000/mes', description: ['Todo lo del plan VIP', 'Destacado en la home todo el mes (30 días)', 'Republicación mensual por 1 año en Instagram', 'Máxima visibilidad en búsquedas y filtros'] },
  { id: 'destacado_24hs', type: 'adicional', name: 'DESTACADO 24HS', price: '$9.744 (pago único)', description: ['Destacado en la posición #1 de la home por 24 horas', 'Máxima exposición por un día'] },
  { id: 'prioritario_7d', type: 'adicional', name: 'PRIORITARIO 7 DÍAS', price: '$19.494 (pago único)', description: ['Aparece primero en todas las búsquedas por 7 días', 'Banner especial en la home', 'Notificación a usuarios registrados'] },
];

export const BASE_PLANS = PLANS.filter((p) => p.type === 'base');
export const ADDONS = PLANS.filter((p) => p.type === 'adicional');

export function getPlanById(id: string | null | undefined): Plan | undefined {
  if (!id) return undefined;
  return PLANS.find((p) => p.id === id);
}
