/* eslint-disable */
'use client';

import { ChevronDown, ChevronUp, MoreHorizontal, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';


import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/utils';



export type ContactColumn = {
  key: string;
  label: string;
  sortable?: boolean;
  hiddenOnMobile?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
};

interface ContactTableProps {
  data: any[];
  columns: ContactColumn[];
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  sortKey?: string;
  sortDirection?: 'asc' | 'desc';
  onRowClick?: (id: string) => void;
  selectedId?: string;
  isLoading?: boolean;
}

export function ContactTable({
  data,
  columns,
  onSort,
  sortKey,
  sortDirection,
  onRowClick,
  selectedId,
  isLoading,
}: ContactTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleSort = (key: string) => {
    if (!onSort) return;
    if (sortKey === key) {
      onSort(key, sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      onSort(key, 'asc');
    }
  };

  const handleRowClick = (id: string) => {
    if (onRowClick) {
      onRowClick(id);
      return;
    }
    
    // Default behavior: add previewId to query string
    const params = new URLSearchParams(searchParams.toString());
    if (params.get('previewId') === id) {
      params.delete('previewId');
    } else {
      params.set('previewId', id);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  if (isLoading) {
    return (
      <div className="w-full animate-pulse">
        <div className="h-12 bg-zinc-100 dark:bg-zinc-800 rounded-t-lg mb-2"></div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-zinc-50 dark:bg-zinc-800/50 mb-1 rounded-sm"></div>
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border rounded-lg bg-zinc-50/50 dark:bg-zinc-900/20 border-dashed">
        <User className="w-12 h-12 text-zinc-300 dark:text-zinc-700 mb-4" />
        <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">No contacts found</h3>
        <p className="text-sm text-zinc-500 mt-1">Try adjusting your filters or search query.</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-zinc-500 bg-zinc-50 dark:bg-zinc-900/50 uppercase border-b border-zinc-200 dark:border-zinc-800">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                className={cn(
                  'px-4 py-3 font-medium whitespace-nowrap',
                  col.hiddenOnMobile && 'hidden md:table-cell',
                  col.sortable && 'cursor-pointer select-none hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors'
                )}
                onClick={() => col.sortable && handleSort(col.key)}
              >
                <div className="flex items-center space-x-1">
                  <span>{col.label}</span>
                  {col.sortable && sortKey === col.key && (
                    <span className="text-primary">
                      {sortDirection === 'asc' ? (
                        <ChevronUp className="w-3 h-3" />
                      ) : (
                        <ChevronDown className="w-3 h-3" />
                      )}
                    </span>
                  )}
                </div>
              </th>
            ))}
            <th scope="col" className="px-4 py-3 text-right">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {data.map((row) => (
            <tr
              key={row.id}
              onClick={() => handleRowClick(row.id)}
              className={cn(
                'group hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors cursor-pointer',
                selectedId === row.id && 'bg-primary/5 dark:bg-primary/10'
              )}
            >
              {columns.map((col) => (
                <td
                  key={`${row.id}-${col.key}`}
                  className={cn(
                    'px-4 py-3',
                    col.hiddenOnMobile && 'hidden md:table-cell'
                  )}
                >
                  {col.render ? (
                    col.render(row[col.key], row)
                  ) : (
                    <span className="text-zinc-700 dark:text-zinc-300">
                      {row[col.key] || '-'}
                    </span>
                  )}
                </td>
              ))}
              <td className="px-4 py-3 text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity focus-visible:opacity-100"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem asChild>
                      <Link href={`/admin/dashboard/relationships/${row.id}`}>
                        View Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/admin/dashboard/relationships/${row.id}?tab=edit`}>
                        Edit Contact
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
