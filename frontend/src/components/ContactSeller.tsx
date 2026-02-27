'use client';

import { Button } from '@/components/ui/button';
import { whatsappUrl, WHATSAPP_DEFAULT_MESSAGE } from '@/lib/utils';
import { MessageCircle, Mail } from 'lucide-react';

interface ContactSellerProps {
  vehicleTitle: string;
  sellerPhone?: string | null;
  sellerEmail?: string | null;
}

export function ContactSeller({
  vehicleTitle,
  sellerPhone,
  sellerEmail,
}: ContactSellerProps) {
  const hasPhone = (sellerPhone?.replace(/\D/g, '') ?? '').length >= 8;
  const hasEmail = !!(sellerEmail?.trim());

  if (!hasPhone && !hasEmail) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-3">
      {hasPhone && (
        <Button
          variant="cta"
          size="lg"
          className="bg-[#25D366] hover:bg-[#20BA5A] text-white border-0"
          asChild
        >
          <a
            href={whatsappUrl(sellerPhone ?? '', WHATSAPP_DEFAULT_MESSAGE(vehicleTitle))}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle className="mr-2 h-5 w-5" />
            Contactar por WhatsApp
          </a>
        </Button>
      )}
      {hasEmail && (
        <Button variant="outline" size="lg" asChild>
          <a href={`mailto:${sellerEmail ?? ''}`}>
            <Mail className="mr-2 h-5 w-5" />
            Enviar email al vendedor
          </a>
        </Button>
      )}
    </div>
  );
}
