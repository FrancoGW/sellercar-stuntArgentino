import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-xl border-2 border-gray-600/50 bg-black/50 px-3 py-2 text-sm text-white placeholder:text-gray-400 ring-offset-black transition-all duration-300',
          'hover:border-gray-500 focus-visible:outline-none focus-visible:border-[#B59F02] focus-visible:ring-2 focus-visible:ring-[#B59F02]/20 focus-visible:ring-offset-2 focus-visible:ring-offset-black',
          'disabled:cursor-not-allowed disabled:opacity-50 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-white',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
