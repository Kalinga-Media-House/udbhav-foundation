'use client';

import {
  Search,
  FileText,
  Users,
  Settings,
  X,
  ChevronRight,
  Loader2,
  DollarSign,
  Image as ImageIcon,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useRef, useTransition } from 'react';
import { toast } from 'sonner';

import { globalSearch } from '@/features/search/actions';

type SearchResultItem = {
  id: string;
  title: string;
  type: 'content' | 'user' | 'setting' | 'donation' | 'media';
  href: string;
};

export function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    } else if (!isOpen) {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(() => {
      startTransition(async () => {
        try {
          const res = await globalSearch(query);
          if (res) {
            const mappedResults: SearchResultItem[] = [];
            if (res.data?.contacts) {
              res.data?.contacts.forEach((c: any) =>
                mappedResults.push({
                  id: `contact_${c.id}`,
                  title: c.full_name || c.email,
                  type: 'user',
                  href: `/admin/dashboard/contacts/${c.id}`,
                })
              );
            }
            if (res.data?.organizations) {
              res.data?.organizations.forEach((o: any) =>
                mappedResults.push({
                  id: `org_${o.id}`,
                  title: o.name,
                  type: 'user',
                  href: `/admin/dashboard/organizations/${o.id}`,
                })
              );
            }
            if (res.data?.programs) {
              res.data?.programs.forEach((p: any) =>
                mappedResults.push({
                  id: `program_${p.id}`,
                  title: p.title,
                  type: 'content',
                  href: `/admin/programs/${p.id}`,
                })
              );
            }
            if (res.data?.events) {
              res.data?.events.forEach((e: any) =>
                mappedResults.push({
                  id: `event_${e.id}`,
                  title: e.title,
                  type: 'content',
                  href: `/admin/dashboard/events/${e.id}`,
                })
              );
            }
            if (res.data?.campaigns) {
              res.data?.campaigns.forEach((c: any) =>
                mappedResults.push({
                  id: `campaign_${c.id}`,
                  title: c.title,
                  type: 'content',
                  href: `/admin/dashboard/campaigns/${c.id}`,
                })
              );
            }
            if (res.data?.media) {
              res.data?.media.forEach((m: any) =>
                mappedResults.push({
                  id: `media_${m.id}`,
                  title: m.title || m.file_name,
                  type: 'media',
                  href: `/admin/dashboard/media`,
                })
              );
            }
            if (res.data?.donations) {
              res.data?.donations.forEach((d: any) =>
                mappedResults.push({
                  id: `donation_${d.id}`,
                  title: `Donation: ${d.amount}`,
                  type: 'donation',
                  href: `/admin/dashboard/donations`,
                })
              );
            }
            if (res.data?.volunteers) {
              res.data?.volunteers.forEach((v: any) =>
                mappedResults.push({
                  id: `volunteer_${v.id}`,
                  title: `Volunteer ID: ${v.id}`,
                  type: 'user',
                  href: `/admin/volunteers`,
                })
              );
            }
            setResults(mappedResults.slice(0, 15));
          }
        } catch {
          toast.error('Search failed');
        }
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const handleSelect = (href: string) => {
    setIsOpen(false);
    router.push(href);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'content':
        return <FileText size={16} className="text-blue-500" />;
      case 'user':
        return <Users size={16} className="text-green-500" />;
      case 'setting':
        return <Settings size={16} className="text-gray-500" />;
      case 'donation':
        return <DollarSign size={16} className="text-emerald-500" />;
      case 'media':
        return <ImageIcon size={16} className="text-purple-500" />;
      default:
        return <FileText size={16} />;
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-zinc-900/50 backdrop-blur-sm transition-opacity"
        onClick={() => setIsOpen(false)}
      />
      <div className="fixed left-1/2 top-20 z-50 w-full max-w-xl -translate-x-1/2 rounded-xl bg-white shadow-2xl ring-1 ring-black/5 duration-200 animate-in fade-in zoom-in-95 dark:bg-zinc-900">
        <div className="flex items-center border-b border-zinc-100 px-4 py-3 dark:border-zinc-800">
          <Search size={20} className="text-zinc-400" />
          <input
            ref={inputRef}
            type="text"
            className="ml-3 flex-1 border-0 bg-transparent text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-0 dark:text-zinc-50 sm:text-sm"
            placeholder="Search anything... (Ctrl+K)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {isPending && <Loader2 size={18} className="mr-2 animate-spin text-zinc-400" />}
          <button
            onClick={() => setIsOpen(false)}
            className="rounded-md p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-500 dark:hover:bg-zinc-800"
          >
            <X size={18} />
          </button>
        </div>

        {query && results.length > 0 && (
          <div className="max-h-80 overflow-y-auto p-2">
            <h3 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Results
            </h3>
            <ul className="space-y-1">
              {results.map((result) => (
                <li key={result.id}>
                  <button
                    onClick={() => handleSelect(result.href)}
                    className="group flex w-full items-center rounded-md px-3 py-2 text-left text-sm text-zinc-700 hover:bg-indigo-50 hover:text-indigo-900 dark:text-zinc-300 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-300"
                  >
                    <span className="mr-3 flex h-6 w-6 items-center justify-center rounded-md bg-white shadow-sm ring-1 ring-black/5 group-hover:ring-indigo-100 dark:bg-zinc-800 dark:ring-white/10">
                      {getIcon(result.type)}
                    </span>
                    <span className="flex-1">{result.title}</span>
                    <ChevronRight
                      size={16}
                      className="text-zinc-400 opacity-0 transition-opacity group-hover:opacity-100"
                    />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {query && results.length === 0 && !isPending && (
          <div className="px-4 py-10 text-center sm:px-14">
            <Search size={40} className="mx-auto text-zinc-300 dark:text-zinc-600" />
            <p className="mt-4 text-sm text-zinc-900 dark:text-zinc-200">
              No results found for &quot;{query}&quot;
            </p>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              Please try a different search term.
            </p>
          </div>
        )}

        {!query && (
          <div className="px-4 py-4">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Quick Links
            </h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleSelect('/admin/news/new')}
                className="inline-flex items-center rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
              >
                Create News
              </button>
              <button
                onClick={() => handleSelect('/admin/volunteers')}
                className="inline-flex items-center rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
              >
                Manage Volunteers
              </button>
              <button
                onClick={() => handleSelect('/admin/settings')}
                className="inline-flex items-center rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
              >
                Settings
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
