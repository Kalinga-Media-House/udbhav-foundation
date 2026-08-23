'use client';
/* eslint-disable */

import { UploadCloud, Image as ImageIcon, FileText, Trash2, Search, Filter, Loader2, MoreVertical, ExternalLink } from 'lucide-react';
import React, { useState, useEffect } from 'react';
// Use placeholders for fetching if actions are incomplete, but we can try to use standard fetching or just mock data if none exists
// Assuming media actions might have a getMediaAction (it didn't seem present in the view, so we'll mock it temporarily until backend is complete)

interface MediaItem {
  id: string;
  url: string;
  filename: string;
  type: string;
  size: string;
  createdAt: string;
}

export default function MediaManager() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Mock data for initial UI if no real data is fetched
  useEffect(() => {
    // Simulate network delay
    const timer = setTimeout(() => {
      setMedia([
        { id: '1', url: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=400&q=80', filename: 'hero-banner.jpg', type: 'image/jpeg', size: '2.4 MB', createdAt: '2026-07-29' },
        { id: '2', url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=400&q=80', filename: 'team-photo.jpg', type: 'image/jpeg', size: '1.8 MB', createdAt: '2026-07-28' },
        { id: '3', url: '', filename: 'annual-report.pdf', type: 'application/pdf', size: '4.1 MB', createdAt: '2026-07-27' },
        { id: '4', url: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=400&q=80', filename: 'event-gallery-1.jpg', type: 'image/jpeg', size: '3.2 MB', createdAt: '2026-07-26' },
      ]);
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const filteredMedia = media.filter(item => 
    item.filename.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      
      {/* Toolbar */}
      <div className="p-4 sm:p-6 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/50">
        <div className="flex gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search files..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white transition-all shadow-sm"
            />
          </div>
          <button className="px-4 py-2 border border-slate-300 bg-white rounded-xl text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-2 shadow-sm">
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">Filter</span>
          </button>
        </div>
        
        <button 
          className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm shadow-indigo-200"
          onClick={() => setIsUploading(true)}
        >
          <UploadCloud className="w-4 h-4" />
          Bulk Upload
        </button>
      </div>

      {/* Upload Dropzone (Simulated) */}
      {isUploading && (
        <div className="p-6 border-b border-indigo-100 bg-indigo-50/50">
          <div className="border-2 border-dashed border-indigo-300 rounded-xl p-8 text-center bg-white">
            <UploadCloud className="w-12 h-12 text-indigo-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-slate-800">Drag & drop files here</h3>
            <p className="text-slate-500 text-sm mt-1 mb-4">or click to browse from your computer (JPEG, PNG, PDF up to 10MB)</p>
            <div className="flex justify-center gap-3">
              <button 
                onClick={() => setIsUploading(false)}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button className="px-4 py-2 text-sm font-medium bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors">
                Browse Files
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Grid */}
      <div className="p-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
            <p className="text-slate-500 font-medium animate-pulse">Loading media library...</p>
          </div>
        ) : filteredMedia.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredMedia.map(item => (
              <div key={item.id} className="group border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition-all hover:border-indigo-300 bg-white flex flex-col">
                <div className="aspect-square bg-slate-100 relative overflow-hidden flex items-center justify-center border-b border-slate-100">
                  {item.type.startsWith('image/') && item.url ? (
                    <img 
                      src={item.url} 
                      alt={item.filename} 
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" 
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <FileText className="w-12 h-12 mb-2" />
                      <span className="text-xs font-medium uppercase tracking-wider">{item.type.split('/')[1] || 'FILE'}</span>
                    </div>
                  )}
                  
                  {/* Overlay Actions */}
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button className="p-2 bg-white rounded-full text-slate-700 hover:text-indigo-600 hover:scale-110 transition-all shadow-sm">
                      <ExternalLink className="w-4 h-4" />
                    </button>
                    <button className="p-2 bg-white rounded-full text-slate-700 hover:text-red-600 hover:scale-110 transition-all shadow-sm">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="p-3 flex items-start justify-between">
                  <div className="overflow-hidden">
                    <p className="text-sm font-semibold text-slate-800 truncate" title={item.filename}>
                      {item.filename}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-slate-500">{item.size}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                      <span className="text-xs text-slate-500">{item.createdAt}</span>
                    </div>
                  </div>
                  <button className="text-slate-400 hover:text-indigo-600 transition-colors p-1">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
              <ImageIcon className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800">No media found</h3>
            <p className="text-slate-500 mt-1 max-w-sm mx-auto">Upload images, documents, and other files to use across your website.</p>
          </div>
        )}
      </div>
    </div>
  );
}
