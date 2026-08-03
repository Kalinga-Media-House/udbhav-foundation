import fs from 'fs';
import path from 'path';

import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { chromium } from 'playwright';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

const BASE_URL = 'https://udbhavfoundation.in';
const TEST_EMAIL = process.env.TEST_ADMIN_EMAIL || 'admin@udbhav.org';
const TEST_PASSWORD = process.env.TEST_ADMIN_PASSWORD || 'password123';

const filesToTest = [
  { name: '25mb_dslr.jpg', type: 'image/jpeg', max_size: 25 * 1024 * 1024 },
  { name: '15mb_dslr.jpg', type: 'image/jpeg' },
  { name: '8mb_dslr.jpg', type: 'image/jpeg' },
  { name: 'transparent_demo.png', type: 'image/png' },
  { name: 'animated_earth.gif', type: 'image/gif' },
  { name: 'sample.tiff', type: 'image/tiff' },
  { name: 'fake.bmp', type: 'image/bmp' }, // Faked earlier, server will reject or process if sharp handles it
  { name: 'sample.heic', type: 'image/heic' } // Sharp may fallback or process
];

async function login(page) {
  console.log(`Logging in as ${TEST_EMAIL}...`);
  await page.goto(`${BASE_URL}/login`);
  await page.waitForTimeout(5000); // Wait for potential redirects
  await page.screenshot({ path: 'debug_login.png' });
  try {
    await page.fill('input[id="email"]', TEST_EMAIL, { timeout: 10000 });
    await page.fill('input[id="password"]', TEST_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL('**/admin/dashboard');
  } catch (e) {
    const html = await page.content();
    fs.writeFileSync('debug.html', html);
    throw e;
  }
  console.log('Login successful.');
}

async function verifyUpload(page, fileName, moduleUrl, inputSelector, _submitSelector) {
  console.log(`\n--- Testing upload: ${fileName} on ${moduleUrl} ---`);
  await page.goto(`${BASE_URL}${moduleUrl}`);
  
  const filePath = path.join(process.cwd(), 'test-assets', fileName);
  if (!fs.existsSync(filePath)) {
    console.log(`File ${fileName} not found, skipping.`);
    return;
  }

  // Listen for console and network
  const errors = [];
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  page.on('response', res => { 
    if (res.status() === 413) errors.push('413 Payload Too Large');
    if (res.status() >= 400 && res.url().includes('api/media')) errors.push(`API Error ${res.status()}: ${res.url()}`);
  });

  let fileInputLocator;
  try {
    fileInputLocator = page.locator(inputSelector || 'input[type="file"]');
    await fileInputLocator.waitFor({ state: 'attached', timeout: 15000 });
  } catch {
    console.error(`File input not found on ${moduleUrl}`);
    await page.screenshot({ path: `debug_${moduleUrl.replace(/[\/\\]/g, '_')}.png` });
    return;
  }

  console.log(`Uploading ${fileName}...`);
  await fileInputLocator.setInputFiles(filePath);
  
  // Wait for the upload success state (e.g., checkmark, image preview, or 'Saving to album...' disappearing)
  // Our ImageUploader usually shows a checkmark or removes the upload progress text.
  try {
    await page.waitForSelector('.lucide-check-circle2, img.object-cover, .success-message', { timeout: 30000 });
  } catch {
    console.log('Upload indicator timeout, continuing anyway to check DB...');
  }
  
  // Wait a bit for server actions to finish DB inserts
  await page.waitForTimeout(3000);

  if (errors.length > 0) {
    console.log(`Errors encountered during upload of ${fileName}:`, errors);
  } else {
    console.log(`No browser errors during upload of ${fileName}`);
  }

  // Verify Database
  console.log('Verifying Database Record...');
  const { data: media, error } = await supabase
    .from('media_files')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error || !media) {
    console.error('Database verification failed:', error);
    return;
  }
  
  if (media.original_filename !== fileName) {
    console.error(`Database verification failed: Expected to find record for ${fileName} but found ${media.original_filename}. Did the upload fail on the server?`);
    return;
  }
  
  console.log(`DB Record found: ${media.original_filename} (stored as ${media.stored_filename})`);
  
  // Verify WebP Conversion
  if (fileName.endsWith('.gif')) {
    console.log('Animated GIF verification: checking if original format was preserved...', media.mime_type === 'image/gif');
  } else if (!fileName.endsWith('.heic') && !fileName.endsWith('.tiff') && !fileName.endsWith('.bmp')) {
    console.log('WebP conversion verification: ', media.mime_type === 'image/webp' ? 'SUCCESS' : 'FAILED - is ' + media.mime_type);
  }

  // Verify R2 Bucket Objects
  console.log('Verifying R2 Bucket...');
  const tempCommand = new ListObjectsV2Command({ Bucket: process.env.R2_BUCKET_NAME, Prefix: 'temp/' });
  const finalCommand = new ListObjectsV2Command({ Bucket: process.env.R2_BUCKET_NAME, Prefix: media.folder_path.replace(/^\//, '') });
  
  const [tempRes, finalRes] = await Promise.all([
    s3.send(tempCommand),
    s3.send(finalCommand)
  ]);

  const hasTemp = tempRes.Contents?.some(obj => obj.Key.includes(media.original_filename));
  const hasFinal = finalRes.Contents?.some(obj => obj.Key === media.r2_object_key);

  console.log(`Temp object removed: ${!hasTemp ? 'SUCCESS' : 'FAILED'}`);
  console.log(`Final optimized object exists: ${hasFinal ? 'SUCCESS' : 'FAILED'}`);
  
  if (hasFinal) {
     const finalObj = finalRes.Contents.find(obj => obj.Key === media.r2_object_key);
     console.log(`Compression achieved: Original ${fs.statSync(filePath).size} bytes -> Final ${finalObj.Size} bytes`);
  }
}

async function seedUser() {
  console.log('Seeding test user...');
  const { data: users } = await supabase.auth.admin.listUsers();
  let user = users?.users.find(u => u.email === TEST_EMAIL);
  if (!user) {
     const { data } = await supabase.auth.admin.createUser({
        email: TEST_EMAIL,
        password: TEST_PASSWORD,
        email_confirm: true
     });
     user = data.user;
  } else {
     await supabase.auth.admin.updateUserById(user.id, { password: TEST_PASSWORD });
  }

  const { data: role } = await supabase.from('roles').select('id').eq('slug', 'super-admin').single();
  if (role && user) {
      // Upsert might fail if unique constraint is just (user_id, role_id). Let's just delete and insert
      await supabase.from('user_roles').delete().eq('user_id', user.id);
      await supabase.from('user_roles').insert({ user_id: user.id, role_id: role.id, is_active: true });
      
      // Also ensure profile exists
      const { data: profile } = await supabase.from('profiles').select('id').eq('id', user.id).maybeSingle();
      if (!profile) {
          await supabase.from('profiles').insert({
              id: user.id,
              primary_email: TEST_EMAIL,
              first_name: 'Test',
              last_name: 'Admin',
              slug: 'test-admin-' + Math.random().toString(36).substring(7)
          });
      }
  }
}

async function run() {
  console.log('Starting Playwright End-to-End Verification...');
  await seedUser();
  const browser = await chromium.launch({
    headless: true,
    args: ['--disable-web-security']
  });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await login(page);

    // Test across modules
    // Gallery Module (multiple support, high res)
    await verifyUpload(page, '25mb_dslr.jpg', '/admin/gallery/new', 'input[type="file"]');
    
    // Programs Module
    await verifyUpload(page, '15mb_dslr.jpg', '/admin/programs/new', 'input[type="file"]');

    // Events Module
    await verifyUpload(page, 'transparent_demo.png', '/admin/dashboard/events/new', 'input[type="file"]');
    
    // Test remaining formats on Gallery
    for (const file of filesToTest.filter(f => f.name !== '25mb_dslr.jpg' && f.name !== '15mb_dslr.jpg' && f.name !== 'transparent_demo.png')) {
       await verifyUpload(page, file.name, '/admin/gallery/new', 'input[type="file"]');
    }

  } catch (err) {
    console.error('Test Execution Failed:', err);
  } finally {
    await browser.close();
    console.log('Verification Complete.');
  }
}

run();
