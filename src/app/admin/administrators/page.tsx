import { requireAuth, requireSuperAdminAuth } from '@/contracts/actions';
import { administratorsRepository } from '@/features/administrators/repository';
import { AdminListClient } from '@/components/admin/administrators/AdminListClient';
import { ShieldAlert } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Administrator Management | Admin Dashboard',
  description: 'Manage website administrators and super admins.',
};

export default async function AdministratorsPage() {
  const session = await requireAuth();
  
  try {
    requireSuperAdminAuth(session);
  } catch (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <ShieldAlert className="w-16 h-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
        <p className="text-gray-500 max-w-md">
          You do not have the required Super Admin privileges to view or manage administrators.
        </p>
      </div>
    );
  }

  const initialAdmins = await administratorsRepository.getAdministrators();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Administrator Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage system administrators and their roles.
          </p>
        </div>
      </div>

      <AdminListClient 
        initialAdmins={initialAdmins} 
        currentUserId={session.id} 
      />
    </div>
  );
}
