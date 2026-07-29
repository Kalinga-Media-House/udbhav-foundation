import * as React from 'react';

import { NotificationBell } from '@/features/automation/components/NotificationBell';

import { Sidebar } from '../navigation/sidebar';


export const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b flex items-center justify-between px-6">
          <div className="font-semibold text-lg">Dashboard</div>
          <div className="flex items-center gap-4">
            <NotificationBell />
            {/* User profile menu can go here */}
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};
