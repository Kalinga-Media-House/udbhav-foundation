import React from 'react';
    
import { PodcastForm } from '@/components/admin/PodcastForm';

export default function NewPodcastPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Create Podcast Episode</h1>
        <p className="mt-1 text-gray-500">
          Add a new podcast episode to the UDBHAV Foundation platform.
        </p>
      </div>
      <PodcastForm />
    </div>
  );
}
