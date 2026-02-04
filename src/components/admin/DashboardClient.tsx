'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import {
  Car,
  Star,
  Eye,
  DollarSign,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatCard } from '@/components/admin/StatCard';
import { Badge } from '@/components/ui/badge';
import { formatPrice, formatNumber } from '@/lib/utils';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

interface DashboardClientProps {
  stats: {
    totalVehicles: number;
    publishedVehicles: number;
    featuredCount: number;
    totalContacts: number;
    viewsLast30: number;
    avgPrice: number;
    viewsByDay: { date: string; vistas: number }[];
    expiringVehicles: { id: string; title: string; image?: string; daysRemaining: number }[];
  };
}

export function DashboardClient({ stats }: DashboardClientProps) {
  const {
    totalVehicles,
    publishedVehicles,
    featuredCount,
    totalContacts,
    viewsLast30,
    avgPrice,
    viewsByDay,
    expiringVehicles,
  } = stats;

  const typeData = [
    { name: 'Publicados', value: publishedVehicles, color: COLORS[0] },
    { name: 'No publicados', value: totalVehicles - publishedVehicles, color: COLORS[1] },
  ].filter((d) => d.value > 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Resumen del panel de administración</p>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          index={0}
          title="Vehículos activos"
          value={publishedVehicles}
          subtitle={`${totalVehicles} totales`}
          icon={Car}
          trend={{ value: `${publishedVehicles} publicados`, positive: true }}
        />
        <StatCard
          index={1}
          title="Vehículos destacados"
          value={featuredCount}
          subtitle="Esta semana"
          icon={Star}
        />
        <StatCard
          index={2}
          title="Vistas totales"
          value={formatNumber(viewsLast30)}
          subtitle="Últimos 30 días"
          icon={Eye}
        />
        <StatCard
          index={3}
          title="Precio promedio"
          value={formatPrice(avgPrice)}
          icon={DollarSign}
        />
      </div>

      {/* Alertas - Próximos a vencer */}
      {expiringVehicles.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="overflow-hidden border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <AlertTriangle className="h-5 w-5 text-status-warning" />
                Vehículos próximos a vencer
              </CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin/vehiculos">Ver todos</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-muted-foreground">
                      <th className="pb-2 pr-4">Vehículo</th>
                      <th className="pb-2 pr-4">Días restantes</th>
                      <th className="pb-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {expiringVehicles.map((v) => (
                      <tr key={v.id} className="border-b last:border-0">
                        <td className="py-3 pr-4">
                          <div className="flex items-center gap-3">
                            {v.image ? (
                              <img
                                src={v.image}
                                alt=""
                                className="h-12 w-16 rounded object-cover"
                              />
                            ) : (
                              <div className="h-12 w-16 rounded bg-muted" />
                            )}
                            <span className="font-medium">{v.title}</span>
                          </div>
                        </td>
                        <td className="py-3 pr-4">
                          <Badge
                            variant={
                              v.daysRemaining < 0
                                ? 'error'
                                : v.daysRemaining <= 3
                                  ? 'error'
                                  : 'warning'
                            }
                          >
                            {v.daysRemaining < 0
                              ? 'Vencido'
                              : `${v.daysRemaining} días`}
                          </Badge>
                        </td>
                        <td className="py-3">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/admin/vehiculos/${v.id}`}>Renovar</Link>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Gráficos */}
      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          whileHover={{ scale: 1.01 }}
        >
          <Card className="overflow-hidden shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <TrendingUp className="h-5 w-5" />
                Vistas últimos 30 días
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={viewsByDay}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{ borderRadius: 8 }}
                      formatter={(value: number | undefined) => [value ?? 0, 'Vistas']}
                    />
                    <Line
                      type="monotone"
                      dataKey="vistas"
                      stroke="#3B82F6"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.01 }}
        >
          <Card className="overflow-hidden shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Estado de publicaciones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                {typeData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={typeData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={2}
                        dataKey="value"
                        nameKey="name"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {typeData.map((_, i) => (
                          <Cell key={i} fill={typeData[i].color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number | undefined) => [value ?? 0, '']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground">
                    Sin datos
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Contactos rápido */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base">Contactos recibidos</CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/contactos">Ver contactos</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatNumber(totalContacts)}</p>
            <p className="text-sm text-muted-foreground">Total de mensajes</p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
