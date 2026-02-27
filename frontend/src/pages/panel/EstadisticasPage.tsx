import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { StatsClient } from '@/components/admin/StatsClient';

export default function EstadisticasPage() {
  const { token } = useAuth();
  const [data, setData] = useState<{
    viewsTotal: number;
    viewsByDay: { date: string; vistas: number }[];
    totalContacts: number;
    totalVehicles: number;
    avgPrice: number;
    byBrand: { marca: string; cantidad: number; precioPromedio: number }[];
  } | null>(null);

  useEffect(() => {
    apiFetch('/admin/stats', { token: token ?? undefined })
      .then((res) => (res.ok ? res.json() : null))
      .then((stats) => {
        if (!stats) return;
        setData({
          viewsTotal: stats.viewsLast30 ?? 0,
          viewsByDay: (stats.viewsByDay ?? []).map((d: { date: string; vistas: number }) => ({ date: d.date, vistas: d.vistas })),
          totalContacts: stats.totalContacts ?? 0,
          totalVehicles: stats.publishedVehicles ?? 0,
          avgPrice: stats.avgPrice ?? 0,
          byBrand: stats.byBrand ?? [],
        });
      });
  }, [token]);

  if (!data) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#B59F02] border-t-transparent" />
      </div>
    );
  }

  return <StatsClient {...data} />;
}
