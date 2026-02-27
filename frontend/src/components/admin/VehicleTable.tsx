'use client';

import * as React from 'react';
import { Link } from 'react-router-dom';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  type ColumnDef,
  type SortingState,
  flexRender,
} from '@tanstack/react-table';
import { MoreHorizontal, Pencil, Trash2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatPrice, getDaysRemaining } from '@/lib/utils';
import { getPlanById } from '@/lib/plans';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { TableSkeleton } from '@/components/admin/LoadingSkeleton';
import { EmptyState } from '@/components/admin/EmptyState';
import { Car } from 'lucide-react';

export interface AdminVehicleRow {
  _id: string;
  title: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  currency: string;
  published: boolean;
  featured: boolean;
  images: string[];
  patentExpiresAt?: string | Date | null;
  vtvExpiresAt?: string | Date | null;
  plan?: string | null;
  planExpiresAt?: string | Date | null;
  addonDestacado24hUntil?: string | Date | null;
  addonPrioritario7dUntil?: string | Date | null;
}

function isAddonActive(until: string | Date | null | undefined): boolean {
  if (!until) return false;
  const d = new Date(until);
  return !isNaN(d.getTime()) && d >= new Date();
}

function PublicationStatusBadge({ vehicle }: { vehicle: AdminVehicleRow }) {
  const expiresAt = vehicle.patentExpiresAt ?? vehicle.vtvExpiresAt;
  const days = getDaysRemaining(expiresAt ?? null);
  if (!vehicle.published) {
    return <Badge variant="secondary">Borrador</Badge>;
  }
  if (days === null) return <Badge variant="success">Activo</Badge>;
  if (days < 0) return <Badge variant="error">Vencido</Badge>;
  if (days <= 7) return <Badge variant="warning">Por vencer ({days}d)</Badge>;
  return <Badge variant="success">Activo ({days}d)</Badge>;
}

interface VehicleTableProps {
  data: AdminVehicleRow[];
  loading?: boolean;
  onDelete: (id: string) => Promise<void>;
  pageCount: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export function VehicleTable({
  data,
  loading,
  onDelete,
  pageCount,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: VehicleTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const [deleting, setDeleting] = React.useState(false);

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setDeleting(true);
    await onDelete(deleteId);
    setDeleting(false);
    setDeleteId(null);
  };

  const columns: ColumnDef<AdminVehicleRow>[] = [
    {
      accessorKey: 'images',
      header: 'Imagen',
      cell: ({ row }) => (
        <div className="relative h-[60px] w-[60px] rounded-md overflow-hidden bg-muted shrink-0">
          {row.original.images?.[0] ? (
            <img
              src={row.original.images[0]}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-xs text-muted-foreground flex items-center justify-center h-full">Sin img</span>
          )}
        </div>
      ),
    },
    {
      id: 'vehicle',
      header: 'Vehículo',
      accessorFn: (r) => `${r.brand} ${r.model}`,
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{row.original.brand} {row.original.model}</p>
          <p className="text-xs text-muted-foreground">{row.original.year}</p>
        </div>
      ),
    },
    { accessorKey: 'year', header: 'Año' },
    {
      accessorKey: 'price',
      header: 'Precio',
      cell: ({ row }) => formatPrice(row.original.price, row.original.currency),
    },
    {
      id: 'status',
      header: 'Estado publicación',
      cell: ({ row }) => <PublicationStatusBadge vehicle={row.original} />,
    },
    {
      id: 'plan',
      header: 'Plan',
      cell: ({ row }) => {
        const plan = getPlanById(row.original.plan);
        return (
          <span className="text-gray-200">
            {plan ? plan.name : '—'}
          </span>
        );
      },
    },
    {
      id: 'dias',
      header: 'Días',
      cell: ({ row }) => {
        const days = getDaysRemaining(row.original.planExpiresAt ?? null);
        if (row.original.plan == null || row.original.plan === 'ninguno') return <span className="text-muted-foreground">—</span>;
        if (days === null) return <span className="text-muted-foreground">—</span>;
        if (days < 0) return <span className="text-red-400 font-medium">Vencido</span>;
        return <span className="text-gray-200">{days} días</span>;
      },
    },
    {
      id: 'extras',
      header: 'Planes extra',
      cell: ({ row }) => {
        const d24 = isAddonActive(row.original.addonDestacado24hUntil);
        const p7 = isAddonActive(row.original.addonPrioritario7dUntil);
        if (!d24 && !p7) return <span className="text-muted-foreground">—</span>;
        return (
          <div className="flex flex-wrap gap-1">
            {d24 && (
              <span className="rounded-full border border-[#B59F02]/50 bg-[#B59F02]/20 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-[#F4E17F]">
                Destacado 24hs
              </span>
            )}
            {p7 && (
              <span className="rounded-full border border-[#B59F02]/50 bg-[#B59F02]/20 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-[#F4E17F]">
                Prioritario 7d
              </span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'featured',
      header: 'Destacado',
      cell: ({ row }) =>
        row.original.featured ? (
          <span className="text-amber-500">⭐ Destacado</span>
        ) : (
          <span className="text-muted-foreground">—</span>
        ),
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link to={`/panel/vehiculos/${row.original._id}`}>
                <Pencil className="mr-2 h-4 w-4" />
                Editar
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a href={`/vehiculos/${row.original._id}`} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                Ver en sitio
              </a>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => setDeleteId(row.original._id)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    pageCount,
  });

  if (loading && data.length === 0) {
    return <TableSkeleton rows={10} cols={7} />;
  }

  if (!loading && data.length === 0) {
    return (
      <EmptyState
        icon={Car}
        title="No hay vehículos"
        description="Creá tu primera publicación desde Nuevo Vehículo."
        action={{ label: 'Nuevo vehículo', href: '/panel/vehiculos/nuevo' }}
      />
    );
  }

  return (
    <>
      <div className="rounded-md border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>{header.isPlaceholder ? null : header.column.columnDef.header as React.ReactNode}</TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} className="hover:bg-muted/50">
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 py-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Filas por página</span>
          <select
            className="h-9 rounded-md border bg-background px-2 text-sm"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
          >
            {[10, 25, 50, 100].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
          >
            Anterior
          </Button>
          <span className="text-sm text-muted-foreground px-2">
            Página {page} de {pageCount || 1}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= pageCount}
          >
            Siguiente
          </Button>
        </div>
      </div>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Eliminar vehículo"
        description="Esta acción no se puede deshacer."
        confirmLabel="Eliminar"
        variant="destructive"
        onConfirm={handleDeleteConfirm}
        loading={deleting}
      />
    </>
  );
}
