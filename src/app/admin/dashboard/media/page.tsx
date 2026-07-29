import MediaManager from '@/components/admin/media/MediaManager';

export const metadata = {
  title: 'Media Library | Admin Dashboard',
};

export default function MediaPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Media Library</h1>
        <p className="text-slate-500 mt-2 text-lg">Centralize and manage all images, documents, and files uploaded to the platform.</p>
      </div>
      
      <MediaManager />
    </div>
  );
}
