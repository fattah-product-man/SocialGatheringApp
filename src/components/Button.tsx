import React from 'react';
import { cn } from '../lib/constants';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const variants = {
      primary: 'bg-[#58CC02] text-white border-b-4 border-[#46A302] active:border-b-0 active:translate-y-1 hover:bg-[#61E002]',
      secondary: 'bg-white text-stone-700 border-2 border-stone-200 border-b-4 active:border-b-2 active:translate-y-[2px] hover:bg-stone-50',
      outline: 'bg-transparent border-2 border-stone-200 text-stone-500 hover:bg-stone-50',
      ghost: 'text-stone-500 hover:bg-stone-100/50',
    };

    const sizes = {
      sm: 'px-4 py-2 text-sm font-bold',
      md: 'px-6 py-3 text-base font-bold',
      lg: 'px-8 py-4 text-lg font-bold',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-2xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 disabled:opacity-50 disabled:pointer-events-none uppercase tracking-wide',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
