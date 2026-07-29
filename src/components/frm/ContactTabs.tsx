'use client';

import { 
  User, 
  Clock, 
  Network, 
  Building2, 
  GraduationCap, 
  CalendarDays, 
  HeartHandshake, 
  CreditCard, 
  FileText, 
  Files,
  History
} from 'lucide-react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

import { cn } from '@/utils';

interface TabItem {
  id: string;
  label: string;
  icon: React.ElementType;
}

const TABS: TabItem[] = [
  { id: 'overview', label: 'Overview', icon: User },
  { id: 'timeline', label: 'Timeline', icon: Clock },
  { id: 'relationships', label: 'Relationships', icon: Network },
  { id: 'organizations', label: 'Organizations', icon: Building2 },
  { id: 'programs', label: 'Programs', icon: GraduationCap },
  { id: 'events', label: 'Events', icon: CalendarDays },
  { id: 'volunteering', label: 'Volunteering', icon: HeartHandshake },
  { id: 'donations', label: 'Donations', icon: CreditCard },
  { id: 'notes', label: 'Internal Notes', icon: FileText },
  { id: 'documents', label: 'Documents', icon: Files },
  { id: 'audit', label: 'Audit History', icon: History },
];

export function ContactTabs({ children }: { children: (activeTab: string) => React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const activeTab = searchParams.get('tab') || 'overview';

  const handleTabChange = (tabId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', tabId);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex flex-col space-y-6">
      <div className="border-b border-zinc-200 dark:border-zinc-800">
        <nav className="-mb-px flex space-x-1 sm:space-x-4 overflow-x-auto hide-scrollbar" aria-label="Tabs">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={cn(
                  isActive
                    ? 'border-primary text-primary'
                    : 'border-transparent text-zinc-500 hover:text-zinc-700 hover:border-zinc-300 dark:hover:text-zinc-300 dark:hover:border-zinc-700',
                  'group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors'
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon
                  className={cn(
                    isActive ? 'text-primary' : 'text-zinc-400 group-hover:text-zinc-500 dark:group-hover:text-zinc-400',
                    '-ml-0.5 mr-2 h-4 w-4'
                  )}
                  aria-hidden="true"
                />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="min-h-[400px]">
        {children(activeTab)}
      </div>
    </div>
  );
}
