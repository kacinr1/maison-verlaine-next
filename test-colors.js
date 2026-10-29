const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto('http://localhost:3002', { waitUntil: 'networkidle' });

  console.log('✓ Page loaded');

  // Get initial outfit summary
  const initialRecap = await page.locator('dl').textContent();
  console.log('\n📋 Initial outfit:');
  console.log(initialRecap);

  // Test 1: Click a color button for Veste (Jacket)
  console.log('\n🎯 Test 1: Change Veste color to Camel');
  const vesteButtons = await page.locator('section >> nth=0').locator('button').all();
  console.log(`Found ${vesteButtons.length} color buttons in Veste section`);

  // Click the 2nd color button (Camel)
  if (vesteButtons.length > 1) {
    await vesteButtons[1].click();
    await page.waitForTimeout(500);
    console.log('✓ Clicked Camel color for Veste');

    const recap1 = await page.locator('dl').textContent();
    console.log('Updated outfit:');
    console.log(recap1);
  }

  // Test 2: Change Gilet color
  console.log('\n🎯 Test 2: Change Gilet color to Noir');
  const giletSection = await page.locator('section >> nth=1');
  const giletButtons = await giletSection.locator('button').all();
  console.log(`Found ${giletButtons.length} color buttons in Gilet section`);

  if (giletButtons.length > 3) {
    await giletButtons[3].click(); // Noir
    await page.waitForTimeout(500);
    console.log('✓ Clicked Noir color for Gilet');

    const recap2 = await page.locator('dl').textContent();
    console.log('Updated outfit:');
    console.log(recap2);
  }

  // Test 3: Change pattern/weave for Veste
  console.log('\n🎯 Test 3: Change Veste pattern to Fines rayures');
  const weaveButtons = await page.locator('section >> nth=0').locator('.weave button').all();
  console.log(`Found ${weaveButtons.length} weave buttons`);

  if (weaveButtons.length > 1) {
    await weaveButtons[1].click(); // Fines rayures
    await page.waitForTimeout(500);
    console.log('✓ Clicked Fines rayures pattern');

    const recap3 = await page.locator('dl').textContent();
    console.log('Updated outfit:');
    console.log(recap3);
  }

  // Take final screenshot
  const screenshot = 'test-colors-result.png';
  await page.screenshot({ path: screenshot });
  console.log(`\n📸 Screenshot saved: ${screenshot}`);

  await browser.close();
  console.log('\n✅ Tests complete');
})().catch(console.error);
