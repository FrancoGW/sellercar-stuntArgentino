import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { apiFetch } from '@/lib/api';

export function AnalyticsTracker() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (!pathname) return;
    apiFetch('/analytics', {
      method: 'POST',
      body: JSON.stringify({ name: 'page_view', path: pathname }),
    }).catch(() => {});
  }, [pathname]);

  return null;
}
