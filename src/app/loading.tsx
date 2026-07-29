import { LoadingSpinner } from '@/components/common/loading-spinner';

export default function Loading() {
  return (
    <div className="flex h-[50vh] w-full flex-col items-center justify-center space-y-4">
      <LoadingSpinner className="h-12 w-12 border-primary" />
      <p className="text-sm text-muted-foreground animate-pulse">Loading...</p>
    </div>
  );
}
