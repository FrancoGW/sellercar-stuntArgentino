'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { apiFetch } from '@/lib/api';

export function ConfigClient() {
  const { token } = useAuth();
  const [heroImages, setHeroImages] = useState<string[]>(['/hero-slider.png']);
  const [heroInput, setHeroInput] = useState('');
  const [heroSaving, setHeroSaving] = useState(false);
  const [heroLoading, setHeroLoading] = useState(true);

  useEffect(() => {
    apiFetch('/admin/config/hero', { token: token ?? undefined })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.images?.length) setHeroImages(data.images);
        if (data?.images?.[0]) setHeroInput(data.images[0]);
      })
      .catch(() => {})
      .finally(() => setHeroLoading(false));
  }, [token]);

  const saveHero = async () => {
    const url = heroInput.trim() || '/hero-slider.png';
    setHeroSaving(true);
    try {
      const res = await apiFetch('/admin/config/hero', {
        method: 'PUT',
        body: JSON.stringify({ images: [url] }),
        token: token ?? undefined,
      });
      if (!res.ok) throw new Error('Error al guardar');
      setHeroImages([url]);
      toast.success('Slider actualizado');
    } catch {
      toast.error('Error al guardar el slider');
    }
    setHeroSaving(false);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-bold tracking-tight sm:text-2xl">Configuración</h1>
        <p className="text-sm text-muted-foreground sm:text-base">Ajustes del sitio y del panel</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Tabs defaultValue="hero" className="space-y-4">
          <TabsList className="flex w-full overflow-x-auto rounded-lg bg-muted p-1 gap-1 sm:grid sm:grid-cols-6 sm:overflow-visible">
            <TabsTrigger value="hero" className="shrink-0 whitespace-nowrap">Hero / Slider</TabsTrigger>
            <TabsTrigger value="general" className="shrink-0 whitespace-nowrap">General</TabsTrigger>
            <TabsTrigger value="marcas" className="shrink-0 whitespace-nowrap">Marcas</TabsTrigger>
            <TabsTrigger value="usuarios" className="shrink-0 whitespace-nowrap">Usuarios</TabsTrigger>
            <TabsTrigger value="email" className="shrink-0 whitespace-nowrap">Email</TabsTrigger>
            <TabsTrigger value="seo" className="shrink-0 whitespace-nowrap">SEO</TabsTrigger>
          </TabsList>

          <TabsContent value="hero" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Hero / Slider principal</CardTitle>
                <CardDescription>
                  Imagen de fondo del banner en la home. Por defecto se usa una foto a ancho completo.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="heroImage">URL de la imagen</Label>
                  <Input
                    id="heroImage"
                    value={heroInput}
                    onChange={(e) => setHeroInput(e.target.value)}
                    placeholder="/hero-slider.png o https://..."
                  />
                  <p className="text-xs text-muted-foreground">
                    Ruta relativa (ej: /hero-slider.png) o URL completa. Si subís a Cloudinary, pegá la URL aquí.
                  </p>
                </div>
                {!heroLoading && heroImages[0] && (
                  <div className="rounded-lg overflow-hidden border bg-muted max-w-md">
                    <img src={heroImages[0]} alt="Vista previa" className="w-full h-32 object-cover" />
                  </div>
                )}
                <Button onClick={saveHero} disabled={heroSaving}>
                  {heroSaving ? 'Guardando...' : 'Guardar'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>General</CardTitle>
                <CardDescription>Nombre del sitio y apariencia</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Nombre del sitio</Label>
                  <Input id="siteName" defaultValue="StuntArgentino" />
                </div>
                <div className="space-y-2">
                  <Label>Logo</Label>
                  <p className="text-sm text-muted-foreground">Subir logo (próximamente)</p>
                </div>
                <Button>Guardar</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="marcas" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Marcas</CardTitle>
                <CardDescription>Lista de marcas disponibles para los vehículos</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Las marcas se obtienen de los vehículos existentes. Para agregar una nueva, creá un vehículo con esa marca.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="usuarios" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Usuarios administrador</CardTitle>
                <CardDescription>Gestionar accesos al panel</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Los usuarios se gestionan con el script seed-admin. No podés eliminar tu propio usuario.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="email" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Email</CardTitle>
                <CardDescription>SendGrid y notificaciones</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  La configuración de SendGrid está en las variables de entorno (.env). Email de respuesta automática según contacto.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="seo" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>SEO</CardTitle>
                <CardDescription>Meta tags y analytics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="metaTitle">Meta título por defecto</Label>
                  <Input id="metaTitle" placeholder="StuntArgentino - Venta de vehículos" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="metaDesc">Meta descripción</Label>
                  <Input id="metaDesc" placeholder="Descripción para buscadores" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gaId">Google Analytics ID</Label>
                  <Input id="gaId" placeholder="G-XXXXXXXXXX" />
                </div>
                <Button>Guardar</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
