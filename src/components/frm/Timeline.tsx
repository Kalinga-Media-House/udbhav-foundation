import { 
  UserPlus, 
  Edit, 
  Heart, 
  Calendar, 
  Users, 
  FileText, 
  Paperclip, 
  GitMerge, 
  Link as LinkIcon 
} from 'lucide-react';
import { ReactNode } from 'react';

import { cn } from '@/utils';

export type TimelineEventType = 
  | 'created' 
  | 'updated' 
  | 'donation' 
  | 'event' 
  | 'program' 
  | 'note' 
  | 'document' 
  | 'merge' 
  | 'relationship';

interface TimelineItemProps {
  type: TimelineEventType;
  title: string;
  description?: ReactNode;
  timestamp: string;
  actorName?: string;
  isLast?: boolean;
}

const eventStyles: Record<TimelineEventType, { icon: React.ElementType, bg: string, text: string }> = {
  created: { icon: UserPlus, bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-600 dark:text-blue-400' },
  updated: { icon: Edit, bg: 'bg-zinc-100 dark:bg-zinc-800', text: 'text-zinc-600 dark:text-zinc-400' },
  donation: { icon: Heart, bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-600 dark:text-green-400' },
  event: { icon: Calendar, bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-600 dark:text-orange-400' },
  program: { icon: Users, bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-600 dark:text-purple-400' },
  note: { icon: FileText, bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-600 dark:text-yellow-400' },
  document: { icon: Paperclip, bg: 'bg-cyan-100 dark:bg-cyan-900/30', text: 'text-cyan-600 dark:text-cyan-400' },
  merge: { icon: GitMerge, bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-600 dark:text-red-400' },
  relationship: { icon: LinkIcon, bg: 'bg-indigo-100 dark:bg-indigo-900/30', text: 'text-indigo-600 dark:text-indigo-400' },
};

export function TimelineItem({ type, title, description, timestamp, actorName, isLast }: TimelineItemProps) {
  const style = eventStyles[type] || eventStyles.updated;
  const Icon = style.icon;

  return (
    <div className="relative pl-8 sm:pl-32 py-6 group">
      {/* Vertical line */}
      {!isLast && (
        <div className="absolute left-[1.1875rem] sm:left-[7.1875rem] top-10 bottom-0 w-px bg-zinc-200 dark:bg-zinc-800" />
      )}

      {/* Date (Desktop) */}
      <div className="hidden sm:flex flex-col items-end absolute left-0 top-6 w-24 text-right">
        <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
          {new Date(timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
        </span>
        <span className="text-xs text-zinc-500">
          {new Date(timestamp).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}
        </span>
      </div>

      {/* Icon */}
      <div className={cn(
        "absolute left-0 sm:left-24 top-6 w-10 h-10 rounded-full flex items-center justify-center border-4 border-white dark:border-zinc-950 shadow-sm",
        style.bg, style.text
      )}>
        <Icon className="w-4 h-4" />
      </div>

      {/* Content */}
      <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-lg p-4 border border-zinc-100 dark:border-zinc-800/50 transition-colors hover:border-zinc-200 dark:hover:border-zinc-700">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1 gap-2">
          <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            {title}
          </h4>
          <span className="sm:hidden text-xs font-medium text-zinc-500">
            {new Date(timestamp).toLocaleString()}
          </span>
        </div>
        
        {description && (
          <div className="text-sm text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed">
            {description}
          </div>
        )}
        
        {actorName && (
          <div className="mt-3 text-xs text-zinc-500 flex items-center">
            <span className="w-4 h-4 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center mr-1.5 overflow-hidden">
              <UserPlus className="w-2.5 h-2.5" />
            </span>
            by {actorName}
          </div>
        )}
      </div>
    </div>
  );
}

interface TimelineProps {
  items: Omit<TimelineItemProps, 'isLast'>[];
  emptyMessage?: string;
}

export function Timeline({ items, emptyMessage = 'No timeline events found.' }: TimelineProps) {
  if (!items || items.length === 0) {
    return (
      <div className="p-8 text-center text-zinc-500 border border-dashed rounded-lg border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/20">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="relative">
      {items.map((item, index) => (
        <TimelineItem 
          key={`${item.timestamp}-${index}`} 
          {...item} 
          isLast={index === items.length - 1} 
        />
      ))}
    </div>
  );
}
