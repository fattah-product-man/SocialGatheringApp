import React from 'react';
import { cn } from '../lib/constants';

interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
}

export const Chip = React.forwardRef<HTMLButtonElement, ChipProps>(
  ({ className, selected, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        'px-3 py-1.5 rounded-full text-sm font-medium transition-all border',
        selected
          ? 'bg-emerald-100 text-emerald-800 border-emerald-200 shadow-sm'
          : 'bg-white text-gray-600 border-gray-200 hover:border-emerald-200 hover:bg-emerald-50',
        className
      )}
      {...props}
    />
  )
);
Chip.displayName = 'Chip';
