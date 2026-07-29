import Link from 'next/link';
import * as React from 'react';

import { APPLICATION } from '@/constants/application';

export const Sidebar = () => {
  return (
    <aside className="w-64 border-r bg-muted/10 hidden md:block">
      <div className="h-16 flex items-center px-6 border-b">
        <Link href="/" className="font-bold">
          {APPLICATION.BRAND_NAME} Admin
        </Link>
      </div>
      <div className="p-4">
        <nav className="space-y-2">
          {/* Navigation Items (To be driven by feature configs) */}
          <Link href="/admin/dashboard" className="block px-3 py-2 text-sm font-medium rounded-md hover:bg-muted">
            Dashboard
          </Link>
        </nav>
      </div>
    </aside>
  );
};
