import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { DashboardClient } from '@/components/admin/DashboardClient';

export default function DashboardPage() {
  const { token } = useAuth();
  const [stats, setStats] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    apiFetch('/admin/stats', { token: token ?? undefined })
      .then((res) => (res.ok ? res.json() : null))
      .then(setStats);
  }, [token]);

  if (!stats) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#B59F02] border-t-transparent" />
      </div>
    );
  }

  return (
    <DashboardClient
      stats={{
        totalVehicles: stats.totalVehicles as number,
        publishedVehicles: stats.publishedVehicles as number,
        featuredCount: stats.featuredCount as number,
        totalContacts: stats.totalContacts as number,
        viewsLast30: stats.viewsLast30 as number,
        avgPrice: stats.avgPrice as number,
        viewsByDay: (stats.viewsByDay as { date: string; vistas: number }[]) ?? [],
        expiringVehicles: (stats.expiringVehicles as { id: string; title: string; image?: string; daysRemaining: number }[]) ?? [],
      }}
    />
  );
}
