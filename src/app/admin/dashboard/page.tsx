import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { Vehicle } from '@/models/Vehicle';
import { Contact } from '@/models/Contact';
import { AnalyticsEvent } from '@/models/AnalyticsEvent';
import { DashboardClient } from '@/components/admin/DashboardClient';
import { formatPrice, getDaysRemaining } from '@/lib/utils';

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as { role?: string })?.role !== 'admin') {
    return null;
  }

  await connectDB();

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [
    totalVehicles,
    publishedVehicles,
    featuredCount,
    totalContacts,
    viewsLast30,
    viewsByDay,
    vehiclesExpiringSoon,
    avgPrice,
  ] = await Promise.all([
    Vehicle.countDocuments(),
    Vehicle.countDocuments({ published: true }),
    Vehicle.countDocuments({ featured: true }),
    Contact.countDocuments(),
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
    Vehicle.find({
      $or: [
        {
          patentExpiresAt: { $exists: true, $ne: null, $lte: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) },
        },
        {
          vtvExpiresAt: { $exists: true, $ne: null, $lte: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) },
        },
      ],
    })
      .sort({ patentExpiresAt: 1 })
      .limit(10)
      .lean(),
    Vehicle.aggregate([{ $match: { published: true } }, { $group: { _id: null, avg: { $avg: '$price' } } }]),
  ]);

  const viewsByDayMap = (viewsByDay as { _id: string; count: number }[]).map((d) => ({
    date: d._id,
    vistas: d.count,
  }));

  const expiringVehicles = vehiclesExpiringSoon.map((v: { _id: unknown; title?: string; brand?: string; model?: string; images?: string[]; patentExpiresAt?: Date; vtvExpiresAt?: Date }) => {
    const expiresAt = v.patentExpiresAt ?? v.vtvExpiresAt ?? null;
    const days = getDaysRemaining(expiresAt);
    return {
      id: String(v._id),
      title: v.title ?? `${v.brand} ${v.model}`,
      image: (v.images as string[])?.[0],
      daysRemaining: days ?? 0,
    };
  });

  const avgPriceValue = avgPrice[0]?.avg ?? 0;

  return (
    <DashboardClient
      stats={{
        totalVehicles,
        publishedVehicles,
        featuredCount,
        totalContacts,
        viewsLast30,
        avgPrice: avgPriceValue,
        viewsByDay: viewsByDayMap,
        expiringVehicles,
      }}
    />
  );
}
