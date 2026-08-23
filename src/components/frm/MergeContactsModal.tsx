'use client';
/* eslint-disable no-console */

import { AlertTriangle, ArrowRight, GitMerge, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { ContactAvatar } from './ContactAvatar';

interface MergeContactItem {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  photoUrl?: string;
}

interface MergeContactsModalProps {
  isOpen: boolean;
  onClose: () => void;
  sourceContact: MergeContactItem | null;
  targetContact: MergeContactItem | null;
  onMerge: (survivingId: string, deletedId: string) => Promise<void>;
}

export function MergeContactsModal({
  isOpen,
  onClose,
  sourceContact,
  targetContact,
  onMerge,
}: MergeContactsModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [direction, setDirection] = useState<'source-to-target' | 'target-to-source'>('source-to-target');

  const survivingContact = direction === 'source-to-target' ? targetContact : sourceContact;
  const deletedContact = direction === 'source-to-target' ? sourceContact : targetContact;

  const handleMerge = async () => {
    if (!survivingContact || !deletedContact) return;
    
    setIsSubmitting(true);
    try {
      await onMerge(survivingContact.id, deletedContact.id);
      onClose();
    } catch (error) {
      console.error('Merge failed', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!sourceContact || !targetContact) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            <GitMerge className="w-5 h-5 mr-2 text-primary" />
            Merge Contacts
          </DialogTitle>
          <DialogDescription>
            Select which contact record should survive. The deleted record&apos;s timeline, donations, event attendances, and relationships will be automatically transferred to the surviving record.
          </DialogDescription>
        </DialogHeader>

        <div className="my-6">
          <div className="flex items-center justify-between gap-4 p-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-200 dark:border-zinc-800">
            {/* Source Contact */}
            <div 
              className={`flex-1 p-4 rounded-lg border-2 cursor-pointer transition-all ${direction === 'target-to-source' ? 'border-primary bg-white dark:bg-zinc-900 shadow-sm' : 'border-transparent hover:border-zinc-300'}`}
              onClick={() => setDirection('target-to-source')}
            >
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-3">
                  <ContactAvatar name={sourceContact.name} photoUrl={sourceContact.photoUrl} size="lg" />
                  {direction === 'target-to-source' && (
                    <div className="absolute -top-2 -right-2 bg-primary text-white rounded-full p-0.5">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  )}
                </div>
                <h4 className="font-semibold">{sourceContact.name}</h4>
                <p className="text-xs text-zinc-500 mt-1">{sourceContact.email || 'No email'}</p>
                {direction === 'target-to-source' ? (
                  <span className="mt-3 text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">Surviving Record</span>
                ) : (
                  <span className="mt-3 text-xs font-medium text-red-600 bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded-full">Will be merged & hidden</span>
                )}
              </div>
            </div>

            <div className="flex-shrink-0 flex flex-col items-center justify-center px-2">
              <ArrowRight className={`w-6 h-6 text-zinc-400 transition-transform ${direction === 'target-to-source' ? 'rotate-180' : ''}`} />
            </div>

            {/* Target Contact */}
            <div 
              className={`flex-1 p-4 rounded-lg border-2 cursor-pointer transition-all ${direction === 'source-to-target' ? 'border-primary bg-white dark:bg-zinc-900 shadow-sm' : 'border-transparent hover:border-zinc-300'}`}
              onClick={() => setDirection('source-to-target')}
            >
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-3">
                  <ContactAvatar name={targetContact.name} photoUrl={targetContact.photoUrl} size="lg" />
                  {direction === 'source-to-target' && (
                    <div className="absolute -top-2 -right-2 bg-primary text-white rounded-full p-0.5">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  )}
                </div>
                <h4 className="font-semibold">{targetContact.name}</h4>
                <p className="text-xs text-zinc-500 mt-1">{targetContact.email || 'No email'}</p>
                {direction === 'source-to-target' ? (
                  <span className="mt-3 text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">Surviving Record</span>
                ) : (
                  <span className="mt-3 text-xs font-medium text-red-600 bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded-full">Will be merged & hidden</span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/50 p-4 rounded-lg flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-amber-800 dark:text-amber-500">
            <p className="font-semibold mb-1">This action cannot be undone.</p>
            <p>
              The record for <strong>{deletedContact?.name}</strong> will be marked as merged and hidden from default views. All of its history will be moved to <strong>{survivingContact?.name}</strong>.
            </p>
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleMerge} disabled={isSubmitting} className="bg-primary hover:bg-primary/90">
            {isSubmitting ? 'Merging...' : 'Confirm Merge'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
