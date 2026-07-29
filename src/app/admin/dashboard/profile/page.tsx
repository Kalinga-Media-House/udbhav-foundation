import { AdminProfile } from '@/components/admin/profile/AdminProfile';

export const metadata = {
  title: 'Admin Profile Settings | Udbhav Foundation',
};

export default function ProfilePage() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile Settings</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Manage your account settings and preferences.</p>
      </div>
      <AdminProfile />
    </div>
  );
}
