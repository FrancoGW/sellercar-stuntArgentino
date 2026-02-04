import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AdminSignOut } from '@/components/AdminSignOut';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  // La ruta /admin (y /admin/login) no debe redirigir; el middleware protege /admin/* menos login
  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      {session && (session.user as { role?: string })?.role === 'admin' && (
        <header className="border-b bg-card">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <nav className="flex gap-4">
              <Link href="/admin">
                <Button variant="ghost">Dashboard</Button>
              </Link>
              <Link href="/admin/vehiculos">
                <Button variant="ghost">Vehículos</Button>
              </Link>
              <Link href="/admin/contactos">
                <Button variant="ghost">Contactos</Button>
              </Link>
              <Link href="/">
                <Button variant="outline">Ver sitio</Button>
              </Link>
            </nav>
            <AdminSignOut />
          </div>
        </header>
      )}
      <main className="flex-1 container mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
