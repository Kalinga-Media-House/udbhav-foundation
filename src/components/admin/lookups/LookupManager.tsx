/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
/* eslint-disable no-console */

import { Plus, Search, Edit2, Trash2, FolderTree, Tag, Loader2, Save } from 'lucide-react';
import React, { useState, useEffect } from 'react';

import {
  getTaxonomiesAction,
  getTaxonomyTermsAction,
  createTaxonomyAction,
  createTaxonomyTermAction,
  deleteTaxonomyTermAction,
} from '@/features/lookups/actions';
import type { TaxonomyRow, TaxonomyTermRow } from '@/features/lookups/repository';
import { exportToCSV } from '@/lib/utils/csv-export';

export default function LookupManager() {
  const [taxonomies, setTaxonomies] = useState<TaxonomyRow[]>([]);
  const [selectedTaxonomy, setSelectedTaxonomy] = useState<TaxonomyRow | null>(null);
  const [terms, setTerms] = useState<TaxonomyTermRow[]>([]);
  const [isLoadingTaxonomies, setIsLoadingTaxonomies] = useState(true);
  const [isLoadingTerms, setIsLoadingTerms] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Pagination & Bulk actions
  const [selectedTermIds, setSelectedTermIds] = useState<Set<string>>(new Set());
  const [termPage, setTermPage] = useState(1);
  const termsPerPage = 10;

  // Modals / forms state
  const [isAddingTaxonomy, setIsAddingTaxonomy] = useState(false);
  const [newTaxonomyName, setNewTaxonomyName] = useState('');

  const [isAddingTerm, setIsAddingTerm] = useState(false);
  const [newTermName, setNewTermName] = useState('');

  useEffect(() => {
    loadTaxonomies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadTaxonomies = async () => {
    setIsLoadingTaxonomies(true);
    try {
      const res = await getTaxonomiesAction();
      const data = (res as any).data || res || [];
      setTaxonomies(data as any);
      if (data.length > 0 && !selectedTaxonomy) {
        handleSelectTaxonomy(data[0]);
      }
    } catch (error) {
      console.error('Failed to load taxonomies:', error);
    } finally {
      setIsLoadingTaxonomies(false);
    }
  };

  const handleSelectTaxonomy = async (taxonomy: TaxonomyRow) => {
    setSelectedTaxonomy(taxonomy);
    setIsLoadingTerms(true);
    setSelectedTermIds(new Set());
    setTermPage(1);
    try {
      const res = await getTaxonomyTermsAction(taxonomy.id);
      const data = (res as any).data || res || [];
      setTerms(data as any);
    } catch (error) {
      console.error('Failed to load terms:', error);
    } finally {
      setIsLoadingTerms(false);
    }
  };

  const handleAddTaxonomy = async () => {
    if (!newTaxonomyName.trim()) return;
    try {
      await createTaxonomyAction({
        display_name: newTaxonomyName,
        slug: newTaxonomyName.toLowerCase().replace(/\s+/g, '_'),
      });
      setNewTaxonomyName('');
      setIsAddingTaxonomy(false);
      loadTaxonomies();
    } catch (error) {
      console.error('Failed to create taxonomy:', error);
    }
  };

  const handleAddTerm = async () => {
    if (!newTermName.trim() || !selectedTaxonomy) return;
    try {
      await createTaxonomyTermAction({
        taxonomy_id: selectedTaxonomy.id,
        display_name: newTermName,
      });
      setNewTermName('');
      setIsAddingTerm(false);
      handleSelectTaxonomy(selectedTaxonomy);
    } catch (error) {
      console.error('Failed to create term:', error);
    }
  };

  const handleDeleteTerm = async (id: string) => {
    if (!confirm('Are you sure you want to delete this term?')) return;
    try {
      await deleteTaxonomyTermAction(id);
      if (selectedTaxonomy) {
        handleSelectTaxonomy(selectedTaxonomy);
      }
    } catch (error) {
      console.error('Failed to delete term:', error);
    }
  };

  const handleBulkDeleteTerms = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedTermIds.size} terms?`)) return;
    try {
      for (const id of Array.from(selectedTermIds)) {
        await deleteTaxonomyTermAction(id);
      }
      setSelectedTermIds(new Set());
      if (selectedTaxonomy) {
        handleSelectTaxonomy(selectedTaxonomy);
      }
    } catch (error) {
      console.error('Failed to bulk delete terms:', error);
    }
  };

  const handleExportTerms = () => {
    const dataToExport =
      selectedTermIds.size > 0 ? terms.filter((t) => selectedTermIds.has(t.id)) : terms;
    exportToCSV(dataToExport, `${(selectedTaxonomy as any)?.slug || 'terms'}_export`);
  };

  const filteredTerms = terms.filter(
    (t) =>
      (t as any).display_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t as any).name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedTerms = filteredTerms.slice(
    (termPage - 1) * termsPerPage,
    termPage * termsPerPage
  );

  return (
    <div className="flex h-[calc(100vh-8rem)] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* Sidebar: Taxonomies */}
      <div className="flex w-64 flex-col border-r border-slate-200 bg-slate-50">
        <div className="flex items-center justify-between border-b border-slate-200 bg-white p-4">
          <h2 className="flex items-center gap-2 font-semibold text-slate-800">
            <FolderTree className="h-5 w-5 text-indigo-500" />
            Taxonomies
          </h2>
          <button
            onClick={() => setIsAddingTaxonomy(true)}
            className="rounded p-1 text-slate-500 transition-colors hover:bg-slate-100 hover:text-indigo-600"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>

        {isAddingTaxonomy && (
          <div className="border-b border-slate-200 bg-indigo-50 p-3">
            <input
              type="text"
              autoFocus
              value={newTaxonomyName}
              onChange={(e) => setNewTaxonomyName(e.target.value)}
              placeholder="Taxonomy name..."
              className="mb-2 w-full rounded border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
              onKeyDown={(e) => e.key === 'Enter' && handleAddTaxonomy()}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsAddingTaxonomy(false)}
                className="text-xs text-slate-500 hover:text-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTaxonomy}
                className="rounded bg-indigo-600 px-2 py-1 text-xs text-white hover:bg-indigo-700"
              >
                Save
              </button>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-2">
          {isLoadingTaxonomies ? (
            <div className="flex justify-center p-4">
              <Loader2 className="h-5 w-5 animate-spin text-indigo-500" />
            </div>
          ) : (
            <ul className="space-y-1">
              {taxonomies.map((tax) => (
                <li key={tax.id}>
                  <button
                    onClick={() => handleSelectTaxonomy(tax)}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                      selectedTaxonomy?.id === tax.id
                        ? 'bg-indigo-100 font-medium text-indigo-700'
                        : 'text-slate-600 hover:bg-slate-200/50'
                    }`}
                  >
                    <span className="truncate">
                      {(tax as any).display_name || (tax as any).name}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Main Content: Terms */}
      <div className="flex flex-1 flex-col bg-white">
        {selectedTaxonomy ? (
          <>
            <div className="flex flex-col items-start justify-between gap-4 border-b border-slate-200 p-6 sm:flex-row sm:items-center">
              <div>
                <h1 className="text-2xl font-bold text-slate-800">
                  {(selectedTaxonomy as any).display_name || (selectedTaxonomy as any).name}
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  System name:{' '}
                  <code className="rounded bg-slate-100 px-1 py-0.5 text-slate-600">
                    {(selectedTaxonomy as any).slug || (selectedTaxonomy as any).system_name}
                  </code>
                </p>
              </div>
              <div className="flex gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search terms..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-64 rounded-lg border border-slate-300 py-2 pl-9 pr-4 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <button
                  onClick={() => setIsAddingTerm(true)}
                  className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
                >
                  <Plus className="h-4 w-4" />
                  Add Term
                </button>
                <button
                  onClick={handleExportTerms}
                  className="flex items-center gap-2 rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-200"
                >
                  Export CSV
                </button>
                {selectedTermIds.size > 0 && (
                  <button
                    onClick={handleBulkDeleteTerms}
                    className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
                  >
                    <Trash2 className="h-4 w-4" /> Delete ({selectedTermIds.size})
                  </button>
                )}
              </div>
            </div>

            <div className="flex flex-1 flex-col overflow-auto p-6">
              {isAddingTerm && (
                <div className="mb-6 flex items-end gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex-1">
                    <label className="mb-1 block text-xs font-medium text-slate-500">
                      New Term Name
                    </label>
                    <input
                      type="text"
                      autoFocus
                      value={newTermName}
                      onChange={(e) => setNewTermName(e.target.value)}
                      placeholder="e.g. Active, Pending..."
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                      onKeyDown={(e) => e.key === 'Enter' && handleAddTerm()}
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsAddingTerm(false)}
                      className="rounded-lg px-4 py-2 text-sm text-slate-600 transition-colors hover:bg-slate-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddTerm}
                      className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white transition-colors hover:bg-indigo-700"
                    >
                      <Save className="h-4 w-4" /> Save
                    </button>
                  </div>
                </div>
              )}

              {isLoadingTerms ? (
                <div className="flex h-48 flex-1 items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
                </div>
              ) : filteredTerms.length > 0 ? (
                <div className="flex flex-1 flex-col">
                  <div className="flex-1 overflow-hidden rounded-xl border border-slate-200">
                    <table className="w-full text-left text-sm">
                      <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
                        <tr>
                          <th className="w-[50px] px-4 py-3">
                            <input
                              type="checkbox"
                              checked={
                                paginatedTerms.length > 0 &&
                                selectedTermIds.size === paginatedTerms.length
                              }
                              onChange={(e) => {
                                if (e.target.checked)
                                  setSelectedTermIds(new Set(paginatedTerms.map((t) => t.id)));
                                else setSelectedTermIds(new Set());
                              }}
                              className="rounded border-slate-300"
                            />
                          </th>
                          <th className="px-4 py-3 font-medium">Term Name</th>
                          <th className="px-4 py-3 text-right font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {paginatedTerms.map((term) => (
                          <tr key={term.id} className="transition-colors hover:bg-slate-50/50">
                            <td className="px-4 py-3">
                              <input
                                type="checkbox"
                                checked={selectedTermIds.has(term.id)}
                                onChange={(e) => {
                                  const newSet = new Set(selectedTermIds);
                                  if (e.target.checked) newSet.add(term.id);
                                  else newSet.delete(term.id);
                                  setSelectedTermIds(newSet);
                                }}
                                className="rounded border-slate-300"
                              />
                            </td>
                            <td className="px-4 py-3 font-medium text-slate-700">
                              <div className="flex items-center gap-2">
                                <Tag className="h-4 w-4 text-slate-400" />
                                {(term as any).display_name || (term as any).name}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex justify-end gap-2">
                                <button
                                  className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-indigo-50 hover:text-indigo-600"
                                  title="Edit term"
                                >
                                  <Edit2 className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteTerm(term.id)}
                                  className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                                  title="Delete term"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination Controls */}
                  <div className="mt-4 flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <div className="text-sm text-slate-500">
                      Showing {(termPage - 1) * termsPerPage + 1} to{' '}
                      {Math.min(termPage * termsPerPage, filteredTerms.length)} of{' '}
                      {filteredTerms.length} terms
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="rounded border border-slate-300 bg-white px-3 py-1 text-sm disabled:opacity-50"
                        disabled={termPage === 1}
                        onClick={() => setTermPage((p) => p - 1)}
                      >
                        Previous
                      </button>
                      <button
                        className="rounded border border-slate-300 bg-white px-3 py-1 text-sm disabled:opacity-50"
                        disabled={termPage * termsPerPage >= filteredTerms.length}
                        onClick={() => setTermPage((p) => p + 1)}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border-2 border-dashed border-slate-200 py-12 text-center">
                  <Tag className="mx-auto mb-3 h-12 w-12 text-slate-300" />
                  <h3 className="text-lg font-medium text-slate-800">No terms found</h3>
                  <p className="mt-1 text-slate-500">There are no terms in this taxonomy yet.</p>
                  <button
                    onClick={() => setIsAddingTerm(true)}
                    className="mt-4 text-sm font-medium text-indigo-600 hover:text-indigo-700"
                  >
                    + Add your first term
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center text-slate-400">
            <FolderTree className="mb-4 h-16 w-16 text-slate-200" />
            <p className="text-lg">Select a taxonomy from the sidebar</p>
          </div>
        )}
      </div>
    </div>
  );
}
