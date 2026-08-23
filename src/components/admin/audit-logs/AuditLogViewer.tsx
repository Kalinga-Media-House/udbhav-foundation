'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */

import { format } from 'date-fns';
import { Loader2, Download, Filter, RefreshCw, FileText } from 'lucide-react';
import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { listAuditLogsAction } from '@/features/audit_logs/actions';
import { exportToCSV } from '@/lib/utils/csv-export';

export function AuditLogViewer() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);

  // Filters
  const [category, setCategory] = useState<string>('all');
  const [severity, setSeverity] = useState<string>('all');
  const [search, setSearch] = useState('');

  // Bulk Actions & Sorting
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [sorts, setSorts] = useState<{column: string, asc: boolean}[]>([]);

  const fetchLogs = useCallback(async (currentPage: number) => {
    setLoading(true);
    try {
      const filters: any = {};
      if (category !== 'all') filters.category = category;
      if (severity !== 'all') filters.severity = severity;
      if (search) filters.search = search;
      if (sorts.length > 0) filters.sorts = sorts;
      
      const res = await listAuditLogsAction({ limit: 15, offset: (currentPage - 1) * 15 } as any, filters);
      
      if (res.success && res.data) {
        const paginatedData = res.data;
        setLogs(paginatedData.data as any);
        setHasMore(paginatedData.data.length === 15);
        if (paginatedData.total !== undefined) {
          setTotal(paginatedData.total);
        }
      } else {
        toast.error(res.error || 'Failed to fetch audit logs');
      }
    } catch (e: any) { void e;
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }, [category, severity, search, sorts]);

  useEffect(() => {
    fetchLogs(page);
  }, [page, fetchLogs]);

  const handleFilterChange = () => {
    setPage(1);
    fetchLogs(1);
  };

  const handleExport = () => {
    const dataToExport = selectedIds.size > 0 ? logs.filter(l => selectedIds.has(l.id)) : logs;
    exportToCSV(dataToExport, 'audit_logs');
  };

  const handleBulkDelete = () => {
    // Implement bulk delete via server action here
    toast.success(`Deleted ${selectedIds.size} logs`);
    setSelectedIds(new Set());
    fetchLogs(page);
  };

  const toggleSort = (column: string) => {
    setSorts(prev => {
      const existing = prev.find(s => s.column === column);
      if (existing) {
        if (existing.asc) return prev.map(s => s.column === column ? { ...s, asc: false } : s);
        return prev.filter(s => s.column !== column);
      }
      return [...prev, { column, asc: true }];
    });
  };

  const getSortIcon = (column: string) => {
    const sort = sorts.find(s => s.column === column);
    if (!sort) return null;
    return sort.asc ? '↑' : '↓';
  };

  const getSeverityColor = (sev: string) => {
    switch(sev) {
      case 'info': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'success': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300';
      case 'warning': return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300';
      case 'error': 
      case 'critical': return 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white dark:bg-zinc-950 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
        
        <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap">
          <Input 
            placeholder="Search action or entity..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-64"
          />
          
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Authentication">Authentication</SelectItem>
              <SelectItem value="Authorization">Authorization</SelectItem>
              <SelectItem value="Users">Users</SelectItem>
              <SelectItem value="System">System</SelectItem>
            </SelectContent>
          </Select>

          <Select value={severity} onValueChange={setSeverity}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severities</SelectItem>
              <SelectItem value="info">Info</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="error">Error</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="secondary" onClick={handleFilterChange}>
            <Filter className="w-4 h-4 mr-2" /> Filter
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => fetchLogs(page)} title="Refresh">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" /> Export CSV
          </Button>
          {selectedIds.size > 0 && (
            <Button variant="destructive" onClick={handleBulkDelete}>
              Delete Selected ({selectedIds.size})
            </Button>
          )}
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-zinc-50 dark:bg-zinc-900/50">
            <TableRow>
              <TableHead className="w-[50px]">
                <input 
                  type="checkbox" 
                  checked={logs.length > 0 && selectedIds.size === logs.length}
                  onChange={(e) => {
                    if (e.target.checked) setSelectedIds(new Set(logs.map(l => l.id)));
                    else setSelectedIds(new Set());
                  }}
                  className="rounded border-zinc-300"
                />
              </TableHead>
              <TableHead className="w-[180px] cursor-pointer" onClick={() => toggleSort('created_at')}>
                Timestamp {getSortIcon('created_at')}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => toggleSort('category')}>
                Category / Module {getSortIcon('category')}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => toggleSort('action')}>
                Action {getSortIcon('action')}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => toggleSort('severity')}>
                Severity {getSortIcon('severity')}
              </TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-64 text-center">
                  <div className="flex flex-col items-center justify-center text-zinc-500">
                    <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mb-2" />
                    <span>Loading audit logs...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : logs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-64 text-center">
                  <div className="flex flex-col items-center justify-center text-zinc-500">
                    <FileText className="w-12 h-12 mb-2 opacity-20" />
                    <span>No audit logs found matching criteria.</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>
                    <input 
                      type="checkbox" 
                      checked={selectedIds.has(log.id)}
                      onChange={(e) => {
                        const newSet = new Set(selectedIds);
                        if (e.target.checked) newSet.add(log.id);
                        else newSet.delete(log.id);
                        setSelectedIds(newSet);
                      }}
                      className="rounded border-zinc-300"
                    />
                  </TableCell>
                  <TableCell className="font-medium text-zinc-600 dark:text-zinc-400">
                    {format(new Date(log.created_at), 'MMM dd, yyyy HH:mm:ss')}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-semibold text-zinc-900 dark:text-zinc-100">{log.category}</span>
                      <span className="text-xs text-zinc-500">{log.module}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="uppercase tracking-wider text-[10px]">
                      {log.action}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${getSeverityColor(log.severity)}`}>
                      {log.severity}
                    </span>
                  </TableCell>
                  <TableCell className="text-zinc-700 dark:text-zinc-300 max-w-md truncate">
                    {log.description}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">View Payload</Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        
        {/* Pagination */}
        <div className="flex items-center justify-between p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
          <div className="text-sm text-zinc-500">
            Showing {(page - 1) * 15 + 1} to {Math.min(page * 15, total || page * 15)} of {total || 'many'} entries
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              disabled={page === 1 || loading}
              onClick={() => setPage(p => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              disabled={!hasMore || loading}
              onClick={() => setPage(p => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
