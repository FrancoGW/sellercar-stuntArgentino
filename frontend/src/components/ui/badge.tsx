import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide transition-colors focus:outline-none focus:ring-2 focus:ring-[#B59F02]/20 focus:ring-offset-2 focus:ring-offset-black',
  {
    variants: {
      variant: {
        default:
          'border-[#B59F02]/40 bg-[#B59F02]/20 text-[#B59F02]',
        secondary:
          'border-[#B59F02]/50 bg-[#B59F02]/20 text-[#F4E17F]',
        destructive:
          'border-red-500/50 bg-red-500/10 text-red-300',
        outline:
          'border-[#B59F02]/40 text-[#B59F02]',
        success:
          'border-green-500/50 bg-green-500/10 text-green-400',
        warning:
          'border-amber-500/50 bg-amber-500/10 text-amber-300',
        error:
          'border-red-500/50 bg-red-500/10 text-red-400',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
