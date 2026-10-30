const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  console.log('🌐 Accès à https://maison-verlaine-next.vercel.app/...');
  await page.goto('https://maison-verlaine-next.vercel.app/', { waitUntil: 'networkidle', timeout: 30000 });

  console.log('✓ Page chargée');

  // Attends que le contenu soit visible
  await page.waitForTimeout(2000);

  // Test 1: Vérifier que les éléments sont présents
  const hasPanel = await page.locator('.h-full.w-96').isVisible().catch(() => false);
  const hasTitle = await page.locator('h1').isVisible().catch(() => false);

  console.log(`✓ Panel visible: ${hasPanel}`);
  console.log(`✓ Titre visible: ${hasTitle}`);

  // Test 2: Cherche les boutons de couleur
  const colorButtons = await page.locator('button[style*="--c"]').count().catch(() => 0);
  console.log(`✓ Boutons couleur trouvés: ${colorButtons}`);

  // Test 3: Clique sur un bouton couleur
  try {
    const firstColorButton = page.locator('button[style*="--c"]').first();
    if (await firstColorButton.isVisible()) {
      console.log('💾 Test clique sur couleur...');
      await firstColorButton.click();
      await page.waitForTimeout(500);
      console.log('✓ Clique réussi');
    }
  } catch (e) {
    console.log('⚠ Clique impossible:', e.message);
  }

  // Test 4: Vérifier le contenu du récapitulatif
  const recap = await page.locator('dl').textContent().catch(() => '');
  console.log(`\n📋 Récapitulatif visible:`);
  console.log(recap.substring(0, 200));

  // Screenshot
  await page.screenshot({ path: 'test-prod-result.png' });
  console.log('\n📸 Screenshot: test-prod-result.png');

  await browser.close();
  console.log('\n✅ Tests terminés!');
})().catch(console.error);
