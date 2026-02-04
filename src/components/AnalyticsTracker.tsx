'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Envía page_view al API de analytics en cada cambio de ruta.
 * Incluir en layout para tracking básico.
 */
export function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'page_view',
        path: pathname,
      }),
    }).catch(() => {});
  }, [pathname]);

  return null;
}
