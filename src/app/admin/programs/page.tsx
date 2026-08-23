/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Edit,
  Trash2,
  Plus,
  Users,
  MapPin,
  FolderOpen,
  Activity,
  CheckCircle,
  Edit3,
  ExternalLink,
  Calendar,
} from 'lucide-react';
import { revalidatePath } from 'next/cache';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { listPrograms, deleteProgram } from '@/features/programs/actions';

export const dynamic = 'force-dynamic';

export default async function AdminProgramsPage(props: {
  searchParams: Promise<{ page?: string }>;
}) {
  const searchParams = await props.searchParams;
  const page = searchParams.page ? parseInt(searchParams.page, 10) : 1;
  const result = await listPrograms({ page, limit: 100 });
  const programs = result.success && result.data ? result.data.data : [];

  // Calculate statistics
  const totalPrograms = programs.length;
  const active = programs.filter((p) => p.status === 'active').length;
  const completed = programs.filter((p) => p.status === 'completed').length;
  const draft = programs.filter((p) => p.status === 'draft').length;

  async function handleDelete(id: string) {
    'use server';
    await deleteProgram(id);
    revalidatePath('/admin/programs');
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Program Management</h1>
          <p className="mt-1 text-gray-500">
            Manage foundation programs, initiatives, and track beneficiary impact.
          </p>
        </div>
        <Link href="/admin/programs/new">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Program
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
            <p className="truncate text-sm font-medium text-gray-500">Total Programs</p>
            <p className="text-2xl font-bold text-gray-900">{totalPrograms}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 overflow-hidden rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="rounded-lg bg-green-50 p-3">
            <Activity className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="truncate text-sm font-medium text-gray-500">Active</p>
            <p className="text-2xl font-bold text-gray-900">{active}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 overflow-hidden rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="rounded-lg bg-blue-50 p-3">
            <CheckCircle className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="truncate text-sm font-medium text-gray-500">Completed</p>
            <p className="text-2xl font-bold text-gray-900">{completed}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 overflow-hidden rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="rounded-lg bg-amber-50 p-3">
            <Edit3 className="h-6 w-6 text-amber-600" />
          </div>
          <div>
            <p className="truncate text-sm font-medium text-gray-500">Draft</p>
            <p className="text-2xl font-bold text-gray-900">{draft}</p>
          </div>
        </div>
      </div>

      {/* Programs Table */}
      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/80 text-xs font-semibold uppercase tracking-wider text-gray-600">
                <th className="px-6 py-4">Program</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Beneficiaries</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Updated</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {programs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    No programs found.
                  </td>
                </tr>
              ) : (
                programs.map((prog) => {
                  let statusColor = 'bg-gray-100 text-gray-800';
                  if (prog.status === 'active') statusColor = 'bg-green-100 text-green-800';
                  if (prog.status === 'completed') statusColor = 'bg-blue-100 text-blue-800';
                  if (prog.status === 'draft') statusColor = 'bg-amber-100 text-amber-800';

                  const dateStr = prog.start_date 
                    ? new Date(prog.start_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
                    : 'N/A';
                  
                  const locationStr = prog.location || 'N/A';

                  const beneficiaries =
                    prog.metadata &&
                    typeof prog.metadata === 'object' &&
                    'beneficiaries' in prog.metadata
                      ? (prog.metadata as any).beneficiaries
                      : 'N/A';

                  const r2Url = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || 'https://media.udbhavfoundation.in';
                  const imageUrl = prog.cover_image?.r2_object_key
                    ? `${r2Url}/${prog.cover_image.r2_object_key}`
                    : prog.metadata && typeof prog.metadata === 'object' && 'coverImageUrl' in prog.metadata
                      ? (prog.metadata as any).coverImageUrl
                      : '/images/default-news-cover.jpg';

                  return (
                    <tr key={prog.id} className="transition-colors hover:bg-gray-50/50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-md bg-gray-100">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={imageUrl}
                              alt={prog.title}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 line-clamp-1">{prog.short_description || '-'}</div>
                            <div className="font-semibold text-gray-900 transition-colors group-hover:text-primary">
                              {prog.title}
                            </div>
                            <div className="mt-0.5 font-mono text-xs text-gray-500">
                              {prog.program_code}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="rounded-md border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-600">
                          {prog.program_type || 'General'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-gray-400" />
                          {dateStr}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-gray-400" />
                          {locationStr}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        <div className="flex items-center gap-1.5">
                          <Users className="h-3.5 w-3.5 text-gray-400" />
                          {beneficiaries}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusColor}`}
                        >
                          {prog.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-500">
                        {new Date(prog.updated_at).toLocaleDateString('en-IN')}
                      </td>
                      <td className="space-x-2 whitespace-nowrap px-6 py-4 text-right">
                        <Link
                          href={`/programmes/${prog.slug}`}
                          target="_blank"
                          title="View Program"
                        >
                          <button
                            type="button"
                            className="rounded p-1.5 text-gray-500 hover:text-gray-900"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </button>
                        </Link>
                        <Link href={`/admin/programs/${prog.id}/edit`} title="Edit Program">
                          <button
                            type="button"
                            className="rounded p-1.5 text-blue-600 hover:text-blue-800"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                        </Link>

                        <form action={handleDelete.bind(null, prog.id)} className="inline-block">
                          <button
                            type="submit"
                            title="Archive / Delete Program"
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
