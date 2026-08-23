/* eslint-disable @typescript-eslint/no-explicit-any */
﻿/**
 * Generic CSV Export Utility
 */

export function exportToCSV<T extends Record<string, any>>(
  data: T[],
  filename: string,
  columns?: { key: keyof T; label: string }[]
) {
  if (!data || !data.length) {
    return;
  }

  // Determine headers
  let headers: string[] = [];
  let keys: (keyof T)[] = [];

  if (columns && columns.length > 0) {
    headers = columns.map((c) => c.label);
    keys = columns.map((c) => c.key);
  } else {
    keys = Object.keys(data[0]) as (keyof T)[];
    headers = keys as string[];
  }

  // Create CSV string
  const csvRows = [];

  // Header row
  csvRows.push(headers.map((header) => escapeCSVValue(String(header))).join(','));

  // Data rows
  for (const row of data) {
    const values = keys.map((key) => {
      const val = row[key];
      if (val === null || val === undefined) return '';
      if (val && typeof val === 'object' && Object.prototype.toString.call(val) === '[object Date]')
        return (val as any).toISOString();
      if (typeof val === 'object') return JSON.stringify(val);
      return String(val);
    });
    csvRows.push(values.map(escapeCSVValue).join(','));
  }

  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });

  // Trigger download
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.setAttribute('href', url);
  a.setAttribute(
    'download',
    `${filename.replace(/\.csv$/, '')}_${new Date().toISOString().split('T')[0]}.csv`
  );
  a.style.visibility = 'hidden';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  URL.revokeObjectURL(url);
}

function escapeCSVValue(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}
