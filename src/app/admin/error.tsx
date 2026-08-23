/* eslint-disable no-console */
"use client";

import { AlertCircle, RefreshCcw } from "lucide-react";
import { useEffect } from "react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service if needed
    console.error("Admin section error:", error);
  }, [error]);

  return (
    <div className="flex h-full min-h-[400px] flex-col items-center justify-center rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
      <div className="mb-6 rounded-full bg-red-50 p-4">
        <AlertCircle className="h-10 w-10 text-red-500" />
      </div>
      <h2 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">
        Something went wrong!
      </h2>
      <p className="mb-8 max-w-md text-gray-500">
        We encountered an unexpected error while loading this page. Our team has been notified.
      </p>
      <button
        onClick={() => reset()}
        className="group inline-flex items-center justify-center rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white transition-all hover:bg-indigo-700 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-indigo-300"
      >
        <RefreshCcw className="mr-2 h-4 w-4 transition-transform group-hover:rotate-180" />
        Try again
      </button>
      {process.env.NODE_ENV === "development" && (
        <div className="mt-8 max-w-2xl rounded-lg bg-red-50 p-4 text-left">
          <p className="mb-1 text-sm font-semibold text-red-800">Error Details (Development Only):</p>
          <pre className="overflow-auto whitespace-pre-wrap text-xs text-red-600">
            {error.message}
            {"\n"}
            {error.stack}
          </pre>
        </div>
      )}
    </div>
  );
}
