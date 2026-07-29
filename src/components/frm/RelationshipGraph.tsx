import { ArrowDown } from 'lucide-react';
import Link from 'next/link';

interface NodeData {
  id: string;
  type: 'contact' | 'organization' | 'program' | 'event' | 'donation';
  label: string;
  sublabel?: string;
  url: string;
}

interface RelationshipGraphProps {
  nodes: NodeData[];
}

export function RelationshipGraph({ nodes }: RelationshipGraphProps) {
  if (!nodes || nodes.length === 0) return null;

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'contact': return 'border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-900/50 dark:bg-blue-900/20 dark:text-blue-200';
      case 'organization': return 'border-indigo-200 bg-indigo-50 text-indigo-900 dark:border-indigo-900/50 dark:bg-indigo-900/20 dark:text-indigo-200';
      case 'program': return 'border-purple-200 bg-purple-50 text-purple-900 dark:border-purple-900/50 dark:bg-purple-900/20 dark:text-purple-200';
      case 'event': return 'border-orange-200 bg-orange-50 text-orange-900 dark:border-orange-900/50 dark:bg-orange-900/20 dark:text-orange-200';
      case 'donation': return 'border-green-200 bg-green-50 text-green-900 dark:border-green-900/50 dark:bg-green-900/20 dark:text-green-200';
      default: return 'border-zinc-200 bg-zinc-50 text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-200';
    }
  };

  return (
    <div className="flex flex-col items-center py-6 space-y-2">
      {nodes.map((node, index) => (
        <div key={`${node.id}-${index}`} className="flex flex-col items-center">
          <Link
            href={node.url}
            className={`w-64 p-4 rounded-xl border text-center transition-all hover:shadow-md hover:scale-[1.02] ${getTypeColor(node.type)}`}
          >
            <div className="text-xs font-semibold uppercase tracking-wider opacity-70 mb-1">
              {node.type}
            </div>
            <div className="font-semibold">{node.label}</div>
            {node.sublabel && (
              <div className="text-sm opacity-80 mt-1">{node.sublabel}</div>
            )}
          </Link>
          
          {index < nodes.length - 1 && (
            <div className="py-2 text-zinc-300 dark:text-zinc-700">
              <ArrowDown className="w-5 h-5" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
