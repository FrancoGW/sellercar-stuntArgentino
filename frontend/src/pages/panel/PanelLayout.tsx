import { Outlet } from 'react-router-dom';
import { AdminShell } from '@/components/admin/AdminShell';

export default function PanelLayout() {
  return (
    <AdminShell>
      <Outlet />
    </AdminShell>
  );
}
