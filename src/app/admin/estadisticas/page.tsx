import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { connectDB } from '@/lib/db';
import { Vehicle } from '@/models/Vehicle';
import { AnalyticsEvent } from '@/models/AnalyticsEvent';
import { Contact } from '@/models/Contact';
import { StatsClient } from '@/components/admin/StatsClient';
import { formatPrice } from '@/lib/utils';

export default async function AdminStatsPage() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as { role?: string })?.role !== 'admin') {
    redirect('/admin/login');
  }

  await connectDB();

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [
    viewsTotal,
    viewsByDay,
    totalContacts,
    totalVehicles,
    avgPrice,
    vehiclesByBrand,
  ] = await Promise.all([
    AnalyticsEvent.countDocuments({
      name: 'page_view',
      path: /^\/vehiculos\//,
      createdAt: { $gte: thirtyDaysAgo },
    }),
    AnalyticsEvent.aggregate([
      { $match: { name: 'page_view', path: /^\/vehiculos\//, createdAt: { $gte: thirtyDaysAgo } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]),
    Contact.countDocuments(),
    Vehicle.countDocuments({ published: true }),
    Vehicle.aggregate([{ $match: { published: true } }, { $group: { _id: null, avg: { $avg: '$price' } } }]),
    Vehicle.aggregate([
      { $match: { published: true } },
      { $group: { _id: '$brand', count: { $sum: 1 }, avgPrice: { $avg: '$price' } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]),
  ]);

  const viewsByDayData = (viewsByDay as { _id: string; count: number }[]).map((d) => ({
    date: d._id,
    vistas: d.count,
  }));

  const avgPriceValue = avgPrice[0]?.avg ?? 0;
  const byBrand = (vehiclesByBrand as { _id: string; count: number; avgPrice: number }[]).map((b) => ({
    marca: b._id,
    cantidad: b.count,
    precioPromedio: Math.round(b.avgPrice),
  }));

  return (
    <StatsClient
      viewsTotal={viewsTotal}
      viewsByDay={viewsByDayData}
      totalContacts={totalContacts}
      totalVehicles={totalVehicles}
      avgPrice={avgPriceValue}
      byBrand={byBrand}
    />
  );
}
