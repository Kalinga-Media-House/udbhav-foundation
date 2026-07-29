'use client';

import { Pin, Send } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface Note {
  id: string;
  note_content: string;
  is_pinned: boolean;
  note_type: string;
  created_at: string;
  created_by?: { name: string; avatar?: string };
}

interface NotesPanelProps {
  contactId: string;
  notes: Note[];
  onAddNote?: (content: string, isPinned: boolean) => Promise<void>;
  onTogglePin?: (noteId: string, currentPinStatus: boolean) => Promise<void>;
}

export function NotesPanel({ contactId: _c, notes, onAddNote, onTogglePin }: NotesPanelProps) {
  const [newNote, setNewNote] = useState('');
  const [isPinned, setIsPinned] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!newNote.trim() || !onAddNote) return;
    setIsSubmitting(true);
    try {
      await onAddNote(newNote, isPinned);
      setNewNote('');
      setIsPinned(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const pinnedNotes = notes.filter((n) => n.is_pinned);
  const regularNotes = notes.filter((n) => !n.is_pinned);

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-zinc-950 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <Textarea
          placeholder="Write an internal note..."
          className="min-h-[100px] bg-zinc-50 dark:bg-zinc-900 border-none resize-none focus-visible:ring-1 focus-visible:ring-primary/50"
          value={newNote}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewNote(e.target.value)}
        />
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800/50">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsPinned(!isPinned)}
            className={isPinned ? 'text-primary bg-primary/10' : 'text-zinc-500'}
          >
            <Pin className="w-4 h-4 mr-2" />
            {isPinned ? 'Pinned Note' : 'Pin Note'}
          </Button>
          <Button 
            size="sm" 
            onClick={handleSubmit} 
            disabled={!newNote.trim() || isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Add Note'}
            {!isSubmitting && <Send className="w-4 h-4 ml-2" />}
          </Button>
        </div>
      </div>

      {pinnedNotes.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-zinc-500 uppercase flex items-center">
            <Pin className="w-3 h-3 mr-1" /> Pinned Notes
          </h4>
          <div className="space-y-3">
            {pinnedNotes.map((note) => (
              <NoteItem key={note.id} note={note} onTogglePin={onTogglePin} />
            ))}
          </div>
        </div>
      )}

      {regularNotes.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-zinc-500 uppercase">Recent Notes</h4>
          <div className="space-y-3">
            {regularNotes.map((note) => (
              <NoteItem key={note.id} note={note} onTogglePin={onTogglePin} />
            ))}
          </div>
        </div>
      )}
      
      {notes.length === 0 && (
        <div className="text-center py-8 text-zinc-500">
          No internal notes yet.
        </div>
      )}
    </div>
  );
}

function NoteItem({ note, onTogglePin }: { note: Note; onTogglePin?: (id: string, isPinned: boolean) => Promise<void> }) {
  return (
    <div className={`p-4 rounded-lg border ${note.is_pinned ? 'bg-amber-50/50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-900/30' : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800'}`}>
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-xs font-medium">
            {note.created_by?.name ? note.created_by.name.charAt(0) : 'U'}
          </div>
          <div>
            <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              {note.created_by?.name || 'System User'}
            </span>
            <span className="text-xs text-zinc-500 ml-2">
              {new Date(note.created_at).toLocaleDateString()} at {new Date(note.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </span>
          </div>
        </div>
        
        {onTogglePin && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6 text-zinc-400 hover:text-zinc-600"
            onClick={() => onTogglePin(note.id, note.is_pinned)}
            title={note.is_pinned ? "Unpin note" : "Pin note"}
          >
            <Pin className={`w-3 h-3 ${note.is_pinned ? 'fill-current text-amber-500' : ''}`} />
          </Button>
        )}
      </div>
      <p className="text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">
        {note.note_content}
      </p>
    </div>
  );
}
