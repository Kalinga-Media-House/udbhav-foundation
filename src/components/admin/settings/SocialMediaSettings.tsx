'use client';

import { 
  Plus, Edit2, Trash2, ArrowUp, ArrowDown, ExternalLink, 
  Eye, EyeOff, MessageCircle, Send, MessageSquare, 
  Loader2, Radio
} from 'lucide-react';
import React, { useState, useTransition } from 'react';

import { Facebook, Instagram, Youtube, Twitter, Linkedin, Github, GenericWeb } from '@/components/shared/BrandIcons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  addSocialLink, updateSocialLink, deleteSocialLink, reorderSocialLinks 
} from '@/features/social-links/actions';
import type { SocialLinkRow } from '@/features/social-links/repository';

interface Props {
  initialLinks: SocialLinkRow[];
}

const AVAILABLE_PLATFORMS = [
  { id: 'facebook', name: 'Facebook', icon: Facebook },
  { id: 'instagram', name: 'Instagram', icon: Instagram },
  { id: 'youtube', name: 'YouTube', icon: Youtube },
  { id: 'twitter', name: 'X / Twitter', icon: Twitter },
  { id: 'linkedin', name: 'LinkedIn', icon: Linkedin },
  { id: 'whatsapp', name: 'WhatsApp', icon: MessageCircle },
  { id: 'telegram', name: 'Telegram', icon: Send },
  { id: 'threads', name: 'Threads', icon: MessageSquare },
  { id: 'pinterest', name: 'Pinterest', icon: GenericWeb }, 
  { id: 'snapchat', name: 'Snapchat', icon: GenericWeb },
  { id: 'reddit', name: 'Reddit', icon: GenericWeb },
  { id: 'github', name: 'GitHub', icon: Github },
  { id: 'google_business', name: 'Google Business', icon: GenericWeb },
  { id: 'website', name: 'Website', icon: GenericWeb },
  { id: 'medium', name: 'Medium', icon: GenericWeb },
  { id: 'spotify', name: 'Spotify', icon: Radio },
  { id: 'apple_podcasts', name: 'Apple Podcasts', icon: Radio },
  { id: 'discord', name: 'Discord', icon: MessageSquare },
];

