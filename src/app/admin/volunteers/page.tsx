import { Users, UserCheck, Clock, Activity } from 'lucide-react';
import { redirect } from 'next/navigation';
import React from 'react';

import { AdminVolunteersClient } from '@/components/admin/volunteers/AdminVolunteersClient';
import { requireAuth } from '@/contracts/actions';
import { listVolunteers, listVolunteerApplications } from '@/features/volunteers';

export const dynamic = 'force-dynamic';

export default async function AdminVolunteersPage() {
  try {
    await requireAuth();
    const [volRes, appRes] = await Promise.all([
      listVolunteers({ page: 1, limit: 100 }),
      listVolunteerApplications({ page: 1, limit: 100 }),
    ]);

    const volunteers = volRes.data?.data || [];
    const applications = appRes.data?.data || [];

    // Calculate Statistics for Dashboard Cards
    const totalVolunteers = volunteers.length;
    const activeVolunteers = volunteers.filter((v) => v.status === 'Verified').length;
    const pendingApplications = applications.filter((a) => a.status === 'pending').length;
    const hoursContributed = volunteers.reduce((acc, v) => acc + (v.total_hours || 0), 0);

    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Volunteer Management</h1>
          <p className="mt-1 text-gray-500">
            Manage changemakers, review application history, assign roles, and issue certificates.
          </p>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-center gap-4 overflow-hidden rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="rounded-lg bg-indigo-50 p-3">
              <Users className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <p className="truncate text-sm font-medium text-gray-500">Total Volunteers</p>
              <p className="text-2xl font-bold text-gray-900">{totalVolunteers}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 overflow-hidden rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="rounded-lg bg-green-50 p-3">
              <UserCheck className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="truncate text-sm font-medium text-gray-500">Active</p>
              <p className="text-2xl font-bold text-gray-900">{activeVolunteers}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 overflow-hidden rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="rounded-lg bg-amber-50 p-3">
              <Activity className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p className="truncate text-sm font-medium text-gray-500">Pending Applications</p>
              <p className="text-2xl font-bold text-gray-900">{pendingApplications}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 overflow-hidden rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="rounded-lg bg-teal-50 p-3">
              <Clock className="h-6 w-6 text-teal-600" />
            </div>
            <div>
              <p className="truncate text-sm font-medium text-gray-500">Hours Contributed</p>
              <p className="text-2xl font-bold text-gray-900">{hoursContributed}</p>
            </div>
          </div>
        </div>

        <AdminVolunteersClient initialVolunteers={volunteers} initialApplications={applications} />
      </div>
    );
  } catch {
    redirect('/login?redirect=/admin/volunteers');
  }
}
