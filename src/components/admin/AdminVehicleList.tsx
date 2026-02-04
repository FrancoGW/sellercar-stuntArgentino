'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';

interface Vehicle {
  _id: string;
  title: string;
  price: number;
  currency: string;
  brand: string;
  model: string;
  year: number;
  published: boolean;
  featured: boolean;
  images: string[];
}

export function AdminVehicleList() {
  const [items, setItems] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchList = async (p: number) => {
    setLoading(true);
    const res = await fetch(`/api/admin/vehicles?page=${p}&limit=12`);
    if (!res.ok) return;
    const data = await res.json();
    setItems(data.items);
    setTotalPages(data.totalPages);
    setLoading(false);
  };

  useEffect(() => {
    fetchList(page);
  }, [page]);

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este vehículo?')) return;
    const res = await fetch(`/api/admin/vehicles/${id}`, { method: 'DELETE' });
    if (res.ok) fetchList(page);
  };

  if (loading && items.length === 0) {
    return <div className="text-muted-foreground">Cargando...</div>;
  }

  if (!items.length) {
    return <p className="text-muted-foreground">No hay vehículos. Creá uno desde &quot;Nuevo vehículo&quot;.</p>;
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left p-3">Imagen</th>
              <th className="text-left p-3">Vehículo</th>
              <th className="text-left p-3">Precio</th>
              <th className="text-left p-3">Estado</th>
              <th className="text-right p-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items.map((v) => (
              <tr key={v._id} className="border-b">
                <td className="p-3">
                  <div className="relative w-16 h-12 rounded overflow-hidden bg-muted">
                    {v.images?.[0] ? (
                      <Image
                        src={v.images[0]}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    ) : (
                      <span className="text-xs text-muted-foreground">Sin img</span>
                    )}
                  </div>
                </td>
                <td className="p-3">
                  {v.brand} {v.model} ({v.year})
                </td>
                <td className="p-3 font-medium">{formatPrice(v.price, v.currency)}</td>
                <td className="p-3">
                  <span className={v.published ? 'text-status-ok' : 'text-muted-foreground'}>
                    {v.published ? 'Publicado' : 'Borrador'}
                  </span>
                  {v.featured && ' · Destacado'}
                </td>
                <td className="p-3 text-right">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/admin/vehiculos/${v._id}`}>Editar</Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive"
                    onClick={() => handleDelete(v._id)}
                  >
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button variant="outline" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            Anterior
          </Button>
          <span className="flex items-center px-4 text-muted-foreground">
            {page} / {totalPages}
          </span>
          <Button variant="outline" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
            Siguiente
          </Button>
        </div>
      )}
    </div>
  );
}
