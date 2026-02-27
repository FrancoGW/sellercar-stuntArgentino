'use client';

import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: { label: string; href?: string; onClick?: () => void };
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#B59F02]/30 bg-black/40 py-16 px-6 text-center',
        className
      )}
    >
      {Icon && (
        <div className="rounded-full border border-[#B59F02]/40 bg-[#B59F02]/20 p-4 mb-4">
          <Icon className="h-10 w-10 text-[#B59F02]" />
        </div>
      )}
      <h3 className="text-lg font-bold uppercase tracking-wide text-[#F4E17F]">{title}</h3>
      {description && <p className="mt-2 text-sm text-gray-400 max-w-sm">{description}</p>}
      {action && (
        <div className="mt-6">
          {action.href ? (
            <Button asChild>
              <a href={action.href}>{action.label}</a>
            </Button>
          ) : (
            <Button onClick={action.onClick}>{action.label}</Button>
          )}
        </div>
      )}
    </motion.div>
  );
}
