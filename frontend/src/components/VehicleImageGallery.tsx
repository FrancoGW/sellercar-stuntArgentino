import { useState, useCallback, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface VehicleImageGalleryProps {
  images: string[];
  title: string;
}

export function VehicleImageGallery({ images, title }: VehicleImageGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const goPrev = useCallback(() => {
    setCurrentIndex((i) => (i <= 0 ? images.length - 1 : i - 1));
  }, [images.length]);

  const goNext = useCallback(() => {
    setCurrentIndex((i) => (i >= images.length - 1 ? 0 : i + 1));
  }, [images.length]);

  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxOpen(false);
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightboxOpen, goPrev, goNext]);

  if (!images?.length) {
    return (
      <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-900 border border-[#B59F02]/20 flex items-center justify-center text-gray-500">
        Sin imagen
      </div>
    );
  }

  const openAt = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  return (
    <>
      <div className="space-y-4">
        {/* Imagen principal - clickeable */}
        <button
          type="button"
          onClick={() => openAt(0)}
          className="block w-full text-left rounded-lg overflow-hidden bg-gray-900 border border-[#B59F02]/20 hover:border-[#B59F02]/50 transition-colors focus:outline-none focus:ring-2 focus:ring-[#B59F02]/40"
          aria-label="Ver imagen ampliada"
        >
          <img
            src={images[0]}
            alt={title}
            className="w-full aspect-video object-cover cursor-pointer"
          />
        </button>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="grid grid-cols-4 gap-2">
            {images.slice(0, 8).map((url, i) => (
              <button
                key={i}
                type="button"
                onClick={() => openAt(i)}
                className="relative aspect-video rounded-lg overflow-hidden bg-gray-900 border border-[#B59F02]/20 hover:border-[#B59F02]/60 transition-colors focus:outline-none focus:ring-2 focus:ring-[#B59F02]/40"
                aria-label={`Ver imagen ${i + 1}`}
              >
                <img src={url} alt={`${title} ${i + 1}`} className="w-full h-full object-cover" loading="lazy" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={() => setLightboxOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Galería de imágenes"
        >
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 z-10 p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Cerrar"
          >
            <X className="h-8 w-8" />
          </button>

          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); goPrev(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-black/50 text-white hover:bg-[#B59F02]/80 transition-colors"
                aria-label="Imagen anterior"
              >
                <ChevronLeft className="h-8 w-8" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); goNext(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-black/50 text-white hover:bg-[#B59F02]/80 transition-colors"
                aria-label="Siguiente imagen"
              >
                <ChevronRight className="h-8 w-8" />
              </button>
            </>
          )}

          <div
            className="max-w-[90vw] max-h-[90vh] flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={images[currentIndex]}
              alt={`${title} - imagen ${currentIndex + 1}`}
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
            />
          </div>

          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-gray-400 text-sm">
              {currentIndex + 1} / {images.length}
            </div>
          )}
        </div>
      )}
    </>
  );
}
