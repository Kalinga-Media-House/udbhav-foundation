/* eslint-disable */
import path from 'path';

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { chromium } from 'playwright';

dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const BASE_URL = 'http://localhost:3001';
const TEST_EMAIL = process.env.TEST_ADMIN_EMAIL || 'admin@udbhav.org';
const TEST_PASSWORD = process.env.TEST_ADMIN_PASSWORD || 'password123';

async function login(page) {
  console.log(`Logging in as ${TEST_EMAIL}...`);
  await page.goto(`${BASE_URL}/login`);
  await page.waitForTimeout(2000);
  await page.fill('input[id="email"]', TEST_EMAIL);
  await page.fill('input[id="password"]', TEST_PASSWORD);
  await page.click('button[type="submit"]');
  await page.waitForURL('**/admin/dashboard');
  console.log('Login successful.');
}

async function runStressTest(concurrentCount) {
  console.log(`\n==========================================`);
  console.log(`Starting Stress Test: ${concurrentCount} Concurrent Uploads`);
  console.log(`==========================================`);
  
  const browser = await chromium.launch({ headless: true, args: ['--disable-web-security'] });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    await login(page);

    // Track original db count
    const { count: startCount } = await supabase.from('media_files').select('*', { count: 'exact', head: true });

    // Navigate to Gallery New page to create a test album
    console.log('Navigating to /admin/gallery/new to create test album...');
    await page.goto(`${BASE_URL}/admin/gallery/new`);
    await page.waitForTimeout(2000);
    
    // Fill out album form
    const uniqueId = Date.now();
    await page.fill('input[id="album_code"]', `STRESS-${uniqueId}`);
    await page.fill('input[id="slug"]', `stress-test-${uniqueId}`);
    await page.fill('input[id="title"]', `Stress Test Album ${uniqueId}`);
    await page.fill('textarea[id="description"]', 'Album for stress testing multiple uploads');
    
    // Submit form
    console.log('Submitting new album form...');
    await page.click('button[type="submit"]');
    
    // Wait for redirect to gallery dashboard
    try {
        await page.waitForURL('**/admin/gallery*');
        await page.waitForTimeout(2000);
    } catch (e) {
        console.error('Failed to redirect after submitting album. Form may have validation errors.');
        const errorText = await page.locator('.text-red-700').first().textContent().catch(() => 'No error banner found');
        console.error('Error banner text:', errorText);
        await page.screenshot({ path: `debug_stress_form_submit_${concurrentCount}.png`, fullPage: true });
        throw e;
    }
    
    // Now get the newly created album ID from DB
    const { data: album } = await supabase.from('gallery_albums')
       .select('id')
       .order('created_at', { ascending: false })
       .limit(1)
       .single();
       
    if (!album) {
      throw new Error('Failed to create and fetch the test album.');
    }
    
    console.log(`Navigating to /admin/gallery/${album.id}/items...`);
    await page.goto(`${BASE_URL}/admin/gallery/${album.id}/items`);
    await page.waitForTimeout(2000);

    const filePaths = [];
    for (let i = 1; i <= concurrentCount; i++) {
        filePaths.push(path.join(process.cwd(), 'test-assets', `stress_${i}.jpg`));
    }

    console.log(`Selecting ${concurrentCount} files...`);
    const startTime = Date.now();
    
    const fileInputLocator = page.locator('input[type="file"]');
    try {
        await fileInputLocator.waitFor({ state: 'attached', timeout: 15000 });
    } catch (e) {
        console.error(`File input not found on /admin/gallery/${album.id}/items`);
        await page.screenshot({ path: `debug_stress_${concurrentCount}.png` });
        throw e;
    }
    
    // Playwright handles setting multiple files natively
    await fileInputLocator.setInputFiles(filePaths);

    console.log(`Waiting for ${concurrentCount} uploads to complete (timeout: 300s)...`);
    let completedCount = 0;
    
    for (let i = 0; i < 60; i++) { // 300s max
      await page.waitForTimeout(5000); // Check every 5s
      
      const { count: currentCount } = await supabase.from('media_files').select('*', { count: 'exact', head: true });
      completedCount = currentCount - startCount;
      
      console.log(`[${Math.round((Date.now() - startTime)/1000)}s] Progress: ${completedCount}/${concurrentCount} files uploaded`);
      
      if (completedCount >= concurrentCount) {
         break;
      }
    }
    
    const totalTime = (Date.now() - startTime) / 1000;
    
    if (completedCount >= concurrentCount) {
        console.log(`\nSUCCESS: ${concurrentCount} files uploaded in ${totalTime.toFixed(1)} seconds.`);
        console.log(`Throughput: ${(concurrentCount / totalTime).toFixed(2)} files/sec`);
    } else {
        console.error(`\nFAILED: Only ${completedCount}/${concurrentCount} files uploaded after 300 seconds.`);
    }

  } catch (e) {
    console.error('Stress Test Failed:', e);
  } finally {
    await browser.close();
  }
}

async function main() {
    // 1. Test 10 concurrent uploads
    // await runStressTest(10);
    
    // 2. Test 25 concurrent uploads
    await runStressTest(25);
}

main();

