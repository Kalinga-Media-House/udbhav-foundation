import Link from 'next/link';
import { notFound } from 'next/navigation';

import { ProgramForm } from '@/components/admin/ProgramForm';
import { getProgramById } from '@/features/programs/actions';

export default async function EditProgramPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  let program;
  try {
    const res = await getProgramById(params.id);
    if (!res.success || !res.data) throw new Error();
    program = res.data;
  } catch {
    notFound();
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="mb-2 text-sm text-gray-500">
          <Link href="/admin/dashboard/programmes" className="hover:underline">
            Programmes
          </Link>
          <span className="mx-2">/</span>
          <span>Edit</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Edit Program</h1>
      </div>
      <ProgramForm initialData={program} />
    </div>
  );
}
