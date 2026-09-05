import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { fadeIn, defaultTransition } from '@/lib/animations';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <motion.div
      className={cn('glass-card flex flex-col items-center justify-center py-12 px-6', className)}
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      transition={defaultTransition}
    >
      {icon && <div className="mb-4 text-text-muted">{icon}</div>}
      <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
      {description && <p className="mt-1 text-sm text-text-secondary">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </motion.div>
  );
}
