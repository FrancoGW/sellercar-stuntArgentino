'use client';

import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { formatPrice, getExpirationStatus, whatsappUrl, WHATSAPP_DEFAULT_MESSAGE } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { MessageCircle, ChevronRight, Gauge } from 'lucide-react';

interface VehicleCardProps {
  vehicle: {
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
    vtvExpiresAt?: string | null;
    patentExpiresAt?: string | null;
    mileage?: number | null;
    sellerPhone?: string | null;
    sellerEmail?: string | null;
  };
}

function ExpirationBadge({ date, label }: { date: string | null | undefined; label: string }) {
  const status = getExpirationStatus(date ?? null);
  if (!status) return null;
  return (
    <span
      className={cn(
        'text-[10px] font-semibold px-1.5 py-0.5 rounded uppercase tracking-wider',
        status === 'ok' && 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40',
        status === 'warning' && 'bg-amber-500/20 text-amber-300 border border-amber-500/40',
        status === 'error' && 'bg-red-500/20 text-red-400 border border-red-500/40'
      )}
    >
      {label}: {status === 'ok' ? 'Ok' : status === 'warning' ? 'Por vencer' : 'Vencido'}
    </span>
  );
}

export function VehicleCard({ vehicle }: VehicleCardProps) {
  const img = vehicle.images?.[0];
  const vtvStatus = getExpirationStatus(vehicle.vtvExpiresAt ?? null);
  const patentStatus = getExpirationStatus(vehicle.patentExpiresAt ?? null);
  const hasPhone = ((vehicle.sellerPhone ?? '').replace(/\D/g, '')).length >= 8;
  const isMoto = vehicle.vehicleType === 'moto';

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group h-full"
    >
      <div className="relative h-full flex flex-col overflow-hidden rounded-2xl border border-[#B59F02]/25 bg-gradient-to-b from-gray-900/95 to-black shadow-xl shadow-black/40 transition-all duration-500 hover:border-[#B59F02]/60 hover:shadow-2xl hover:shadow-[#B59F02]/15 hover:-translate-y-1">
        {/* Imagen */}
        <Link to={`/vehiculos/${vehicle._id}`} className="block relative overflow-hidden">
          <div className="relative aspect-[4/3] overflow-hidden bg-gray-800">
            {img ? (
              <img
                src={img}
                alt={vehicle.title}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                loading="lazy"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-sm">
                Sin imagen
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80" />
            <div className="absolute inset-0 bg-[#B59F02]/0 group-hover:bg-[#B59F02]/5 transition-colors duration-500" />

            {/* Badges superiores */}
            <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2">
              {vehicle.featured && (
                <span className="inline-flex items-center rounded-lg bg-[#B59F02] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-black shadow-lg">
                  Destacado
                </span>
              )}
              {isMoto && (
                <span className="inline-flex items-center rounded-lg bg-gray-800/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-gray-200 border border-gray-600/50">
                  Moto
                </span>
              )}
            </div>

            {/* Info superpuesta en la imagen */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="font-bold text-lg md:text-xl text-white leading-tight drop-shadow-lg">
                {vehicle.brand} {vehicle.model}
              </h3>
              <p className="text-sm text-gray-300 mt-0.5">{vehicle.year}</p>
            </div>
          </div>
        </Link>

        {/* Contenido */}
        <div className="flex flex-1 flex-col p-5">
          {(vtvStatus || patentStatus) && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              <ExpirationBadge date={vehicle.vtvExpiresAt} label="VTV" />
              <ExpirationBadge date={vehicle.patentExpiresAt} label="Patente" />
            </div>
          )}

          {vehicle.mileage != null && vehicle.mileage > 0 && (
            <div className="flex items-center gap-1.5 text-gray-400 text-sm mb-2">
              <Gauge className="h-4 w-4" />
              <span>{Number(vehicle.mileage).toLocaleString('es-AR')} km</span>
            </div>
          )}

          <p className="text-2xl font-bold text-[#F4E17F] mt-auto mb-4">
            {formatPrice(vehicle.price, vehicle.currency)}
          </p>

          {/* Botones */}
          <div className="flex flex-col sm:flex-row gap-2">
            {hasPhone && (
              <a
                href={whatsappUrl(vehicle.sellerPhone ?? '', WHATSAPP_DEFAULT_MESSAGE(vehicle.title))}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 text-sm font-bold text-white transition-all hover:bg-[#20BA5A] hover:shadow-lg hover:shadow-[#25D366]/30"
              >
                <MessageCircle className="h-5 w-5" />
                WhatsApp
              </a>
            )}
            <Link
              to={`/vehiculos/${vehicle._id}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-[#B59F02]/60 bg-transparent px-4 py-3 text-sm font-bold text-[#F4E17F] transition-all hover:bg-[#B59F02]/20 hover:border-[#B59F02]"
            >
              Ver detalle
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
