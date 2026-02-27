import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { whatsappUrl } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Mail, MessageSquare, Phone, User, Send, MessageCircle } from 'lucide-react';

const WHATSAPP_CONTACT_MSG = 'Hola, te escribo desde StuntArgentino en relación a tu consulta.';

interface ContactItem {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  createdAt: string;
  vehicleId?: string;
  status?: string;
  repliedAt?: string;
}

const defaultSubject = 'Re: Consulta - StuntArgentino';

export default function ContactosPage() {
  const { token } = useAuth();
  const [contacts, setContacts] = useState<ContactItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyTo, setReplyTo] = useState<ContactItem | null>(null);
  const [replySubject, setReplySubject] = useState(defaultSubject);
  const [replyBody, setReplyBody] = useState('');
  const [sending, setSending] = useState(false);
  const [replyError, setReplyError] = useState('');

  const loadContacts = () => {
    apiFetch('/admin/contactos', { token: token ?? undefined })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setContacts(data?.items ?? []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadContacts();
  }, [token]);

  const openReply = (c: ContactItem) => {
    setReplyTo(c);
    setReplySubject(defaultSubject);
    setReplyBody('');
    setReplyError('');
  };

  const closeReply = () => {
    setReplyTo(null);
    setReplyError('');
  };

  const updateStatus = async (contactId: string, status: string) => {
    try {
      const res = await apiFetch(`/admin/contactos/${contactId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
        token: token ?? undefined,
      });
      if (res.ok) loadContacts();
    } catch {
      /* ignore */
    }
  };

  const sendReply = async () => {
    if (!replyTo) return;
    const subject = replySubject.trim();
    const body = replyBody.trim();
    if (!subject || !body) {
      setReplyError('Completá asunto y mensaje.');
      return;
    }
    setSending(true);
    setReplyError('');
    try {
      const res = await apiFetch(`/admin/contactos/${replyTo._id}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, body }),
        token: token ?? undefined,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setReplyError(data?.message || data?.error || 'Error al enviar.');
        return;
      }
      closeReply();
      loadContacts();
    } catch {
      setReplyError('Error de conexión.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-white sm:text-2xl">Contactos</h1>
      <Card className="border-[#B59F02]/30 bg-black/40">
        <CardHeader>
          <CardTitle className="text-[#F4E17F]">Mensajes recibidos</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground">Cargando...</p>
          ) : contacts.length === 0 ? (
            <p className="text-muted-foreground">No hay contactos aún.</p>
          ) : (
            <ul className="space-y-4">
              {contacts.map((c) => {
                const isContestado = (c.status ?? 'pendiente') === 'contestado';
                const hasPhone = !!c.phone?.replace(/\D/g, '');
                return (
                  <li
                    key={c._id}
                    className="rounded-xl border border-[#B59F02]/20 bg-black/30 p-4 space-y-3"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="flex items-center gap-1.5 text-white font-medium">
                          <User className="h-4 w-4 text-[#B59F02]" />
                          {c.name}
                        </span>
                        {isContestado && (
                          <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs font-medium text-emerald-400 border border-emerald-500/30">
                            Respondido
                          </span>
                        )}
                        <span className="flex items-center gap-1.5 text-sm text-gray-400">
                          <Mail className="h-3.5 w-3" />
                          {c.email}
                        </span>
                        {c.phone && (
                          <span className="flex items-center gap-1.5 text-sm text-gray-400">
                            <Phone className="h-3.5 w-3" />
                            {c.phone}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(c.createdAt).toLocaleString('es-AR')}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <MessageSquare className="h-4 w-4 text-[#B59F02] shrink-0 mt-0.5" />
                      <p className="text-sm text-gray-300 whitespace-pre-wrap flex-1 min-w-0">
                        {c.message}
                      </p>
                    </div>
                    <div className="pt-2 border-t border-[#B59F02]/10 flex flex-wrap items-center gap-2">
                      <Select
                        value={c.status ?? 'pendiente'}
                        onValueChange={(v) => updateStatus(c._id, v)}
                      >
                        <SelectTrigger className="w-full min-w-[140px] max-w-[160px] h-8 text-xs border-[#B59F02]/30 bg-black/40 text-gray-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pendiente">Pendiente</SelectItem>
                          <SelectItem value="contestado">Contestado</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="border-[#B59F02]/40 text-[#F4E17F] hover:bg-[#B59F02]/20"
                        onClick={() => openReply(c)}
                      >
                        <Send className="h-3.5 w-3 mr-1.5" />
                        Responder por mail
                      </Button>
                      {hasPhone && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="border-[#25D366]/50 text-[#25D366] hover:bg-[#25D366]/20"
                          asChild
                        >
                          <a
                            href={whatsappUrl(c.phone!, WHATSAPP_CONTACT_MSG)}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <MessageCircle className="h-3.5 w-3 mr-1.5" />
                            WhatsApp
                          </a>
                        </Button>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!replyTo} onOpenChange={(open) => !open && closeReply()}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Responder por correo</DialogTitle>
          </DialogHeader>
          {replyTo && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-gray-300">Para</Label>
                <Input
                  readOnly
                  value={replyTo.email}
                  className="bg-black/50 border-[#B59F02]/30 text-gray-300"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-300">Asunto</Label>
                <Input
                  value={replySubject}
                  onChange={(e) => setReplySubject(e.target.value)}
                  placeholder="Asunto del correo"
                  className="bg-black/50 border-[#B59F02]/30 text-white placeholder:text-gray-500"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-300">Mensaje</Label>
                <textarea
                  value={replyBody}
                  onChange={(e) => setReplyBody(e.target.value)}
                  placeholder="Escribí tu respuesta..."
                  rows={5}
                  className="flex w-full rounded-lg border border-[#B59F02]/30 bg-black/50 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#B59F02]/40"
                />
              </div>
              {replyError && (
                <p className="text-sm text-red-400">{replyError}</p>
              )}
            </div>
          )}
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={closeReply}
              className="border-gray-600 text-gray-300"
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={sendReply}
              disabled={sending}
              className="bg-[#B59F02] text-black hover:bg-[#c9ad02]"
            >
              {sending ? 'Enviando...' : 'Enviar correo'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
