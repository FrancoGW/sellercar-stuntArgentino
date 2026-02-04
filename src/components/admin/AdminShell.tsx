'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { signOut } from 'next-auth/react';
import {
  LayoutDashboard,
  Car,
  PlusCircle,
  BarChart3,
  Mail,
  Settings,
  Menu,
  ExternalLink,
  LogOut,
  ChevronLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

const SIDEBAR_WIDTH_EXPANDED = 280;
const SIDEBAR_WIDTH_COLLAPSED = 80;

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/vehiculos', label: 'Vehículos', icon: Car },
  { href: '/admin/vehiculos/nuevo', label: 'Nuevo Vehículo', icon: PlusCircle },
  { href: '/admin/estadisticas', label: 'Estadísticas', icon: BarChart3 },
  { href: '/admin/contactos', label: 'Contactos', icon: Mail },
  { href: '/admin/configuracion', label: 'Configuración', icon: Settings },
];

const breadcrumbLabels: Record<string, string> = {
  dashboard: 'Dashboard',
  vehiculos: 'Vehículos',
  nuevo: 'Nuevo Vehículo',
  estadisticas: 'Estadísticas',
  contactos: 'Contactos',
  configuracion: 'Configuración',
};

function getBreadcrumbs(pathname: string): { label: string; href: string }[] {
  if (pathname === '/admin/dashboard') return [{ label: 'Dashboard', href: '/admin/dashboard' }];
  const segments = pathname.replace('/admin/', '').split('/').filter(Boolean);
  const crumbs: { label: string; href: string }[] = [{ label: 'Panel', href: '/admin/dashboard' }];
  let acc = '/admin';
  for (const seg of segments) {
    acc += `/${seg}`;
    crumbs.push({ label: breadcrumbLabels[seg] ?? seg, href: acc });
  }
  return crumbs;
}

export function AdminShell({
  children,
  user,
}: {
  children: React.ReactNode;
  user: { name?: string | null; email?: string | null; image?: string | null };
}) {
  const pathname = usePathname();
  const isLogin = pathname === '/admin/login';

  if (isLogin) {
    return <>{children}</>;
  }

  return (
    <AdminShellWithSidebar user={user} pathname={pathname}>
      {children}
    </AdminShellWithSidebar>
  );
}

function AdminShellWithSidebar({
  children,
  user,
  pathname,
}: {
  children: React.ReactNode;
  user: { name?: string | null; email?: string | null; image?: string | null };
  pathname: string;
}) {
  const [collapsed, setCollapsed] = React.useState(false);
  const breadcrumbs = getBreadcrumbs(pathname);

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH_EXPANDED }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-[#E2E8F0] bg-[#0F172A] text-white"
      >
        <div className="flex h-14 items-center border-b border-white/10 px-3">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10"
            onClick={() => setCollapsed((c) => !c)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="ml-2 truncate font-semibold"
              >
                SellerCar Admin
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href}>
                <motion.div
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    isActive ? 'bg-[#3B82F6] text-white' : 'text-white/80 hover:bg-white/10 hover:text-white'
                  )}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  <AnimatePresence mode="wait">
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="truncate"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-white/10 p-2">
          <div className={cn('flex items-center gap-3 rounded-lg px-3 py-2', collapsed && 'justify-center')}>
            <Avatar className="h-9 w-9 shrink-0">
              <AvatarImage src={user.image ?? undefined} />
              <AvatarFallback className="bg-[#3B82F6] text-sm text-white">
                {(user.name ?? user.email ?? 'A').slice(0, 1).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="min-w-0 flex-1"
              >
                <p className="truncate text-sm font-medium text-white">
                  {user.name ?? user.email ?? 'Admin'}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 text-xs text-white/70 hover:text-white"
                  onClick={() => signOut({ callbackUrl: '/admin/login' })}
                >
                  Cerrar sesión
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </motion.aside>

      <div
        className="flex flex-1 flex-col transition-[margin]"
        style={{ marginLeft: collapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH_EXPANDED }}
      >
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-[#E2E8F0] bg-white px-6 shadow-sm">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            {breadcrumbs.map((crumb, i) => (
              <span key={crumb.href} className="flex items-center gap-2">
                {i > 0 && <ChevronLeft className="h-4 w-4 rotate-180" />}
                <Link
                  href={crumb.href}
                  className={i === breadcrumbs.length - 1 ? 'font-medium text-foreground' : 'hover:text-foreground'}
                >
                  {crumb.label}
                </Link>
              </span>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <a href="/" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                Ver sitio
              </a>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.image ?? undefined} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      {(user.name ?? user.email ?? 'A').slice(0, 1).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{user.name ?? 'Admin'}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <a href="/" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Ver sitio
                  </a>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut({ callbackUrl: '/admin/login' })}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="flex-1 p-6">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
