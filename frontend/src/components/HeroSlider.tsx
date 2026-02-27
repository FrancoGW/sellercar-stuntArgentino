import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { apiFetch } from '@/lib/api';

export function HeroSlider() {
  const [images, setImages] = useState<string[]>(['/hero-slider.png']);

  useEffect(() => {
    apiFetch('/config/hero')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.images?.length) setImages(data.images);
      })
      .catch(() => {});
  }, []);

  const img = images[0];
  const src = img?.startsWith('http') ? img : img || '/hero-slider.png';

  return (
    <section className="relative w-full overflow-hidden">
      <div className="relative aspect-[21/9] min-h-[220px] w-full shrink-0">
        <motion.img
          key={img}
          src={src}
          alt="Stunt Argentino"
          className="absolute inset-0 w-full h-full object-cover object-center min-w-full min-h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        />
        {/* Overlay oscuro para legibilidad del texto */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />
        <div className="absolute inset-0 flex items-end justify-center pb-8 md:pb-12 lg:pb-16 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-center w-full max-w-3xl"
          >
            <div className="bg-black/50 backdrop-blur-sm rounded-2xl px-6 py-5 md:px-10 md:py-7 border border-white/10">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold uppercase tracking-wider text-white [text-shadow:0_2px_20px_rgba(0,0,0,0.9)]">
                Encontrá tu próximo vehículo
              </h1>
              <p className="text-gray-200 text-sm sm:text-base md:text-lg mt-3 max-w-xl mx-auto [text-shadow:0_1px_10px_rgba(0,0,0,0.8)]">
                Catálogo profesional con las mejores opciones.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
