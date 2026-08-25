export type ProgramTheme = {
  name: string;
  badgeBg: string;
  badgeText: string;
  accentText: string;
  hoverAccent: string;
  cardHighlight?: string;
};

export const PROGRAM_THEMES: ProgramTheme[] = [
  {
    name: 'green',
    badgeBg: 'bg-emerald-100 dark:bg-emerald-900/30',
    badgeText: 'text-emerald-700 dark:text-emerald-400',
    accentText: 'text-emerald-600 dark:text-emerald-500',
    hoverAccent: 'group-hover:text-emerald-700 dark:group-hover:text-emerald-400',
    cardHighlight: 'hover:border-emerald-200 dark:hover:border-emerald-800'
  },
  {
    name: 'blue',
    badgeBg: 'bg-blue-100 dark:bg-blue-900/30',
    badgeText: 'text-blue-700 dark:text-blue-400',
    accentText: 'text-blue-600 dark:text-blue-500',
    hoverAccent: 'group-hover:text-blue-700 dark:group-hover:text-blue-400',
    cardHighlight: 'hover:border-blue-200 dark:hover:border-blue-800'
  },
  {
    name: 'orange',
    badgeBg: 'bg-orange-100 dark:bg-orange-900/30',
    badgeText: 'text-orange-700 dark:text-orange-400',
    accentText: 'text-orange-600 dark:text-orange-500',
    hoverAccent: 'group-hover:text-orange-700 dark:group-hover:text-orange-400',
    cardHighlight: 'hover:border-orange-200 dark:hover:border-orange-800'
  },
  {
    name: 'purple',
    badgeBg: 'bg-purple-100 dark:bg-purple-900/30',
    badgeText: 'text-purple-700 dark:text-purple-400',
    accentText: 'text-purple-600 dark:text-purple-500',
    hoverAccent: 'group-hover:text-purple-700 dark:group-hover:text-purple-400',
    cardHighlight: 'hover:border-purple-200 dark:hover:border-purple-800'
  },
  {
    name: 'teal',
    badgeBg: 'bg-teal-100 dark:bg-teal-900/30',
    badgeText: 'text-teal-700 dark:text-teal-400',
    accentText: 'text-teal-600 dark:text-teal-500',
    hoverAccent: 'group-hover:text-teal-700 dark:group-hover:text-teal-400',
    cardHighlight: 'hover:border-teal-200 dark:hover:border-teal-800'
  },
  {
    name: 'rose',
    badgeBg: 'bg-rose-100 dark:bg-rose-900/30',
    badgeText: 'text-rose-700 dark:text-rose-400',
    accentText: 'text-rose-600 dark:text-rose-500',
    hoverAccent: 'group-hover:text-rose-700 dark:group-hover:text-rose-400',
    cardHighlight: 'hover:border-rose-200 dark:hover:border-rose-800'
  },
  {
    name: 'amber',
    badgeBg: 'bg-amber-100 dark:bg-amber-900/30',
    badgeText: 'text-amber-700 dark:text-amber-400',
    accentText: 'text-amber-600 dark:text-amber-500',
    hoverAccent: 'group-hover:text-amber-700 dark:group-hover:text-amber-400',
    cardHighlight: 'hover:border-amber-200 dark:hover:border-amber-800'
  },
  {
    name: 'indigo',
    badgeBg: 'bg-indigo-100 dark:bg-indigo-900/30',
    badgeText: 'text-indigo-700 dark:text-indigo-400',
    accentText: 'text-indigo-600 dark:text-indigo-500',
    hoverAccent: 'group-hover:text-indigo-700 dark:group-hover:text-indigo-400',
    cardHighlight: 'hover:border-indigo-200 dark:hover:border-indigo-800'
  },
];

export function stableHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

export function getProgramTheme(programId: string, collisionOffset: number = 0): ProgramTheme {
  const index = (stableHash(programId) + collisionOffset) % PROGRAM_THEMES.length;
  return PROGRAM_THEMES[index];
}