export function SocialMediaSettings({ initialLinks }: Props) {
  const [links, setLinks] = useState<SocialLinkRow[]>(initialLinks);
  const [isPending, startTransition] = useTransition();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [platform, setPlatform] = useState(AVAILABLE_PLATFORMS[0].id);
  const [url, setUrl] = useState('');
  const [isVisible, setIsVisible] = useState(true);
  const [error, setError] = useState('');

  const resetForm = () => {
    setPlatform(AVAILABLE_PLATFORMS[0].id);
    setUrl('');
    setIsVisible(true);
    setError('');
    setIsAdding(false);
    setEditingId(null);
  };

  const openAdd = () => {
    resetForm();
    setIsAdding(true);
  };

  const openEdit = (link: SocialLinkRow) => {
    setEditingId(link.id);
    setPlatform(link.platform);
    setUrl(link.url);
    setIsVisible(link.is_visible);
    setError('');
    setIsAdding(true);
  };

  const validateUrl = (urlStr: string) => {
    try {
      new URL(urlStr);
      return true;
    } catch {
      return false;
    }
  };

  const handleSave = () => {
    setError('');
    if (!url.trim()) {
      setError('URL is required.');
      return;
    }
    if (!validateUrl(url.trim())) {
      setError('Please enter a valid URL (include https://).');
      return;
    }

    startTransition(async () => {
      let res;
      if (editingId) {
        res = await updateSocialLink(editingId, { 
          platform, 
          url: url.trim(), 
          is_visible: isVisible 
        });
      } else {
        const order = links.length > 0 ? Math.max(...links.map(l => l.display_order)) + 1 : 1;
        res = await addSocialLink({
          platform,
          url: url.trim(),
          is_visible: isVisible,
          display_order: order,
        });
      }

      if (res.success) {
        // Optimistic local update is tricky without a full reload, 
        // but Next.js Server Actions with revalidatePath will refresh the page data.
        // We can just rely on the server refresh to update `initialLinks`, 
        // though it might need a page reload or we can just update local state.
        window.location.reload(); 
      } else {
        setError(res.error || 'Failed to save.');
      }
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to remove this social media link?')) return;
    startTransition(async () => {
      const res = await deleteSocialLink(id);
      if (res.success) {
        setLinks(links.filter(l => l.id !== id));
      } else {
        alert(res.error || 'Failed to delete');
      }
    });
  };

  const handleToggleVis = (id: string, currentVis: boolean) => {
    startTransition(async () => {
      setLinks(links.map(l => l.id === id ? { ...l, is_visible: !currentVis } : l));
      await updateSocialLink(id, { is_visible: !currentVis });
    });
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === links.length - 1) return;

    const newLinks = [...links];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap display orders
    const currentOrder = newLinks[index].display_order;
    const targetOrder = newLinks[targetIndex].display_order;
    
    newLinks[index].display_order = targetOrder;
    newLinks[targetIndex].display_order = currentOrder;

    // Swap positions in array for UI
    const temp = newLinks[index];
    newLinks[index] = newLinks[targetIndex];
    newLinks[targetIndex] = temp;

    setLinks(newLinks);

    startTransition(async () => {
      await reorderSocialLinks([
        { id: newLinks[index].id, display_order: newLinks[index].display_order },
        { id: newLinks[targetIndex].id, display_order: newLinks[targetIndex].display_order }
      ]);
    });
  };

  return (
    <section id="social" className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm mb-8">
      <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Social Media Links</h2>
          <p className="text-sm text-gray-500">Manage the social media icons displayed in the website footer.</p>
        </div>
        <Button onClick={openAdd} disabled={isAdding || isPending} size="sm">
          <Plus className="w-4 h-4 mr-2" /> Add Social Media
        </Button>
      </div>

      <div className="p-6">
        {isAdding && (
          <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50/30 shadow-sm">
            <h3 className="text-sm font-semibold mb-4">{editingId ? 'Edit Link' : 'Add New Link'}</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 items-end">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-700">Platform</label>
                <select 
                  value={platform} 
                  onChange={e => setPlatform(e.target.value)}
                  className="w-full h-9 rounded-md border border-gray-300 px-3 text-sm"
                  disabled={isPending}
                >
                  {AVAILABLE_PLATFORMS.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5 lg:col-span-2">
                <label className="text-xs font-medium text-gray-700">URL</label>
                <Input 
                  value={url} 
                  onChange={e => setUrl(e.target.value)}
                  placeholder="https://..." 
                  className="h-9"
                  disabled={isPending}
                />
              </div>
              <div className="flex items-center h-9 space-x-2">
                <label className="relative inline-flex cursor-pointer items-center">
                  <input 
                    type="checkbox" 
                    checked={isVisible} 
                    onChange={e => setIsVisible(e.target.checked)} 
                    className="peer sr-only" 
                    disabled={isPending}
                  />
                  <div className="peer h-5 w-9 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-indigo-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none"></div>
                </label>
                <span className="text-xs font-medium text-gray-700">Show on website</span>
              </div>
            </div>
            {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={resetForm} disabled={isPending}>Cancel</Button>
              <Button size="sm" onClick={handleSave} disabled={isPending}>
                {isPending && <Loader2 className="w-3 h-3 mr-2 animate-spin" />}
                Save
              </Button>
            </div>
          </div>
        )}

        {links.length === 0 && !isAdding ? (
          <div className="text-center py-8 text-gray-500 text-sm">
            No social media links configured. Click &quot;Add Social Media&quot; to start.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-100 text-gray-500">
                <tr>
                  <th className="pb-3 font-medium px-2">Platform</th>
                  <th className="pb-3 font-medium px-2">URL</th>
                  <th className="pb-3 font-medium px-2">Visible</th>
                  <th className="pb-3 font-medium px-2">Order</th>
                  <th className="pb-3 font-medium px-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {links.map((link, index) => {
                  const plat = AVAILABLE_PLATFORMS.find(p => p.id === link.platform);
                  const Icon = plat?.icon || GenericWeb;
                  
                  return (
                    <tr key={link.id} className="group hover:bg-gray-50/50">
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded bg-gray-100 text-gray-600">
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className="font-medium">{plat?.name || link.platform}</span>
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline flex items-center gap-1 max-w-[200px] truncate" title={link.url}>
                          {link.url}
                          <ExternalLink className="w-3 h-3 flex-shrink-0" />
                        </a>
                      </td>
                      <td className="py-3 px-2">
                        <button 
                          onClick={() => handleToggleVis(link.id, link.is_visible)}
                          disabled={isPending}
                          className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium border ${
                            link.is_visible ? 'border-green-200 bg-green-50 text-green-700' : 'border-gray-200 bg-gray-50 text-gray-600'
                          }`}
                        >
                          {link.is_visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                          {link.is_visible ? 'ON' : 'OFF'}
                        </button>
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-1">
                          <button 
                            onClick={() => handleMove(index, 'up')}
                            disabled={index === 0 || isPending}
                            className="p-1 rounded hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <span className="text-xs text-gray-500 w-4 text-center">{index + 1}</span>
                          <button 
                            onClick={() => handleMove(index, 'down')}
                            disabled={index === links.length - 1 || isPending}
                            className="p-1 rounded hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                      <td className="py-3 px-2 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => openEdit(link)} disabled={isPending || isAdding} className="h-8 px-2 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(link.id)} disabled={isPending || isAdding} className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
