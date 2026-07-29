import { revalidatePath } from 'next/cache';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { listAlbums, deleteAlbum } from '@/features/gallery/actions';

export const dynamic = 'force-dynamic';

export default async function AdminGalleryPage(props: { searchParams: Promise<{ page?: string }> }) {
  const searchParams = await props.searchParams;
  const page = searchParams.page ? parseInt(searchParams.page, 10) : 1;
  const result = await listAlbums({ page, limit: 50 });
  const albums = result.success && result.data ? result.data.data : [];

  async function handleDelete(id: string) {
    'use server';
    await deleteAlbum(id);
    revalidatePath('/admin/dashboard/gallery');
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gallery Albums</h1>
          <p className="text-sm text-gray-500">Manage photo albums and published media collections.</p>
        </div>
        <Link href="/admin/dashboard/gallery/new">
          <Button>Create Album</Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="p-4 font-semibold text-sm text-gray-600">Code</th>
              <th className="p-4 font-semibold text-sm text-gray-600">Title</th>
              <th className="p-4 font-semibold text-sm text-gray-600">Visibility</th>
              <th className="p-4 font-semibold text-sm text-gray-600">Featured</th>
              <th className="p-4 font-semibold text-sm text-gray-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {albums.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">
                  No albums found.
                </td>
              </tr>
            ) : (
              albums.map((album) => (
                <tr key={album.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 text-sm font-mono text-gray-600">{album.album_code}</td>
                  <td className="p-4">
                    <div className="font-semibold text-gray-900">{album.title}</div>
                    <div className="text-xs text-gray-500 truncate max-w-md">{album.slug}</div>
                  </td>
                  <td className="p-4">
                    <Badge variant="secondary">
                      {album.visibility}
                    </Badge>
                  </td>
                  <td className="p-4 text-sm text-gray-600">
                    {album.is_featured ? (
                      <span className="text-green-600 font-medium">Yes</span>
                    ) : (
                      <span className="text-gray-400">No</span>
                    )}
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <Link href={`/admin/dashboard/gallery/${album.id}/items`}>
                      <Button variant="outline" size="sm">
                        Photos
                      </Button>
                    </Link>
                    <Link href={`/admin/dashboard/gallery/${album.id}/edit`}>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </Link>
                    <form action={handleDelete.bind(null, album.id)} className="inline">
                      <Button variant="destructive" size="sm" type="submit">
                        Delete
                      </Button>
                    </form>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
