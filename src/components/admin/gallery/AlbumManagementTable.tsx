'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Trash2, Image as ImageIcon, MapPin, Eye } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useTransition } from 'react';

import { deleteAlbumCascadeAction } from '@/features/gallery/actions';
import type { AdminAlbumItem } from '@/features/gallery/repository';

interface Props {
  albums: AdminAlbumItem[];
}

export function AlbumManagementTable({ albums }: Props) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to permanently delete the album "${title}" and all its photos? This cannot be undone.`)) {
      startTransition(async () => {
        try {
          await deleteAlbumCascadeAction(id);
        } catch (error: any) {
          alert(error.message || 'Failed to delete album');
        }
      });
    }
  };

  return (
    <div className="overflow-hidden md:rounded-xl md:border md:border-gray-100 bg-transparent md:bg-white md:shadow-sm">
      <div className="w-full">
        <table className="w-full border-collapse text-left block md:table">
          <thead className="hidden md:table-header-group">
            <tr className="border-b border-gray-100 bg-gray-50/80 text-xs font-semibold uppercase tracking-wider text-gray-600">
              <th className="px-6 py-4">Cover / Title</th>
              <th className="px-6 py-4">Photos</th>
              <th className="px-6 py-4">Connections</th>
              <th className="px-6 py-4">Visibility</th>
              <th className="px-6 py-4">Created</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm block md:table-row-group">
            {albums.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500 bg-white rounded-lg border border-gray-200">
                  No albums found.
                </td>
              </tr>
            ) : (
              albums.map((album) => {
                const title = album.title || 'Untitled';
                const location = album.location;
                const visibility = album.visibility || 'Public';

                return (
                  <tr key={album.id} className={`transition-colors hover:bg-gray-50/50 block md:table-row border border-gray-200 md:border-none rounded-xl mb-4 md:mb-0 p-4 md:p-0 shadow-sm md:shadow-none bg-white md:bg-transparent ${isPending ? 'opacity-70 pointer-events-none' : ''}`}>
                    <td data-label="Cover / Title" className="px-0 md:px-6 py-2 md:py-4 block md:table-cell before:content-[attr(data-label)] before:font-semibold before:text-gray-500 before:text-xs before:uppercase before:mb-2 before:block md:before:hidden">
                      <div className="flex items-center gap-4">
                        <div className="relative flex h-12 w-16 shrink-0 items-center justify-center overflow-hidden rounded-md bg-gray-100 border border-gray-200">
                          {album.cover_image?.cdn_url ? (
                            <Image 
                              src={album.cover_image.cdn_url} 
                              alt={'Cover'} 
                              fill 
                              className="object-cover"
                            />
                          ) : (
                            <ImageIcon className="h-6 w-6 text-gray-300" />
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 transition-colors group-hover:text-primary">
                            {title}
                          </div>
                          <div className="text-xs text-gray-500">{album.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td data-label="Photos" className="px-0 md:px-6 py-2 md:py-4 block md:table-cell before:content-[attr(data-label)] before:font-semibold before:text-gray-500 before:text-xs before:uppercase before:mb-1 before:block md:before:hidden">
                      <span className="font-medium text-gray-900">{album.photos_count}</span> photos
                    </td>
                    <td data-label="Connections" className="px-0 md:px-6 py-2 md:py-4 text-xs text-gray-600 space-y-1 block md:table-cell before:content-[attr(data-label)] before:font-semibold before:text-gray-500 before:text-xs before:uppercase before:mb-1 before:block md:before:hidden">
                      {album.program_id && <div>Prog: <span className="font-medium text-gray-800">{album.program_id}</span></div>}
                      {album.event_id && <div>Event: <span className="font-medium text-gray-800">{album.event_id}</span></div>}
                      {location && (
                        <div className="flex items-center gap-1 text-gray-600 font-medium">
                          <MapPin className="h-3 w-3 text-emerald-600" />
                          {location}
                        </div>
                      )}
                      {!album.program_id && !album.event_id && !location && (
                        <span className="text-gray-400 italic">None</span>
                      )}
                    </td>
                    <td data-label="Visibility" className="px-0 md:px-6 py-2 md:py-4 block md:table-cell before:content-[attr(data-label)] before:font-semibold before:text-gray-500 before:text-xs before:uppercase before:mb-1 before:block md:before:hidden">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${visibility === 'Public' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
                      >
                        {visibility}
                      </span>
                    </td>
                    <td data-label="Created" className="px-0 md:px-6 py-2 md:py-4 text-xs text-gray-500 block md:table-cell before:content-[attr(data-label)] before:font-semibold before:text-gray-500 before:text-xs before:uppercase before:mb-1 before:block md:before:hidden">
                      {new Date(album.created_at).toLocaleDateString('en-IN')}
                    </td>
                    <td className="space-x-2 whitespace-nowrap px-0 md:px-6 py-3 md:py-4 text-left md:text-right block md:table-cell">
                      <Link href={`/gallery/${album.slug}`} target="_blank" title="View Public Album">
                        <button
                          type="button"
                          className="rounded p-1.5 text-gray-400 hover:text-gray-800"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(album.id, title)}
                        title="Delete Album"
                        className="rounded p-1.5 text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
