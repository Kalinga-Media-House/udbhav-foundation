export function exportToCSV(filename: string, data: any[]) {
  if (!data || !data.length) return;
  const keys = Object.keys(data[0]);
  const csvContent = [
    keys.join(","),
    ...data.map(row => keys.map(k => "").join(","))
  ].join("\n");
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
