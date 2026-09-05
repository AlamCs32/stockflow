import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'secondary' | 'outline' | 'destructive' | 'success' | 'warning';
  className?: string;
}

const variants = {
  default: 'bg-brand text-white hover:bg-brand-hover',
  secondary: 'bg-neutral-bg4 text-text-secondary hover:bg-neutral-bg5',
  outline: 'text-text-primary border border-border-default',
  destructive: 'bg-status-error/15 text-status-error border border-status-error/20',
  success: 'bg-status-success/15 text-status-success border border-status-success/20',
  warning: 'bg-status-warning/15 text-status-warning border border-status-warning/20',
};

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
