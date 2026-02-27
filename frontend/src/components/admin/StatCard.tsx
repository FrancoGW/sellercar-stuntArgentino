'use client';

import { motion } from 'motion/react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  index?: number;
  trend?: { value: string; positive?: boolean };
  className?: string;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  index = 0,
  trend,
  className,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ scale: 1.02 }}
      className={cn(className)}
    >
      <Card className="h-full overflow-hidden rounded-2xl sm:rounded-3xl border border-[#B59F02]/20 sm:border-[#B59F02]/30 bg-black/40 shadow-lg shadow-[#B59F02]/10 transition-shadow hover:shadow-[#B59F02]/20">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-gray-400">{title}</p>
              <p className="mt-2 text-xl sm:text-2xl font-bold tracking-tight text-white">{value}</p>
              {subtitle && (
                <p className="mt-1 text-xs text-gray-500">{subtitle}</p>
              )}
              {trend && (
                <p
                  className={cn(
                    'mt-1 text-xs font-medium',
                    trend.positive === false ? 'text-red-400' : 'text-green-400'
                  )}
                >
                  {trend.value}
                </p>
              )}
            </div>
            {Icon && (
              <div className="rounded-lg border border-[#B59F02]/40 bg-[#B59F02]/20 p-2">
                <Icon className="h-5 w-5 text-[#B59F02]" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
