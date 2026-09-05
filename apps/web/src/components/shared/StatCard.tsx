import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { scaleOnHover, defaultTransition } from '@/lib/animations';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  className?: string;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  change,
  changeType = 'neutral',
  className,
}: StatCardProps) {
  return (
    <motion.div
      className={cn('glass-card p-6', className)}
      {...scaleOnHover}
      transition={defaultTransition}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-text-secondary">{title}</p>
        <Icon className="h-4 w-4 text-text-muted" />
      </div>
      <div className="mt-2">
        <p className="text-2xl font-bold text-text-primary">{value}</p>
        {change && (
          <p
            className={cn(
              'text-xs mt-1',
              changeType === 'positive' && 'text-status-success',
              changeType === 'negative' && 'text-status-error',
              changeType === 'neutral' && 'text-text-muted'
            )}
          >
            {change}
          </p>
        )}
      </div>
    </motion.div>
  );
}
