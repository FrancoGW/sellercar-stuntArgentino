import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { ImagePlus, X, Link, Upload, Loader2 } from 'lucide-react';

interface ImageUploadProps {
  urls: string[];
  onChange: (urls: string[]) => void;
}

export function ImageUpload({ urls, onChange }: ImageUploadProps) {
  const { token } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [uploadCount, setUploadCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [newUrl, setNewUrl] = useState('');
  const [urlError, setUrlError] = useState('');

  const uploadFiles = useCallback(
    async (files: File[]) => {
      if (!files.length) return;
      setUploading(true);
      setTotalCount(files.length);
      setUploadCount(0);

      const uploaded: string[] = [];
      for (const file of files) {
        try {
          const form = new FormData();
          form.append('file', file);
          const res = await apiFetch('/admin/upload', {
            method: 'POST',
            body: form,
            token: token ?? undefined,
          });
          const data = await res.json();
          if (data?.url) uploaded.push(data.url);
        } catch (err) {
          console.error(err);
        }
        setUploadCount((prev) => prev + 1);
      }

      if (uploaded.length) onChange([...urls, ...uploaded]);
      setUploading(false);
      setUploadCount(0);
      setTotalCount(0);
    },
    [token, urls, onChange],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': [] },
    disabled: uploading,
    onDrop: uploadFiles,
  });

  const remove = (index: number) => {
    onChange(urls.filter((_, i) => i !== index));
  };

  const addUrl = () => {
    setUrlError('');
    const trimmed = newUrl.trim();
    if (!trimmed) return;
    try {
      new URL(trimmed);
      onChange([...urls, trimmed]);
      setNewUrl('');
    } catch {
      setUrlError('URL inválida');
    }
  };

  return (
    <div className="space-y-4">
      {/* Zona de drag & drop */}
      <div
        {...getRootProps()}
        className={[
          'relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-10 transition-colors cursor-pointer',
          isDragActive
            ? 'border-[#B59F02] bg-[#B59F02]/10'
            : uploading
              ? 'border-[#B59F02]/30 bg-black/20 cursor-not-allowed opacity-60'
              : 'border-[#B59F02]/30 bg-black/20 hover:border-[#B59F02]/60 hover:bg-[#B59F02]/5',
        ].join(' ')}
      >
        <input {...getInputProps()} />

        {uploading ? (
          <>
            <Loader2 className="h-10 w-10 text-[#B59F02] animate-spin" />
            <p className="text-sm font-medium text-[#F4E17F]">
              Subiendo {uploadCount} de {totalCount}…
            </p>
          </>
        ) : isDragActive ? (
          <>
            <Upload className="h-10 w-10 text-[#B59F02]" />
            <p className="text-sm font-medium text-[#F4E17F]">Soltá las imágenes acá</p>
          </>
        ) : (
          <>
            <ImagePlus className="h-10 w-10 text-[#B59F02]/60" />
            <div className="text-center">
              <p className="text-sm font-medium text-gray-300">
                Arrastrá imágenes o{' '}
                <span className="text-[#F4E17F] underline underline-offset-2">
                  hacé clic para seleccionar
                </span>
              </p>
              <p className="mt-1 text-xs text-gray-500">
                PNG, JPG, WEBP · Podés subir varias a la vez
              </p>
            </div>
          </>
        )}
      </div>

      {/* Previsualización de imágenes */}
      {urls.length > 0 && (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
          {urls.map((url, i) => (
            <div key={i} className="group relative aspect-square overflow-hidden rounded-lg border border-[#B59F02]/20">
              <img
                src={url}
                alt={`imagen-${i + 1}`}
                className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
              />
              <button
                type="button"
                onClick={() => remove(i)}
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/70 text-white opacity-0 transition-opacity duration-150 hover:bg-red-600 group-hover:opacity-100"
                title="Quitar imagen"
              >
                <X className="h-3.5 w-3.5" />
              </button>
              {i === 0 && (
                <span className="absolute bottom-1 left-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-[#F4E17F]">
                  Principal
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Agregar por URL */}
      <div className="space-y-1">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Link className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              placeholder="O pegar URL de imagen"
              value={newUrl}
              onChange={(e) => {
                setNewUrl(e.target.value);
                setUrlError('');
              }}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addUrl())}
              className="pl-9 bg-black/40 border-[#B59F02]/30 text-white placeholder:text-gray-500 focus-visible:ring-[#B59F02]/40"
            />
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={addUrl}
            className="border-[#B59F02]/40 text-[#F4E17F] hover:bg-[#B59F02]/20 shrink-0"
          >
            Agregar URL
          </Button>
        </div>
        {urlError && <p className="text-xs text-red-400">{urlError}</p>}
      </div>
    </div>
  );
}
