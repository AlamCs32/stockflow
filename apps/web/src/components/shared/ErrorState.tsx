import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { fadeIn, defaultTransition } from '@/lib/animations';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = 'Something went wrong',
  message,
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <motion.div
      className={cn('glass-card flex flex-col items-center justify-center py-12 px-6', className)}
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      transition={defaultTransition}
    >
      <AlertCircle className="mb-4 h-12 w-12 text-status-error" />
      <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
      {message && <p className="mt-1 text-sm text-text-secondary">{message}</p>}
      {onRetry && (
        <Button variant="outline" className="mt-4" onClick={onRetry}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Retry
        </Button>
      )}
    </motion.div>
  );
}
