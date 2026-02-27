'use client';

import { motion } from 'motion/react';

interface MotionCardProps {
  children: React.ReactNode;
  className?: string;
  index?: number;
}

/** Tarjeta con entrada suave (útil para dashboards y listas) */
export function MotionCard({ children, className, index = 0 }: MotionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.08, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
