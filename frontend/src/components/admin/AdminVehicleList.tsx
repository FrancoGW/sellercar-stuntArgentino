import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { VehicleTable, type AdminVehicleRow } from '@/components/admin/VehicleTable';

const PAGE_SIZE = 12;

export function AdminVehicleList() {
  const { token } = useAuth();
  const [items, setItems] = useState<AdminVehicleRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const [totalPages, setTotalPages] = useState(1);

  const fetchList = async (p: number, limit: number = pageSize) => {
    setLoading(true);
    const res = await apiFetch(`/admin/vehicles?page=${p}&limit=${limit}`, { token: token ?? undefined });
    if (!res.ok) {
      setLoading(false);
      return;
    }
    const data = await res.json();
    setItems(data.items ?? []);
    setTotalPages(data.totalPages ?? 1);
    setLoading(false);
  };

  useEffect(() => {
    fetchList(page, pageSize);
  }, [page, pageSize, token]);

  const handleDelete = async (id: string) => {
    const res = await apiFetch(`/admin/vehicles/${id}`, { method: 'DELETE', token: token ?? undefined });
    if (res.ok) fetchList(page, pageSize);
  };

  return (
    <VehicleTable
      data={items}
      loading={loading}
      onDelete={handleDelete}
      pageCount={totalPages}
      page={page}
      pageSize={pageSize}
      onPageChange={setPage}
      onPageSizeChange={(size) => { setPageSize(size); setPage(1); }}
    />
  );
}
