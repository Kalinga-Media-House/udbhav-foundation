import { AdvisoryBoardAdmin } from '@/components/admin/advisory-board/AdvisoryBoardAdmin';
import { getAllAdvisoryBoardMembers } from '@/features/advisory-board';

export const dynamic = 'force-dynamic';

export default async function AdminAdvisoryBoardPage() {
  const members = await getAllAdvisoryBoardMembers();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Advisory Board Management</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage Advisory Board members, profile photos, designations, visibility and display order.
        </p>
      </div>
      <AdvisoryBoardAdmin initialMembers={members} />
    </div>
  );
}
