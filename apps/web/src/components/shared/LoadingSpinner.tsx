import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { fadeIn, defaultTransition } from '@/lib/animations';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizes = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
};

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  return <Loader2 className={cn('animate-spin text-brand', sizes[size], className)} />;
}

interface LoadingPageProps {
  message?: string;
}

export function LoadingPage({ message = 'Loading...' }: LoadingPageProps) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center py-12"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      transition={defaultTransition}
    >
      <LoadingSpinner size="lg" />
      <p className="mt-4 text-sm text-text-secondary">{message}</p>
    </motion.div>
  );
}
