import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';

export default function PanelLoginPage() {
  const { login, user, token, loading: authLoading } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const callbackUrl = searchParams.get('callbackUrl') ?? '/panel/dashboard';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const isAdmin = !!token && user?.role === 'admin';

  useEffect(() => {
    if (isAdmin) {
      toast.success('Sesión iniciada. Redirigiendo al panel...');
      navigate(callbackUrl, { replace: true });
    }
  }, [isAdmin, callbackUrl, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await login(email, password);
      if (result.ok) {
        toast.success('Inicio de sesión correcto. Redirigiendo...');
        navigate(callbackUrl, { replace: true });
        return;
      }
      toast.error(result.error ?? 'Credenciales incorrectas.');
    } catch {
      toast.error('Error al iniciar sesión. Intentá de nuevo.');
    }
    setLoading(false);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-black">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#B59F02] border-t-transparent" />
          <p className="text-gray-400 text-sm">Cargando...</p>
        </div>
      </div>
    );
  }

  if (isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-black">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#B59F02] border-t-transparent" />
          <p className="text-gray-400 text-sm">Redirigiendo al panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 bg-black overflow-hidden">
      <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'url("/logo-stunt-final.png")', backgroundSize: '120px 120px', backgroundRepeat: 'repeat', backgroundAttachment: 'fixed' }} />
      <div className="absolute inset-0 bg-black/85" aria-hidden />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: 'easeOut' }} className="relative w-full max-w-md">
        <Card className="overflow-hidden rounded-2xl sm:rounded-3xl border-2 border-[#B59F02]/40 bg-gradient-to-br from-gray-800/95 to-gray-900/95 backdrop-blur-lg shadow-2xl shadow-[#B59F02]/10">
          <CardHeader className="relative flex flex-col items-center gap-4 pt-8">
            <img src="/logo-stunt-final.png" alt="Stunt Argentino" className="h-16 w-auto object-contain md:h-20" />
            <CardTitle className="text-xl font-bold uppercase tracking-wide text-[#F4E17F]">Acceso administración</CardTitle>
          </CardHeader>
          <CardContent className="relative space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-200">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={loading} autoComplete="email" className="bg-black/50 border-2 border-gray-600/50 focus:border-[#B59F02] text-white placeholder:text-gray-400 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-200">Contraseña</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={loading} autoComplete="current-password" className="bg-black/50 border-2 border-gray-600/50 focus:border-[#B59F02] text-white placeholder:text-gray-400 rounded-xl" />
              </div>
              <Button type="submit" className="w-full rounded-xl bg-[#B59F02] text-black font-bold" disabled={loading}>
                {loading ? <>Entrando...</> : 'Entrar'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
