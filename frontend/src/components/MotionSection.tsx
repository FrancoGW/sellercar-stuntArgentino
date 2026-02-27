'use client';

import { motion } from 'motion/react';

interface MotionSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  id?: string;
}

/** Sección con entrada suave para la home y páginas públicas */
export function MotionSection({ children, className, delay = 0, id }: MotionSectionProps) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.section>
  );
}
