import Link from 'next/link';

import { ProgramForm } from '@/components/admin/ProgramForm';

export default function NewProgramPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="text-sm text-gray-500 mb-2">
          <Link href="/admin/dashboard/programmes" className="hover:underline">Programmes</Link>
          <span className="mx-2">/</span>
          <span>New</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Create Program</h1>
      </div>
      <ProgramForm />
    </div>
  );
}
