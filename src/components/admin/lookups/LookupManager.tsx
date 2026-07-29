'use client';

import { Plus, Search, Edit2, Trash2, FolderTree, Tag, Loader2, Save } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { exportToCSV } from '@/lib/utils/csv-export';

import { 
  getTaxonomiesAction, 
  getTaxonomyTermsAction,
  createTaxonomyAction,
  createTaxonomyTermAction,
  
  deleteTaxonomyTermAction
} from '@/features/lookups/actions';
import type { TaxonomyRow, TaxonomyTermRow } from '@/features/lookups/repository';

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
    const dataToExport = selectedTermIds.size > 0 ? terms.filter(t => selectedTermIds.has(t.id)) : terms;
    exportToCSV(dataToExport, `${(selectedTaxonomy as any)?.slug || 'terms'}_export`);
  };

  const filteredTerms = terms.filter(t => 
    (t as any).display_name?.toLowerCase().includes(searchQuery.toLowerCase()) || (t as any).name?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const paginatedTerms = filteredTerms.slice((termPage - 1) * termsPerPage, termPage * termsPerPage);

  return (
    <div className="flex h-[calc(100vh-8rem)] bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      
      {/* Sidebar: Taxonomies */}
      <div className="w-64 border-r border-slate-200 bg-slate-50 flex flex-col">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-white">
          <h2 className="font-semibold text-slate-800 flex items-center gap-2">
            <FolderTree className="w-5 h-5 text-indigo-500" />
            Taxonomies
          </h2>
          <button 
            onClick={() => setIsAddingTaxonomy(true)}
            className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-indigo-600 transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {isAddingTaxonomy && (
          <div className="p-3 border-b border-slate-200 bg-indigo-50">
            <input
              type="text"
              autoFocus
              value={newTaxonomyName}
              onChange={(e) => setNewTaxonomyName(e.target.value)}
              placeholder="Taxonomy name..."
              className="w-full px-3 py-1.5 text-sm rounded border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none mb-2"
              onKeyDown={(e) => e.key === 'Enter' && handleAddTaxonomy()}
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setIsAddingTaxonomy(false)} className="text-xs text-slate-500 hover:text-slate-700">Cancel</button>
              <button onClick={handleAddTaxonomy} className="text-xs bg-indigo-600 text-white px-2 py-1 rounded hover:bg-indigo-700">Save</button>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-2">
          {isLoadingTaxonomies ? (
            <div className="flex justify-center p-4">
              <Loader2 className="w-5 h-5 text-indigo-500 animate-spin" />
            </div>
          ) : (
            <ul className="space-y-1">
              {taxonomies.map(tax => (
                <li key={tax.id}>
                  <button
                    onClick={() => handleSelectTaxonomy(tax)}
                    className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors flex items-center justify-between ${
                      selectedTaxonomy?.id === tax.id 
                        ? 'bg-indigo-100 text-indigo-700 font-medium' 
                        : 'text-slate-600 hover:bg-slate-200/50'
                    }`}
                  >
                    <span className="truncate">{(tax as any).display_name || (tax as any).name}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Main Content: Terms */}
      <div className="flex-1 flex flex-col bg-white">
        {selectedTaxonomy ? (
          <>
            <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-800">{(selectedTaxonomy as any).display_name || (selectedTaxonomy as any).name}</h1>
                <p className="text-sm text-slate-500 mt-1">System name: <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-600">{(selectedTaxonomy as any).slug || (selectedTaxonomy as any).system_name}</code></p>
              </div>
              <div className="flex gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input 
                    type="text" 
                    placeholder="Search terms..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none w-64"
                  />
                </div>
                <button 
                  onClick={() => setIsAddingTerm(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Term
                </button>
                <button 
                  onClick={handleExportTerms}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                >
                  Export CSV
                </button>
                {selectedTermIds.size > 0 && (
                  <button 
                    onClick={handleBulkDeleteTerms}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" /> Delete ({selectedTermIds.size})
                  </button>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-auto p-6 flex flex-col">
              {isAddingTerm && (
                <div className="mb-6 bg-slate-50 border border-slate-200 p-4 rounded-xl flex items-end gap-4">
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-slate-500 mb-1">New Term Name</label>
                    <input
                      type="text"
                      autoFocus
                      value={newTermName}
                      onChange={(e) => setNewTermName(e.target.value)}
                      placeholder="e.g. Active, Pending..."
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                      onKeyDown={(e) => e.key === 'Enter' && handleAddTerm()}
                    />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setIsAddingTerm(false)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">Cancel</button>
                    <button onClick={handleAddTerm} className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2">
                      <Save className="w-4 h-4" /> Save
                    </button>
                  </div>
                </div>
              )}

              {isLoadingTerms ? (
                <div className="flex justify-center items-center h-48 flex-1">
                  <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                </div>
              ) : filteredTerms.length > 0 ? (
                <div className="flex flex-col flex-1">
                  <div className="border border-slate-200 rounded-xl overflow-hidden flex-1">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                        <tr>
                          <th className="px-4 py-3 w-[50px]">
                            <input 
                              type="checkbox" 
                              checked={paginatedTerms.length > 0 && selectedTermIds.size === paginatedTerms.length}
                              onChange={(e) => {
                                if (e.target.checked) setSelectedTermIds(new Set(paginatedTerms.map(t => t.id)));
                                else setSelectedTermIds(new Set());
                              }}
                              className="rounded border-slate-300"
                            />
                          </th>
                          <th className="px-4 py-3 font-medium">Term Name</th>
                          <th className="px-4 py-3 font-medium text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {paginatedTerms.map(term => (
                          <tr key={term.id} className="hover:bg-slate-50/50 transition-colors">
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
                                <Tag className="w-4 h-4 text-slate-400" />
                                {(term as any).display_name || (term as any).name}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex justify-end gap-2">
                                <button 
                                  className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                  title="Edit term"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => handleDeleteTerm(term.id)}
                                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Delete term"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  {/* Pagination Controls */}
                  <div className="flex items-center justify-between p-4 border border-slate-200 bg-slate-50 mt-4 rounded-xl">
                    <div className="text-sm text-slate-500">
                      Showing {(termPage - 1) * termsPerPage + 1} to {Math.min(termPage * termsPerPage, filteredTerms.length)} of {filteredTerms.length} terms
                    </div>
                    <div className="flex gap-2">
                      <button 
                        className="px-3 py-1 bg-white border border-slate-300 rounded text-sm disabled:opacity-50"
                        disabled={termPage === 1}
                        onClick={() => setTermPage(p => p - 1)}
                      >
                        Previous
                      </button>
                      <button 
                        className="px-3 py-1 bg-white border border-slate-300 rounded text-sm disabled:opacity-50"
                        disabled={termPage * termsPerPage >= filteredTerms.length}
                        onClick={() => setTermPage(p => p + 1)}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl">
                  <Tag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-slate-800">No terms found</h3>
                  <p className="text-slate-500 mt-1">There are no terms in this taxonomy yet.</p>
                  <button 
                    onClick={() => setIsAddingTerm(true)}
                    className="mt-4 text-indigo-600 hover:text-indigo-700 font-medium text-sm"
                  >
                    + Add your first term
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
            <FolderTree className="w-16 h-16 mb-4 text-slate-200" />
            <p className="text-lg">Select a taxonomy from the sidebar</p>
          </div>
        )}
      </div>
    </div>
  );
}
