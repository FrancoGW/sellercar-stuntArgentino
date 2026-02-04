'use client';

import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';

export function AdminSignOut() {
  return (
    <Button variant="ghost" onClick={() => signOut({ callbackUrl: '/admin/login' })}>
      Cerrar sesión
    </Button>
  );
}
