import { Loader2 } from "lucide-react";

export default function AdminLoading() {
  return (
    <div className="flex h-full min-h-[400px] flex-col items-center justify-center rounded-xl border border-gray-100 bg-white/50 p-8 shadow-sm">
      <div className="relative mb-4">
        <div className="absolute inset-0 rounded-full bg-indigo-100 animate-ping opacity-75"></div>
        <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        </div>
      </div>
      <h2 className="text-lg font-medium text-gray-900">Loading data...</h2>
      <p className="mt-1 text-sm text-gray-500">Please wait while we prepare your dashboard.</p>
      
      {/* Skeleton rows to simulate loading content */}
      <div className="mt-12 w-full max-w-2xl space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex animate-pulse items-center space-x-4">
            <div className="h-12 w-12 rounded-lg bg-gray-200"></div>
            <div className="flex-1 space-y-2 py-1">
              <div className="h-4 w-3/4 rounded bg-gray-200"></div>
              <div className="h-3 w-1/2 rounded bg-gray-200"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
