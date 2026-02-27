import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { AnalyticsTracker } from '@/components/AnalyticsTracker';

import HomePage from '@/pages/HomePage';
import VehicleDetailPage from '@/pages/VehicleDetailPage';
import PublicarVehiculoPage from '@/pages/PublicarVehiculoPage';
import PanelLoginPage from '@/pages/panel/PanelLoginPage';
import PanelLayout from '@/pages/panel/PanelLayout';
import DashboardPage from '@/pages/panel/DashboardPage';
import VehiculosPage from '@/pages/panel/VehiculosPage';
import VehiculoNuevoPage from '@/pages/panel/VehiculoNuevoPage';
import VehiculoEditarPage from '@/pages/panel/VehiculoEditarPage';
import EstadisticasPage from '@/pages/panel/EstadisticasPage';
import ContactosPage from '@/pages/panel/ContactosPage';
import ConfiguracionPage from '@/pages/panel/ConfiguracionPage';

function ProtectedPanel({ children }: { children: React.ReactNode }) {
  const { user, token, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#B59F02] border-t-transparent" />
      </div>
    );
  }
  if (!token || !user || user.role !== 'admin') {
    return <Navigate to="/panel/login" replace />;
  }
  return <>{children}</>;
}

export default function App() {
  return (
    <>
      <AnalyticsTracker />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/publicar-vehiculo" element={<PublicarVehiculoPage />} />
        <Route path="/vehiculos/:id" element={<VehicleDetailPage />} />
        <Route path="/panel/login" element={<PanelLoginPage />} />
        <Route
          path="/panel"
          element={
            <ProtectedPanel>
              <PanelLayout />
            </ProtectedPanel>
          }
        >
          <Route index element={<Navigate to="/panel/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="vehiculos" element={<VehiculosPage />} />
          <Route path="vehiculos/nuevo" element={<VehiculoNuevoPage />} />
          <Route path="vehiculos/:id" element={<VehiculoEditarPage />} />
          <Route path="estadisticas" element={<EstadisticasPage />} />
          <Route path="contactos" element={<ContactosPage />} />
          <Route path="configuracion" element={<ConfiguracionPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster richColors position="top-center" />
    </>
  );
}
