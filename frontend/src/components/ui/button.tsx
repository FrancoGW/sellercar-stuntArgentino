import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold uppercase tracking-wide ring-offset-black transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B59F02] focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-[#B59F02] text-black border-2 border-[#B59F02]/20 hover:bg-[#e4c63d] hover:shadow-2xl hover:shadow-[#B59F02]/30 transform hover:-translate-y-1',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:
          'border border-[#B59F02] bg-[#B59F02]/20 text-[#F4E17F] hover:bg-[#B59F02]/30 hover:border-[#B59F02]/60',
        secondary: 'bg-[#B59F02]/20 text-[#F4E17F] border border-[#B59F02]/40 hover:bg-[#B59F02]/30',
        ghost: 'text-gray-200 hover:bg-[#B59F02]/10 hover:text-[#F4E17F]',
        link: 'text-[#B59F02] underline-offset-4 hover:underline',
        cta:
          'bg-[#B59F02] text-black font-bold border-2 border-[#B59F02]/20 hover:shadow-2xl hover:shadow-[#B59F02]/30 transform hover:-translate-y-1',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-lg px-3',
        lg: 'h-11 rounded-xl px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
