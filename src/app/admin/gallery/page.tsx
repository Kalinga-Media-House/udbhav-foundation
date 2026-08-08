import {
  Image as ImageIcon,
  Star,
  Filter,
  Grid,
  List,
  Search,
  Upload,
  Edit,
  Trash2,
  MapPin,
} from 'lucide-react';
import { revalidatePath } from 'next/cache';
import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { listAdminPhotos, removeGalleryItem } from '@/features/gallery/actions';

export const dynamic = 'force-dynamic';

export default async function AdminGalleryPage(props: {
  searchParams: Promise<{ page?: string }>;
}) {
  const searchParams = await props.searchParams;
  const page = searchParams.page ? parseInt(searchParams.page, 10) : 1;
  const result = await listAdminPhotos({ page, limit: 100 });
  const photos = result.success && result.data ? result.data.data : [];

  const totalPhotos = photos.length;
  const featured = photos.filter((p) => p.is_featured || p.album?.is_featured).length;

  async function handleDelete(id: string, albumId: string) {
    'use server';
    await removeGalleryItem(id, albumId);
    revalidatePath('/admin/gallery');
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Photos</h1>
          <p className="mt-1 text-gray-500">
            Manage your digital assets and photographic records.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/gallery/albums">
            <Button variant="outline" className="flex items-center gap-2 text-gray-500">
              Album Management
            </Button>
          </Link>
          <Link href="/admin/gallery/upload">
            <Button className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Upload Photos
            </Button>
          </Link>
        </div>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex items-center gap-4 overflow-hidden rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="rounded-lg bg-emerald-50 p-3">
            <ImageIcon className="h-6 w-6 text-emerald-600" />
          </div>
          <div>
            <p className="truncate text-sm font-medium text-gray-500">Total Photos</p>
            <p className="text-2xl font-bold text-gray-900">{totalPhotos}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 overflow-hidden rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="rounded-lg bg-amber-50 p-3">
            <Star className="h-6 w-6 text-amber-600" />
          </div>
          <div>
            <p className="truncate text-sm font-medium text-gray-500">Featured</p>
            <p className="text-2xl font-bold text-gray-900">{featured}</p>
          </div>
        </div>
      </div>

      {/* Toolbar / Filters */}
      <div className="flex flex-col items-center justify-between gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm md:flex-row">
        <div className="relative w-full flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input placeholder="Search photos..." className="w-full pl-9 md:max-w-xs" />
        </div>

        <div className="flex w-full items-center gap-3 md:w-auto">
          <Filter className="hidden h-4 w-4 text-gray-400 md:inline" />
          <select className="h-10 rounded-md border border-input bg-background px-3 text-sm">
            <option>All Photos</option>
            <option>Recent</option>
            <option>Featured</option>
          </select>
          <div className="flex items-center rounded-md border border-gray-200 bg-white p-1">
            <button
              className="rounded bg-gray-100 px-2 py-1.5 text-gray-700 shadow-sm"
              title="List View"
            >
              <List className="h-4 w-4" />
            </button>
            <button
              className="rounded px-2 py-1.5 text-gray-400 hover:text-gray-700"
              title="Grid View"
            >
              <Grid className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Photos Table */}
      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/80 text-xs font-semibold uppercase tracking-wider text-gray-600">
                <th className="px-6 py-4">Thumbnail / Title</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Visibility</th>
                <th className="px-6 py-4">Updated</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {photos.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    No photos found.
                  </td>
                </tr>
              ) : (
                photos.map((photo) => {
                  const title = photo.caption || photo.album?.title || 'Untitled';
                  const location = photo.location || photo.album?.location;
                  const visibility = photo.album?.visibility || 'Public';
                  const isFeatured = photo.is_featured || photo.album?.is_featured;

                  return (
                    <tr key={photo.id} className="transition-colors hover:bg-gray-50/50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="relative flex h-12 w-16 shrink-0 items-center justify-center overflow-hidden rounded-md bg-gray-100 border border-gray-200">
                            {photo.media?.cdn_url ? (
                              <Image 
                                src={photo.media.cdn_url} 
                                alt={photo.media.alt_text || 'Photo'} 
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
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {location ? (
                          <div className="flex items-center gap-1.5 text-xs text-gray-600 font-medium bg-gray-100 w-fit px-2 py-1 rounded-md">
                            <MapPin className="h-3.5 w-3.5 text-emerald-600" />
                            {location}
                          </div>
                        ) : (
                          <span className="text-gray-400 italic text-xs">Unspecified</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${visibility === 'Public' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
                        >
                          {visibility}
                        </span>
                        {isFeatured && (
                          <span className="ml-2 inline-flex items-center justify-center rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                            <Star className="mr-1 h-3 w-3 fill-amber-500" /> Featured
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-500">
                        {new Date(photo.updated_at).toLocaleDateString('en-IN')}
                      </td>
                      <td className="space-x-2 whitespace-nowrap px-6 py-4 text-right">
                        <Link href={`/admin/gallery/edit/${photo.id}`} title="Edit Photo">
                          <button
                            type="button"
                            className="rounded p-1.5 text-blue-600 hover:text-blue-800"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                        </Link>
                        <form action={handleDelete.bind(null, photo.id, photo.album_id)} className="inline-block">
                          <button
                            type="submit"
                            title="Delete Photo"
                            className="rounded p-1.5 text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </form>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
