import { notFound } from 'next/navigation';
import React from 'react';

import { PodcastForm } from '@/components/admin/PodcastForm';
import { getPodcast } from '@/features/podcasts/actions';

export default async function EditPodcastPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const result = await getPodcast(params.id);
  
  if (!result.success || !result.data) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Edit Podcast Episode</h1>
        <p className="mt-1 text-gray-500">
          Modify the details of this podcast episode.
        </p>
      </div>
      <PodcastForm initialData={result.data} />
    </div>
  );
}
