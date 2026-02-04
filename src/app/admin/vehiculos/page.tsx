'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { PlusCircle, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { VehicleTable, type AdminVehicleRow } from '@/components/admin/VehicleTable';

const PAGE_SIZES = [10, 25, 50, 100];

export default function AdminVehiclesPage() {
  const [items, setItems] = useState<AdminVehicleRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [searchDebounced, setSearchDebounced] = useState('');

  useEffect(() => {
    const t = setTimeout(() => setSearchDebounced(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const fetchList = useCallback(async (p: number, limit: number) => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(p), limit: String(limit) });
    if (searchDebounced) params.set('brand', searchDebounced);
    const res = await fetch(`/api/admin/vehicles?${params}`);
    if (!res.ok) {
      setLoading(false);
      return;
    }
    const data = await res.json();
    setItems(data.items);
    setTotal(data.total);
    setLoading(false);
  }, [searchDebounced]);

  useEffect(() => {
    setPage(1);
  }, [searchDebounced, pageSize]);

  useEffect(() => {
    fetchList(page, pageSize);
  }, [page, pageSize, searchDebounced, fetchList]);

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setPage(1);
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/admin/vehicles/${id}`, { method: 'DELETE' });
    if (res.ok) await fetchList(page, pageSize);
  };

  const pageCount = Math.ceil(total / pageSize) || 1;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Gestión de Vehículos</h1>
        <Button asChild size="lg" className="shrink-0">
          <Link href="/admin/vehiculos/nuevo">
            <PlusCircle className="mr-2 h-5 w-5" />
            Nuevo Vehículo
          </Link>
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por marca..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <VehicleTable
        data={items}
        loading={loading}
        onDelete={handleDelete}
        pageCount={pageCount}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={handlePageSizeChange}
      />
    </div>
  );
}
