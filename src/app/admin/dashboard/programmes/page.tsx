import { revalidatePath } from 'next/cache';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { listPrograms, deleteProgram } from '@/features/programs/actions';

export default async function AdminProgramsPage(props: { searchParams: Promise<{ page?: string }> }) {
  const searchParams = await props.searchParams;
  const page = searchParams.page ? parseInt(searchParams.page, 10) : 1;
  const result = await listPrograms({ page, limit: 50 });
  const programs = result.success && result.data ? result.data.data : [];

  async function handleDelete(id: string) {
    'use server';
    await deleteProgram(id);
    revalidatePath('/admin/dashboard/programmes');
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Programs</h1>
          <p className="text-sm text-gray-500">Manage foundation programs and initiatives.</p>
        </div>
        <Link href="/admin/dashboard/programmes/new">
          <Button>Create Program</Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="p-4 font-semibold text-sm text-gray-600">Code</th>
              <th className="p-4 font-semibold text-sm text-gray-600">Title</th>
              <th className="p-4 font-semibold text-sm text-gray-600">Status</th>
              <th className="p-4 font-semibold text-sm text-gray-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {programs.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-500">
                  No programs found.
                </td>
              </tr>
            ) : (
              programs.map((prog) => (
                <tr key={prog.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 text-sm font-mono text-gray-600">{prog.program_code}</td>
                  <td className="p-4">
                    <div className="font-semibold text-gray-900">{prog.title}</div>
                    <div className="text-xs text-gray-500 truncate max-w-md">{prog.slug}</div>
                  </td>
                  <td className="p-4">
                    <Badge variant={prog.status === 'active' ? 'default' : 'secondary'}>
                      {prog.status}
                    </Badge>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <Link href={`/admin/dashboard/programmes/${prog.id}/edit`}>
                      <Button variant="outline" size="sm">Edit</Button>
                    </Link>
                    <form action={handleDelete.bind(null, prog.id)} className="inline-block">
                      <Button variant="destructive" size="sm" type="submit">Delete</Button>
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
