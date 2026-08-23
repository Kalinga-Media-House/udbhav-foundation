'use server';

import { revalidatePath } from 'next/cache';

import { deleteFile } from '@/lib/storage/delete';
import { createClient } from '@/lib/supabase/server';

export type HeroActionResponse = { success: boolean; error?: string };

export async function adminAddHeroImages(section: 'home_hero' | 'programmes_hero', imageUrls: string[]): Promise<HeroActionResponse> {
  const supabase = await createClient();

  // Check auth
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Verify limit
  const { data: currentImages } = await supabase
    .from('hero_images')
    .select('id')
    .eq('section', section);

  if (currentImages && currentImages.length + imageUrls.length > 5) {
    return { success: false, error: 'Maximum of 5 images allowed per section' };
  }

  // Insert DB records
  const startingOrder = currentImages?.length || 0;
  const insertData = imageUrls.map((url, index) => ({
    section,
    image_url: url,
    display_order: startingOrder + index + 1,
    is_active: true
  }));

  const { error: dbError } = await supabase
    .from('hero_images')
    .insert(insertData);

  if (dbError) {
    console.error('Database insert error:', dbError);
    return { success: false, error: `Database insert error: ${dbError.message}` };
  }

  revalidatePath('/');
  revalidatePath('/programmes');
  revalidatePath('/admin/dashboard/hero');
  
  return { success: true };
}

export async function adminDeleteHeroImage(id: string, imageUrl: string): Promise<HeroActionResponse> {
  const supabase = await createClient();
  
  // 1. Delete from Supabase hero_images
  const { error } = await supabase
    .from('hero_images')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Database delete error:', error);
    return { success: false, error: `Database delete error: ${error.message}` };
  }

  // 2. Extract R2 object key from the imageUrl and delete it from R2 and media_files
  try {
    const urlObj = new URL(imageUrl);
    const pathname = urlObj.pathname.startsWith('/') ? urlObj.pathname.substring(1) : urlObj.pathname;
    if (pathname) {
      await deleteFile(pathname);
      await supabase.from('media_files').delete().eq('r2_object_key', pathname);
    }
  } catch (deleteErr) {
    console.error('Failed to delete from R2/media_files:', deleteErr);
    // Non-fatal, we successfully deleted from DB
  }

  revalidatePath('/');
  revalidatePath('/programmes');
  revalidatePath('/admin/dashboard/hero');
  
  return { success: true };
}

export async function adminToggleHeroImage(id: string, isActive: boolean): Promise<HeroActionResponse> {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from('hero_images')
    .update({ is_active: isActive })
    .eq('id', id);

  if (error) {
    console.error('Database update error:', error);
    return { success: false, error: `Database update error: ${error.message}` };
  }

  revalidatePath('/');
  revalidatePath('/programmes');
  revalidatePath('/admin/dashboard/hero');
  
  return { success: true };
}

export async function adminReorderHeroImages(section: 'home_hero' | 'programmes_hero', orderedIds: string[]): Promise<HeroActionResponse> {
  const supabase = await createClient();
  
  // Upsert display_order for multiple records isn't straightforward without RPC,
  // so we do it in a loop.
  for (let i = 0; i < orderedIds.length; i++) {
    await supabase
      .from('hero_images')
      .update({ display_order: i + 1 })
      .eq('id', orderedIds[i])
      .eq('section', section);
  }

  revalidatePath('/');
  revalidatePath('/programmes');
  revalidatePath('/admin/dashboard/hero');
  
  return { success: true };
}
