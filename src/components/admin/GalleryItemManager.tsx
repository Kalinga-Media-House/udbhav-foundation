'use client';

import { Trash2, Upload, Star } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { addGalleryItem, removeGalleryItem } from '@/features/gallery/actions';
import type { GalleryItemWithMedia } from '@/features/gallery/repository';
import { ImageUploader } from '@/components/admin/ImageUploader';

interface GalleryItemManagerProps {
  albumId: string;
  albumTitle: string;
  initialItems: GalleryItemWithMedia[];
}

export function GalleryItemManager({ albumId, albumTitle, initialItems }: GalleryItemManagerProps) {
  const router = useRouter();
  const [items, setItems] = useState<GalleryItemWithMedia[]>(initialItems);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const [caption, setCaption] = useState('');
  const [title, setTitle] = useState('');
  const [displayOrder, setDisplayOrder] = useState(0);
  const [isFeatured, setIsFeatured] = useState(false);

  const handleUploadComplete = async (results: any | any[]) => {
    try {
      setUploading(true);
      setError(null);
      
      const uploadResults = Array.isArray(results) ? results : [results];

      for (const result of uploadResults) {
        const addResult = await addGalleryItem({
          album_id: albumId,
          media_id: result.id,
          title: title || result.originalFilename || 'Gallery Image',
          caption: caption || null,
          display_order: displayOrder,
          is_featured: isFeatured,
        });

        if (!addResult.success || !addResult.data) {
          throw new Error(addResult.error || 'Failed to associate image with album');
        }
      }

      setCaption('');
      setTitle('');
      setDisplayOrder(items.length + uploadResults.length);
      setIsFeatured(false);

      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Error adding gallery item');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async (itemId: string) => {
    if (!confirm('Are you sure you want to remove this photo from the album?')) return;
    try {
      setError(null);
      const res = await removeGalleryItem(itemId, albumId);
      if (!res.success) {
        throw new Error(res.error || 'Failed to remove gallery item');
      }
      setItems((prev) => prev.filter((item) => item.id !== itemId));
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Error removing item');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Add New Photo to &ldquo;{albumTitle}&rdquo;</h2>

        {error && (
          <div className="p-4 bg-red-50 text-red-700 rounded-md border border-red-200">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="item_title">Title / Credit (Optional)</Label>
            <Input
              id="item_title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Photo by Jane Doe"
              disabled={uploading}
            />
          </div>

          <div>
            <Label htmlFor="item_caption">Caption (Optional)</Label>
            <Input
              id="item_caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Students during workshop..."
              disabled={uploading}
            />
          </div>

          <div>
            <Label htmlFor="item_order">Display Order</Label>
            <Input
              id="item_order"
              type="number"
              min={0}
              value={displayOrder}
              onChange={(e) => setDisplayOrder(parseInt(e.target.value, 10) || 0)}
              disabled={uploading}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="item_featured"
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
            disabled={uploading}
            className="rounded border-gray-300"
          />
          <Label htmlFor="item_featured">Highlight as Featured Image</Label>
        </div>

        <div>
          <ImageUploader
            folder="gallery-items"
            multiple={true}
            onUploadComplete={handleUploadComplete}
            maxSizeMB={25}
            maxFiles={50}
          />
          {uploading && <p className="text-sm text-gray-500 mt-2 text-center animate-pulse">Saving to album...</p>}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Album Photos ({initialItems.length})
        </h3>

        {initialItems.length === 0 ? (
          <p className="text-gray-500 py-6 text-center">No photos in this album yet.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {initialItems.map((item) => (
              <div key={item.id} className="border rounded-lg overflow-hidden flex flex-col bg-gray-50">
                <div className="relative h-40 w-full bg-gray-200">
                  {item.media?.cdn_url ? (
                    <Image
                      src={item.media.cdn_url}
                      alt={item.media.alt_text || item.caption || 'Album photo'}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                      No Preview
                    </div>
                  )}
                  {item.is_featured && (
                    <span className="absolute top-2 left-2 bg-yellow-500 text-white p-1 rounded-full shadow">
                      <Star className="w-3.5 h-3.5 fill-current" />
                    </span>
                  )}
                </div>

                <div className="p-3 flex-1 flex flex-col justify-between">
                  <div>
                    {item.caption && <p className="text-xs font-semibold text-gray-800 line-clamp-1">{item.caption}</p>}
                    {item.caption && <p className="text-xs text-gray-600 mt-1 line-clamp-2">{item.caption}</p>}
                    <p className="text-xs text-gray-400 mt-1">Order: #{item.display_order}</p>
                  </div>

                  <div className="flex justify-end mt-3 pt-2 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => handleRemove(item.id)}
                      className="text-red-600 hover:text-red-800 p-1"
                      title="Remove Photo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
