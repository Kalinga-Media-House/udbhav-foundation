'use server';

import { revalidatePath } from 'next/cache';

import { handleAction, ActionResult } from '@/contracts/actions';

import { podcastRepository, PodcastCreate, PodcastUpdate, ID } from './repository';

function generateSlug(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export async function createPodcast(data: PodcastCreate): Promise<ActionResult<any>> {
  return handleAction('createPodcast', async () => {
    if (!data.slug) {
      data.slug = generateSlug(data.title);
    }
    const result = await podcastRepository.create(data);
    if (result.error) throw result.error;
    revalidatePath('/admin/podcast');
    revalidatePath('/news-and-stories');
    return result.data;
  });
}

export async function updatePodcast(id: ID, data: PodcastUpdate): Promise<ActionResult<any>> {
  return handleAction('updatePodcast', async () => {
    if (data.title && !data.slug) {
      data.slug = generateSlug(data.title);
    }
    const result = await podcastRepository.update(id, data);
    if (result.error) throw result.error;
    revalidatePath('/admin/podcast');
    revalidatePath('/news-and-stories');
    return result.data;
  });
}

export async function publishPodcast(id: ID): Promise<ActionResult<any>> {
  return handleAction('publishPodcast', async () => {
    const result = await podcastRepository.update(id, { 
      status: 'Published', 
      release_date: new Date().toISOString().split('T')[0] 
    });
    if (result.error) throw result.error;
    revalidatePath('/admin/podcast');
    revalidatePath('/news-and-stories');
    return result.data;
  });
}

export async function unpublishPodcast(id: ID): Promise<ActionResult<any>> {
  return handleAction('unpublishPodcast', async () => {
    const result = await podcastRepository.update(id, { status: 'Draft' });
    if (result.error) throw result.error;
    revalidatePath('/admin/podcast');
    revalidatePath('/news-and-stories');
    return result.data;
  });
}

export async function deletePodcast(id: ID): Promise<ActionResult<any>> {
  return handleAction('deletePodcast', async () => {
    const placeholderUserId = '00000000-0000-0000-0000-000000000000';
    const result = await podcastRepository.softDelete(id, placeholderUserId);
    if (result.error) throw result.error;
    revalidatePath('/admin/podcast');
    revalidatePath('/news-and-stories');
    return result.data;
  });
}

export async function listPublicPodcasts(): Promise<ActionResult<any>> {
  return handleAction('listPublicPodcasts', async () => {
    const result = await podcastRepository.list({ page: 1, limit: 100 }, { status: 'Published', visibility: 'public' });
    return result;
  });
}

export async function listPodcasts(pagination = { page: 1, limit: 100 }): Promise<ActionResult<any>> {
  return handleAction('listPodcasts', async () => {
    const result = await podcastRepository.list(pagination);
    return result;
  });
}

export async function getPodcast(id: string): Promise<ActionResult<any>> {
  return handleAction('getPodcast', async () => {
    const result = await podcastRepository.findById(id);
    if (result.error) throw result.error;
    return result.data;
  });
}
