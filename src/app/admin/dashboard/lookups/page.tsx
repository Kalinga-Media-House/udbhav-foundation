import LookupManager from '@/components/admin/lookups/LookupManager';

export const metadata = {
  title: 'Lookups Management | Admin Dashboard',
};

export default function LookupsPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">System Lookups</h1>
        <p className="text-slate-500 mt-2">Manage taxonomies and their terms for application-wide drop-downs and categorizations.</p>
      </div>
      
      <LookupManager />
    </div>
  );
}
