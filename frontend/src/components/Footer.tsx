import { Instagram, Youtube, ShoppingBag } from 'lucide-react';

const LINKS = [
  { href: 'https://www.instagram.com/ivan.narvaez.motos/', label: 'Instagram', Icon: Instagram },
  { href: 'https://www.youtube.com/@Ivancuelga', label: 'YouTube', Icon: Youtube },
  { href: 'https://tiendastunt.com/', label: 'Tienda de cascos', Icon: ShoppingBag },
];

export function Footer() {
  return (
    <footer className="border-t border-[#B59F02]/20 bg-black/90 py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-4 text-center">
          <p className="text-gray-400 text-sm">
            StuntArgentino — Misma marca, misma identidad
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            {LINKS.map(({ href, label, Icon }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-400 hover:text-[#F4E17F] transition-colors"
              >
                <Icon className="h-5 w-5" />
                <span className="text-sm">{label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
