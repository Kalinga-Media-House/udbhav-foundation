import { notFound } from 'next/navigation';

import { NewsArticleForm } from '@/components/admin/NewsArticleForm';
import { listEvents } from '@/features/events/actions';
import { getArticleById } from '@/features/news/actions';
import { listPrograms } from '@/features/programs/actions';

export const dynamic = 'force-dynamic';

export default async function EditNewsArticlePage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const [articleResult, programsResult, eventsResult] = await Promise.all([
    getArticleById(params.id),
    listPrograms({ page: 1, limit: 100 }),
    listEvents({ page: 1, limit: 100 }),
  ]);

  if (!articleResult.success || !articleResult.data) {
    notFound();
  }

  const programs =
    programsResult.success && programsResult.data
      ? programsResult.data.data.map((p) => ({ id: p.id, title: p.title }))
      : [];

  const events =
    eventsResult.success && eventsResult.data
      ? eventsResult.data.data.map((e) => ({ id: e.id, title: e.title }))
      : [];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Edit News Article</h1>
        <p className="text-sm text-gray-500">
          Update article content, category, tags, and settings for {articleResult.data.title}.
        </p>
      </div>

      <NewsArticleForm initialData={articleResult.data} programs={programs} events={events} />
    </div>
  );
}
