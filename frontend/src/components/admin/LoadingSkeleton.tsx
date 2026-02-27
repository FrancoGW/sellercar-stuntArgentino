'use client';

import { cn } from '@/lib/utils';

export function TableSkeleton({ rows = 5, cols = 6 }: { rows?: number; cols?: number }) {
  return (
    <div className="space-y-2">
      <div className="flex gap-4 border-b pb-2">
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className="h-4 w-24 animate-pulse rounded bg-[#B59F02]/20" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex gap-4 py-3">
          {Array.from({ length: cols }).map((_, c) => (
            <div
              key={c}
              className="h-4 animate-pulse rounded bg-[#B59F02]/20"
              style={{ width: c === 0 ? 64 : c === cols - 1 ? 120 : 80 + (c % 3) * 20 }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('rounded-2xl border border-[#B59F02]/30 bg-black/40 p-6 animate-pulse', className)}>
      <div className="h-4 w-1/3 rounded bg-[#B59F02]/20" />
      <div className="mt-4 h-8 w-20 rounded bg-[#B59F02]/20" />
    </div>
  );
}

export function StatCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('rounded-3xl border border-[#B59F02]/30 bg-black/40 p-6 animate-pulse', className)}>
      <div className="flex justify-between">
        <div className="space-y-2">
          <div className="h-4 w-24 rounded bg-[#B59F02]/20" />
          <div className="h-8 w-16 rounded bg-[#B59F02]/20" />
        </div>
        <div className="h-10 w-10 rounded-lg bg-[#B59F02]/20" />
      </div>
    </div>
  );
}
