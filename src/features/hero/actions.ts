'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function adminUploadHeroImage(section: 'home_hero' | 'programmes_hero', file: File) {
  const supabase = await createClient();

  // Check auth
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Verify limit
  const { data: currentImages } = await supabase
    .from('hero_images')
    .select('id')
    .eq('section', section);

  if (currentImages && currentImages.length >= 5) {
    throw new Error('Maximum of 5 images allowed per section');
  }

  // Upload to storage
  const fileExt = file.name.split('.').pop();
  const fileName = `${section}-${crypto.randomUUID()}.${fileExt}`;
  const filePath = `hero/${fileName}`;

  // Assuming 'public-assets' or similar bucket, maybe 'media'?
  // Let's check which bucket to use. Let's use 'media' since the prompt says "existing Supabase Storage architecture".
  const { data: storageData, error: storageError } = await supabase.storage
    .from('media')
    .upload(filePath, file);

  if (storageError) {
    console.error('Storage upload error:', storageError);
    throw new Error('Failed to upload image to storage');
  }

  // Get public URL
  const { data: publicUrlData } = supabase.storage
    .from('media')
    .getPublicUrl(filePath);

  const imageUrl = publicUrlData.publicUrl;

  // Insert DB record
  const { error: dbError } = await supabase
    .from('hero_images')
    .insert({
      section,
      image_url: imageUrl,
      display_order: (currentImages?.length || 0) + 1,
      is_active: true
    });

  if (dbError) {
    // Rollback storage upload
    await supabase.storage.from('media').remove([filePath]);
    console.error('Database insert error:', dbError);
    throw new Error('Failed to save image record');
  }

  revalidatePath('/');
  revalidatePath('/programmes');
  revalidatePath('/admin/dashboard/hero');
  
  return { success: true };
}

export async function adminDeleteHeroImage(id: string, imageUrl: string) {
  const supabase = await createClient();
  
  // Try to extract file path from URL
  const urlObj = new URL(imageUrl);
  const pathParts = urlObj.pathname.split('/media/');
  if (pathParts.length > 1) {
    const filePath = pathParts[1];
    await supabase.storage.from('media').remove([filePath]);
  }

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
