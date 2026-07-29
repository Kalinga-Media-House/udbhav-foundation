import { ActivityTimeline } from '@/components/admin/activity/ActivityTimeline';

export const metadata = {
  title: 'Activity Timeline | Admin Dashboard',
};

export default function ActivityPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Activity Timeline</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Track and monitor all system events and audit logs.</p>
      </div>
      <ActivityTimeline />
    </div>
  );
}
