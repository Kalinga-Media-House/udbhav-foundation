import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  page.on('console', msg => {
    if (msg.type() === 'error') console.error(`[BROWSER ERROR] ${msg.text()}`);
  });
  
  page.on('response', response => {
    if (!response.ok() && response.url().includes('programs')) {
      console.error(`[NETWORK ERROR] ${response.url()} failed with status ${response.status()}`);
    }
  });

  const BASE_URL = 'https://udbhavfoundation.in';
  console.log(`Navigating to ${BASE_URL}/login...`);
  await page.goto(`${BASE_URL}/login`);
  await page.fill('input[type="email"]', 'test_automation4@udbhavfoundation.in');
  await page.fill('input[type="password"]', 'TestAuto123!');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/admin/dashboard');
  
  console.log(`Logged in successfully. Navigating to /admin/programs/new...`);
  await page.goto(`${BASE_URL}/admin/programs/new`);
  await page.waitForLoadState('networkidle');
  
  const code = `FINAL-${Date.now().toString().slice(-4)}`;
  console.log(`Filling form with Program Code: ${code}`);
  await page.fill('input[name="program_code"]', code);
  await page.fill('input[name="title"]', `Final Verification ${code}`);
  await page.fill('input[name="slug"]', `final-${code.toLowerCase()}`);
  
  console.log(`Uploading real image: public/brand/udbhav-logo.png`);
  await page.locator('input[type="file"]').setInputFiles('public/brand/udbhav-logo.png');
  await page.waitForTimeout(1000);
  
  console.log(`Submitting form...`);
  await page.click('button[type="submit"]');
  
  await page.waitForURL('**/admin/programs', { timeout: 45000 });
  console.log(`Successfully redirected to /admin/programs`);
  
  const isVisible = await page.getByText(`Final Verification ${code}`).isVisible();
  if (isVisible) {
    console.log(`✅ Program '${code}' successfully created and visible in the list!`);
  } else {
    console.error(`❌ Program '${code}' is missing from the list.`);
  }
  
  await browser.close();
})();