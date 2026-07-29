import { NewsListClient } from '@/components/admin/NewsListClient';
import { listArticles } from '@/features/news/actions';

export const dynamic = 'force-dynamic';

export default async function AdminNewsPage(props: { searchParams: Promise<{ page?: string }> }) {
  const searchParams = await props.searchParams;
  const page = searchParams.page ? parseInt(searchParams.page, 10) : 1;
  const result = await listArticles({ page, limit: 100 });
  const articles = result.success && result.data ? result.data.data : [];

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">News & Stories</h1>
        <p className="text-sm text-gray-500">
          Manage articles, stories, press releases, and announcements published by UDBHAV Foundation.
        </p>
      </div>

      <NewsListClient initialArticles={articles} />
    </div>
  );
}
