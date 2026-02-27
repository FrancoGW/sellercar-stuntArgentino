import { Link } from 'react-router-dom';
import { Instagram, Youtube, ShoppingBag, FileUp } from 'lucide-react';

const HEADER_LINKS = [
  { href: 'https://www.instagram.com/ivan.narvaez.motos/', label: 'Instagram', Icon: Instagram },
  { href: 'https://www.youtube.com/@Ivancuelga', label: 'YouTube', Icon: Youtube },
  { href: 'https://tiendastunt.com/', label: 'Tienda de cascos', Icon: ShoppingBag },
];

interface SiteHeaderProps {
  leftContent?: React.ReactNode;
}

export function SiteHeader({ leftContent }: SiteHeaderProps) {
  return (
    <header className="border-b border-[#B59F02]/20 bg-black">
      <div className="container mx-auto px-4 py-4 grid grid-cols-3 items-center">
        <div className="flex justify-start items-center gap-3">
          {leftContent ?? null}
          <Link
            to="/publicar-vehiculo"
            className="text-gray-400 hover:text-[#F4E17F] text-sm font-medium transition-colors flex items-center gap-1.5"
          >
            <FileUp className="h-4 w-4" />
            <span className="hidden sm:inline">Publicar vehículo</span>
          </Link>
        </div>
        <Link to="/" className="flex justify-center transition-transform duration-300 hover:scale-105">
          <img src="/logo-stunt-final.png" alt="StuntArgentino" className="h-12 w-auto object-contain md:h-14" />
        </Link>
        <div className="flex justify-end gap-4">
          {HEADER_LINKS.map(({ href, label, Icon }) => (
            <a
              key={href}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-[#F4E17F] transition-colors"
              aria-label={label}
            >
              <Icon className="h-5 w-5" />
            </a>
          ))}
        </div>
      </div>
    </header>
  );
}
