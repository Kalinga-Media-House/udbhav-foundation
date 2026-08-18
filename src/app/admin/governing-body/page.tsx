import { getAllGoverningBodyMembers } from '@/features/governing-body';

import { GoverningBodyAdmin } from '@/components/admin/governing-body/GoverningBodyAdmin';

export const dynamic = 'force-dynamic';

export default async function AdminGoverningBodyPage() {
  const members = await getAllGoverningBodyMembers();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Governing Body Management</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage Governing Body members, profile photos, designations, visibility and display order.
        </p>
      </div>
      <GoverningBodyAdmin initialMembers={members} />
    </div>
  );
}
