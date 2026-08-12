'use client';

import { useRef, useState } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { api } from '@/lib/apiClient';

// Sube imágenes a Cloudinary vía el backend y mantiene una lista
// [{ url, publicId, alt }] que el formulario del proyecto guarda tal cual.
export default function ImageUploader({ images = [], onChange, folder = 'portfolio-ai/projects' }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  async function handleFiles(fileList) {
    setError(null);
    const files = Array.from(fileList || []);
    if (files.length === 0) return;

    setUploading(true);
    try {
      const uploaded = [];
      for (const file of files) {
        const formData = new FormData();
        formData.append('image', file);
        formData.append('folder', folder);
        const result = await api.post('/upload', formData, { isFormData: true });
        uploaded.push({ url: result.url, publicId: result.publicId, alt: '' });
      }
      onChange([...images, ...uploaded]);
    } catch (err) {
      setError(err.message || 'No se pudo subir la imagen. Revisa la configuración de Cloudinary.');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  async function removeAt(index) {
    const img = images[index];
    onChange(images.filter((_, i) => i !== index));
    if (img?.publicId) {
      try {
        await api.del('/upload', { publicId: img.publicId });
      } catch (_) {
        // si falla el borrado remoto, igual ya se quitó de la lista local
      }
    }
  }

  return (
    <div>
      <span className="mb-1.5 block text-sm font-medium text-paper">Imágenes</span>

      <div className="flex flex-wrap gap-3">
        {images.map((img, i) => (
          <div key={img.publicId || img.url || i} className="group relative h-20 w-28 overflow-hidden rounded-lg border border-line">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img.url} alt={img.alt || ''} className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => removeAt(i)}
              className="absolute right-1 top-1 rounded-full bg-ink/70 p-1 text-paper opacity-0 transition-opacity group-hover:opacity-100"
              aria-label="Quitar imagen"
            >
              <X size={12} />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex h-20 w-28 flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-line text-muted hover:border-signal/50 hover:text-signal disabled:opacity-50"
        >
          {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
          <span className="text-xs">{uploading ? 'Subiendo…' : 'Subir'}</span>
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {error && <p className="mt-2 text-xs text-danger">{error}</p>}
    </div>
  );
}
