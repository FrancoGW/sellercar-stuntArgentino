import * as React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '@/context/AuthContext';
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
  User,
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

const PANEL = '/panel';

const navItems = [
  { href: `${PANEL}/dashboard`, label: 'Dashboard', icon: LayoutDashboard },
  { href: `${PANEL}/vehiculos`, label: 'Vehículos', icon: Car },
  { href: `${PANEL}/vehiculos/nuevo`, label: 'Nuevo Vehículo', icon: PlusCircle },
  { href: `${PANEL}/estadisticas`, label: 'Estadísticas', icon: BarChart3 },
  { href: `${PANEL}/contactos`, label: 'Contactos', icon: Mail },
  { href: `${PANEL}/configuracion`, label: 'Configuración', icon: Settings },
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
  const base = pathname.startsWith(PANEL) ? PANEL : '/admin';
  const cleanPath = pathname.replace(new RegExp(`^${base}/?`), '') || 'dashboard';
  if (cleanPath === 'dashboard') return [{ label: 'Dashboard', href: `${base}/dashboard` }];
  const segments = cleanPath.split('/').filter(Boolean);
  const crumbs: { label: string; href: string }[] = [{ label: 'Panel', href: `${base}/dashboard` }];
  let acc = base;
  for (const seg of segments) {
    acc += `/${seg}`;
    crumbs.push({ label: breadcrumbLabels[seg] ?? seg, href: acc });
  }
  return crumbs;
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const isLogin = pathname === `${PANEL}/login`;

  if (isLogin) {
    return <>{children}</>;
  }

  const userInfo = { name: user?.name ?? null, email: user?.email ?? null, image: null };
  return (
    <AdminShellWithSidebar user={userInfo} pathname={pathname} onLogout={logout}>
      {children}
    </AdminShellWithSidebar>
  );
}

function AdminShellWithSidebar({
  children,
  user,
  pathname,
  onLogout,
}: {
  children: React.ReactNode;
  user: { name?: string | null; email?: string | null; image?: string | null };
  pathname: string;
  onLogout: () => void;
}) {
  const [collapsed, setCollapsed] = React.useState(false);
  const breadcrumbs = getBreadcrumbs(pathname);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-black via-zinc-950 to-gray-900 text-white">
      {/* Sidebar – Stunt Argentino */}
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH_EXPANDED }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-[#B59F02]/30 bg-black/60 backdrop-blur"
      >
        <div className="relative flex h-14 items-center justify-center border-b border-[#B59F02]/20 px-2">
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-1 text-gray-300 hover:bg-[#B59F02]/10 hover:text-[#F4E17F]"
            onClick={() => setCollapsed((c) => !c)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <img src="/logo-stunt-final.png" alt="" className="h-9 w-auto shrink-0" />
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-2">
          {navItems.map((item) => {
            let isActive: boolean;
            if (item.href === `${PANEL}/vehiculos/nuevo`) {
              isActive = pathname === item.href;
            } else if (item.href === `${PANEL}/vehiculos`) {
              isActive = pathname === item.href || (pathname.startsWith(item.href + '/') && pathname !== `${PANEL}/vehiculos/nuevo`);
            } else {
              isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            }
            return (
              <Link key={item.href} to={item.href}>
                <motion.div
                  className={cn(
                    'flex items-center gap-3 rounded-xl sm:rounded-2xl border px-3 py-2.5 text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'border-[#B59F02]/50 bg-[#B59F02]/20 text-[#F4E17F]'
                      : 'border-transparent text-gray-300 hover:border-[#B59F02]/30 hover:bg-[#B59F02]/10 hover:text-[#f8e07a]'
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
        <div className="border-t border-[#B59F02]/20 p-2">
          <div className={cn('flex items-center gap-3 rounded-lg px-3 py-2', collapsed && 'justify-center')}>
            <Avatar className="h-9 w-9 shrink-0 border border-[#B59F02]/40">
              {user.image ? (
                <AvatarImage src={user.image} />
              ) : null}
              <AvatarFallback className="!bg-[#B59F02]/70 text-[#F4E17F] border border-[#B59F02]/50">
                {user.image ? (user.name ?? user.email ?? 'A').slice(0, 1).toUpperCase() : <User className="h-5 w-5" />}
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
                  className="h-auto p-0 text-xs text-gray-400 hover:text-[#F4E17F]"
                  onClick={onLogout}
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
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-[#B59F02]/30 bg-black/40 backdrop-blur px-6">
          <nav className="flex items-center gap-2 text-sm text-gray-400">
            {breadcrumbs.map((crumb, i) => (
              <span key={crumb.href} className="flex items-center gap-2">
                {i > 0 && <ChevronLeft className="h-4 w-4 rotate-180" />}
                <Link
                  to={crumb.href}
                  className={
                    i === breadcrumbs.length - 1
                      ? 'font-semibold text-[#B59F02]'
                      : 'hover:text-[#F4E17F]'
                  }
                >
                  {crumb.label}
                </Link>
              </span>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              asChild
              className="border-[#B59F02]/40 bg-[#B59F02]/10 text-[#F4E17F] hover:bg-[#B59F02]/20"
            >
              <a href="/" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                Ver sitio
              </a>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full border border-[#B59F02]/30 text-[#F4E17F] hover:bg-[#B59F02]/10"
                >
                  <Avatar className="h-8 w-8 border border-[#B59F02]/40">
                    {user.image ? (
                      <AvatarImage src={user.image} />
                    ) : null}
                    <AvatarFallback className="!bg-[#B59F02]/70 text-[#F4E17F] border border-[#B59F02]/50">
                      {user.image ? (user.name ?? user.email ?? 'A').slice(0, 1).toUpperCase() : <User className="h-4 w-4" />}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 border-[#B59F02]/30 bg-black/95 backdrop-blur"
              >
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium text-white">{user.name ?? 'Admin'}</p>
                  <p className="text-xs text-gray-400">{user.email}</p>
                </div>
                <DropdownMenuSeparator className="bg-[#B59F02]/20" />
                <DropdownMenuItem asChild className="text-gray-200 focus:bg-[#B59F02]/10 focus:text-[#F4E17F]">
                  <a href="/" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Ver sitio
                  </a>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-[#B59F02]/20" />
                <DropdownMenuItem
                  onClick={onLogout}
                  className="text-gray-200 focus:bg-[#B59F02]/10 focus:text-[#F4E17F]"
                >
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
