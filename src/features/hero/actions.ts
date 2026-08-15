'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function adminAddHeroImages(section: 'home_hero' | 'programmes_hero', imageUrls: string[]) {
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
    throw new Error('Maximum of 5 images allowed per section');
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
    throw new Error('Failed to save image records');
  }

  revalidatePath('/');
  revalidatePath('/programmes');
  revalidatePath('/admin/dashboard/hero');
  
  return { success: true };
}

export async function adminDeleteHeroImage(id: string, imageUrl: string) {
  const supabase = await createClient();
  
  // Note: We don't delete from R2 / media_files here to ensure we don't 
  // break images that might be used elsewhere. We just remove it from the hero.

  const { error } = await supabase
    .from('hero_images')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Database delete error:', error);
    throw new Error('Failed to delete image record');
  }

  revalidatePath('/');
  revalidatePath('/programmes');
  revalidatePath('/admin/dashboard/hero');
  
  return { success: true };
}

export async function adminToggleHeroImage(id: string, isActive: boolean) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from('hero_images')
    .update({ is_active: isActive })
    .eq('id', id);

  if (error) {
    console.error('Database update error:', error);
    throw new Error('Failed to update image status');
  }

  revalidatePath('/');
  revalidatePath('/programmes');
  revalidatePath('/admin/dashboard/hero');
  
  return { success: true };
}

export async function adminReorderHeroImages(section: 'home_hero' | 'programmes_hero', orderedIds: string[]) {
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
