'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ImageUploadProps {
  urls: string[];
  onChange: (urls: string[]) => void;
}

export function ImageUpload({ urls, onChange }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [newUrl, setNewUrl] = useState('');

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await fetch('/api/admin/upload', { method: 'POST', body: form });
      const data = await res.json();
      if (data.url) onChange([...urls, data.url]);
    } catch (err) {
      console.error(err);
    }
    setUploading(false);
    e.target.value = '';
  };

  const addUrl = () => {
    if (!newUrl.trim()) return;
    try {
      new URL(newUrl);
      onChange([...urls, newUrl.trim()]);
      setNewUrl('');
    } catch {
      // invalid URL
    }
  };

  const remove = (index: number) => {
    onChange(urls.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {urls.map((url, i) => (
          <div key={i} className="relative group">
            <img
              src={url}
              alt=""
              className="w-20 h-20 object-cover rounded border"
            />
            <button
              type="button"
              className="absolute top-0 right-0 bg-destructive text-destructive-foreground rounded p-1 text-xs opacity-0 group-hover:opacity-100"
              onClick={() => remove(i)}
            >
              Quitar
            </button>
          </div>
        ))}
      </div>
      <div className="flex gap-2 flex-wrap">
        <Label className="sr-only">Subir imagen (Cloudinary)</Label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFile}
          disabled={uploading}
          className="text-sm"
        />
        {uploading && <span className="text-sm text-muted-foreground">Subiendo...</span>}
      </div>
      <div className="flex gap-2">
        <Input
          placeholder="O pegar URL de imagen"
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
        />
        <Button type="button" variant="outline" onClick={addUrl}>
          Agregar URL
        </Button>
      </div>
    </div>
  );
}
