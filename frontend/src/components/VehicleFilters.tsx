'use client';

import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const BRANDS = ['Volkswagen', 'Ford', 'Chevrolet', 'Fiat', 'Toyota', 'Honda', 'Renault', 'Peugeot', 'Otro'];

export function VehicleFilters() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [open, setOpen] = useState(false);

  const minPrice = searchParams.get('minPrice') ?? '';
  const maxPrice = searchParams.get('maxPrice') ?? '';
  const brand = searchParams.get('brand') ?? '';
  const minYear = searchParams.get('minYear') ?? '';
  const maxYear = searchParams.get('maxYear') ?? '';

  const apply = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([k, v]) => {
      if (v) params.set(k, v);
      else params.delete(k);
    });
    params.set('page', '1');
    navigate(`/?${params.toString()}`);
  };

  const handleBrand = (v: string) => {
    apply({ brand: v });
  };

  const handlePrice = (type: 'min' | 'max', value: string) => {
    if (type === 'min') apply({ minPrice: value });
    else apply({ maxPrice: value });
  };

  const handleYear = (type: 'min' | 'max', value: string) => {
    if (type === 'min') apply({ minYear: value });
    else apply({ maxYear: value });
  };

  const clearFilters = () => {
    navigate('/');
  };

  const filterContent = (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5 lg:flex lg:flex-wrap lg:items-end">
      <div className="space-y-2">
        <Label>Marca</Label>
        <Select value={brand || 'all'} onValueChange={(v) => handleBrand(v === 'all' ? '' : v)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Todas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            {BRANDS.map((b) => (
              <SelectItem key={b} value={b}>
                {b}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Precio mín.</Label>
        <Input
          type="number"
          placeholder="0"
          value={minPrice}
          onChange={(e) => handlePrice('min', e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label>Precio máx.</Label>
        <Input
          type="number"
          placeholder="Sin tope"
          value={maxPrice}
          onChange={(e) => handlePrice('max', e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label>Año desde</Label>
        <Input
          type="number"
          placeholder="Ej. 2015"
          value={minYear}
          onChange={(e) => handleYear('min', e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label>Año hasta</Label>
        <Input
          type="number"
          placeholder="Ej. 2024"
          value={maxYear}
          onChange={(e) => handleYear('max', e.target.value)}
        />
      </div>
      <Button variant="outline" onClick={clearFilters}>
        Limpiar
      </Button>
    </div>
  );

  return (
    <>
      <div className="hidden lg:block rounded-2xl border border-[#B59F02]/30 bg-black/40 p-4 shadow-lg shadow-[#B59F02]/10">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[#B59F02] mb-3">Filtros</h2>
        {filterContent}
      </div>

      <div className="lg:hidden">
        <Accordion
          type="single"
          collapsible
          value={open ? 'filters' : ''}
          onValueChange={(v) => setOpen(v === 'filters')}
        >
          <AccordionItem
            value="filters"
            className="rounded-xl border border-[#B59F02]/30 px-4 bg-black/40"
          >
            <AccordionTrigger className="hover:no-underline text-gray-200">
              <span className="font-semibold uppercase tracking-wide">Filtros</span>
            </AccordionTrigger>
            <AccordionContent>{filterContent}</AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </>
  );
}
