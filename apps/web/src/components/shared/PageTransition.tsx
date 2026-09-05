import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { slideUp, defaultTransition } from '@/lib/animations';

interface PageTransitionProps {
  children: ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={slideUp}
      transition={defaultTransition}
    >
      {children}
    </motion.div>
  );
}
