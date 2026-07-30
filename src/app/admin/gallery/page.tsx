import {
  Image as ImageIcon,
  Video,
  FolderOpen,
  Star,
  Filter,
  Grid,
  List,
  Search,
  Upload,
  ExternalLink,
  Edit,
  Trash2,
} from 'lucide-react';
import { revalidatePath } from 'next/cache';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { listAlbums, deleteAlbum } from '@/features/gallery/actions';

export const dynamic = 'force-dynamic';

export default async function AdminGalleryPage(props: {
  searchParams: Promise<{ page?: string }>;
}) {
  const searchParams = await props.searchParams;
  const page = searchParams.page ? parseInt(searchParams.page, 10) : 1;
  const result = await listAlbums({ page, limit: 100 });
  const albums = result.success && result.data ? result.data.data : [];

  // Statistics calculation for the Dashboard Cards
  const totalAlbums = albums.length;
  // Approximations for Photos and Videos since we might not have all items loaded.
  // Ideally, this should come from a separate count query in a real production system.
  const totalPhotos = albums.reduce((acc, album) => acc + (album.item_count || 0), 0);
  const totalVideos = 0; // Assuming we'd get this from metadata or a separate column if we supported rich video tracking
  const featured = albums.filter((a) => a.is_featured).length;

  async function handleDelete(id: string) {
    'use server';
    await deleteAlbum(id);
    revalidatePath('/admin/gallery');
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Gallery Management</h1>
          <p className="mt-1 text-gray-500">
            Manage photo albums, video collections, and media for the public website.
          </p>
        </div>
        <Link href="/admin/gallery/new">
          <Button className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Upload Media
          </Button>
        </Link>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex items-center gap-4 overflow-hidden rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="rounded-lg bg-indigo-50 p-3">
            <FolderOpen className="h-6 w-6 text-indigo-600" />
          </div>
          <div>
            <p className="truncate text-sm font-medium text-gray-500">Albums</p>
            <p className="text-2xl font-bold text-gray-900">{totalAlbums}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 overflow-hidden rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="rounded-lg bg-emerald-50 p-3">
            <ImageIcon className="h-6 w-6 text-emerald-600" />
          </div>
          <div>
            <p className="truncate text-sm font-medium text-gray-500">Photos</p>
            <p className="text-2xl font-bold text-gray-900">{totalPhotos}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 overflow-hidden rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="rounded-lg bg-pink-50 p-3">
            <Video className="h-6 w-6 text-pink-600" />
          </div>
          <div>
            <p className="truncate text-sm font-medium text-gray-500">Videos</p>
            <p className="text-2xl font-bold text-gray-900">{totalVideos}</p>
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

      {/* Toolbar / Filters (Static UI implementation) */}
      <div className="flex flex-col items-center justify-between gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm md:flex-row">
        <div className="relative w-full flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input placeholder="Search albums..." className="w-full pl-9 md:max-w-xs" />
        </div>

        <div className="flex w-full items-center gap-3 md:w-auto">
          <Filter className="hidden h-4 w-4 text-gray-400 md:inline" />
          <select className="h-10 rounded-md border border-input bg-background px-3 text-sm">
            <option>All Albums</option>
            <option>Recent Events</option>
            <option>Programs</option>
          </select>
          <select className="h-10 rounded-md border border-input bg-background px-3 text-sm">
            <option>All Media</option>
            <option>Photos Only</option>
            <option>Videos Only</option>
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

      {/* Gallery Table */}
      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/80 text-xs font-semibold uppercase tracking-wider text-gray-600">
                <th className="px-6 py-4">Thumbnail / Title</th>
                <th className="px-6 py-4">Album Code</th>
                <th className="px-6 py-4">Media Type</th>
                <th className="px-6 py-4">Visibility</th>
                <th className="px-6 py-4">Upload Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {albums.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No albums found.
                  </td>
                </tr>
              ) : (
                albums.map((album) => (
                  <tr key={album.id} className="transition-colors hover:bg-gray-50/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative flex h-12 w-16 shrink-0 items-center justify-center overflow-hidden rounded-md bg-gray-100">
                          {/* Placeholder thumbnail */}
                          <ImageIcon className="h-6 w-6 text-gray-300" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 transition-colors group-hover:text-primary">
                            {album.title}
                          </div>
                          <div className="mt-0.5 text-xs text-gray-500">
                            {album.item_count || 0} items
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-sm text-gray-600">
                      {album.album_code}
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant="outline"
                        className="border-gray-200 font-normal text-gray-600"
                      >
                        Mixed
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${album.visibility === 'Public' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
                      >
                        {album.visibility}
                      </span>
                      {album.is_featured && (
                        <span className="ml-2 inline-flex items-center justify-center rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                          <Star className="mr-1 h-3 w-3 fill-amber-500" /> Featured
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500">
                      {new Date(album.created_at).toLocaleDateString('en-IN')}
                    </td>
                    <td className="space-x-2 whitespace-nowrap px-6 py-4 text-right">
                      <Link href={`/admin/gallery/${album.id}/items`} title="View Items">
                        <button
                          type="button"
                          className="rounded p-1.5 text-gray-500 hover:text-gray-900"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </button>
                      </Link>

                      <Link href={`/admin/gallery/${album.id}/edit`} title="Edit Album">
                        <button
                          type="button"
                          className="rounded p-1.5 text-blue-600 hover:text-blue-800"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      </Link>

                      <form action={handleDelete.bind(null, album.id)} className="inline-block">
                        <button
                          type="submit"
                          title="Delete Album"
                          className="rounded p-1.5 text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </form>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
