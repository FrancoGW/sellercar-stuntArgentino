'use client';

import { motion } from 'motion/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export function ConfigClient() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Configuración</h1>
        <p className="text-muted-foreground">Ajustes del sitio y del panel</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Tabs defaultValue="general" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="marcas">Marcas</TabsTrigger>
            <TabsTrigger value="usuarios">Usuarios</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>General</CardTitle>
                <CardDescription>Nombre del sitio y apariencia</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Nombre del sitio</Label>
                  <Input id="siteName" defaultValue="SellerCar Stunt Argentino" />
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
                  <Input id="metaTitle" placeholder="SellerCar - Venta de vehículos" />
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
