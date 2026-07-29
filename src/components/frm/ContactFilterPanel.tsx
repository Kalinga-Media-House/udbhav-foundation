'use client';

import { Search, Filter, X } from 'lucide-react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useCallback, useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';


// Using useTransition in real apps for URL state, but here simple push is fine.
function useDebounce<T>(value: T, delay?: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay || 500);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
}

interface FilterOption {
  id: string;
  label: string;
}

interface ContactFilterPanelProps {
  types?: FilterOption[];
  tags?: FilterOption[];
}

export function ContactFilterPanel({ types = [], tags: _tags = [] }: ContactFilterPanelProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('q') || '');
  const debouncedSearch = useDebounce(search, 400);

  const activeTypes = searchParams.getAll('type');
  const activeStatus = searchParams.getAll('status');

  const createQueryString = useCallback(
    (name: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === null) {
        params.delete(name);
      } else {
        params.set(name, value);
      }
      return params.toString();
    },
    [searchParams]
  );

  const toggleArrayParam = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const current = params.getAll(name);
    
    params.delete(name);
    
    if (current.includes(value)) {
      current.filter((v) => v !== value).forEach((v) => params.append(name, v));
    } else {
      [...current, value].forEach((v) => params.append(name, v));
    }
    
    router.push(`${pathname}?${params.toString()}`);
  };

  useEffect(() => {
    if (debouncedSearch !== (searchParams.get('q') || '')) {
      router.push(`${pathname}?${createQueryString('q', debouncedSearch || null)}`);
    }
  }, [debouncedSearch, pathname, router, createQueryString, searchParams]);

  const clearFilters = () => {
    setSearch('');
    router.push(pathname);
  };

  const hasFilters = searchParams.toString().length > 0;

  return (
    <div className="flex flex-col h-full bg-zinc-50/50 dark:bg-zinc-950/50 border-r border-zinc-200 dark:border-zinc-800 p-4 overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 flex items-center">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </h2>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 px-2 text-zinc-500">
            Clear
          </Button>
        )}
      </div>

      <div className="space-y-6">
        {/* Search */}
        <div className="space-y-2">
          <Label htmlFor="search" className="text-xs font-semibold text-zinc-500 uppercase">
            Search
          </Label>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-400" />
            <Input
              id="search"
              placeholder="Name, email, or org..."
              className="pl-9 bg-white dark:bg-zinc-900"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                className="absolute right-2.5 top-2.5 text-zinc-400 hover:text-zinc-600"
                onClick={() => setSearch('')}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Status */}
        <div className="space-y-3 pt-4 border-t border-zinc-200 dark:border-zinc-800">
          <Label className="text-xs font-semibold text-zinc-500 uppercase">Status</Label>
          <div className="space-y-2">
            {['Active', 'Inactive', 'Merged'].map((status) => (
              <div key={status} className="flex items-center space-x-2">
                <Checkbox
                  id={`status-${status}`}
                  checked={activeStatus.includes(status)}
                  onCheckedChange={() => toggleArrayParam('status', status)}
                />
                <Label
                  htmlFor={`status-${status}`}
                  className="text-sm font-normal text-zinc-700 dark:text-zinc-300 cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {status}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Types */}
        {types.length > 0 && (
          <div className="space-y-3 pt-4 border-t border-zinc-200 dark:border-zinc-800">
            <Label className="text-xs font-semibold text-zinc-500 uppercase">Contact Type</Label>
            <div className="space-y-2">
              {types.map((type) => (
                <div key={type.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`type-${type.id}`}
                    checked={activeTypes.includes(type.id)}
                    onCheckedChange={() => toggleArrayParam('type', type.id)}
                  />
                  <Label
                    htmlFor={`type-${type.id}`}
                    className="text-sm font-normal text-zinc-700 dark:text-zinc-300 cursor-pointer leading-none"
                  >
                    {type.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
