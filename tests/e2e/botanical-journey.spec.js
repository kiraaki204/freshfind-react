import { test, expect } from '@playwright/test';








const names = ['seed', 'seedling', 'young', 'mature'];

async function scrollToProgress(page, progress) {
  await page.evaluate((value) => {
    const doc = document.documentElement;
    const height = Math.max(doc.scrollHeight, document.body.scrollHeight);
    window.scrollTo({ top: (height - doc.clientHeight) * value, behavior: 'instant' });
  }, progress);
  await expect.poll(() => page.locator('.ff-journey').evaluate((el) => (
    Number.parseFloat(getComputedStyle(el).getPropertyValue('--journey-progress'))
  ))).toBeCloseTo(progress, 1);
}

async function stageStates(page) {
  return page.locator('.ff-stage').evaluateAll((elements) => elements.map((el) => ({
    stage: el.getAttribute('data-stage'),
    opacity: Number.parseFloat(getComputedStyle(el).opacity),
    visibility: getComputedStyle(el).visibility,
  })));
}

async function expectOpacities(page, expectations) {
  const states = await stageStates(page);
  for (const [stage, min, max] of expectations) {
    const entry = states.find((s) => s.stage === stage);
    expect(entry, `stage ${stage} should exist`).toBeTruthy();
    expect(entry.opacity, `stage ${stage} opacity`).toBeGreaterThanOrEqual(min);
    expect(entry.opacity, `stage ${stage} opacity`).toBeLessThanOrEqual(max);
    expect(entry.visibility, `stage ${stage} visibility`).toBe(
      min > 0.005 ? 'visible' : 'hidden',
    );
  }
}

for (const viewport of [{ width: 1280, height: 900 }, { width: 390, height: 844 }]) {
  test(`botanical journey stages reveal, persist and reverse at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');


    await scrollToProgress(page, 0);
    await expectOpacities(page, [
      ['seed', 0.99, 1],
      ['seedling', 0, 0.004],
      ['young', 0, 0.004],
      ['mature', 0, 0.004],
    ]);


    await scrollToProgress(page, 0.2);
    await expectOpacities(page, [
      ['seed', 0.99, 1],
      ['seedling', 0.5, 1],
      ['young', 0, 0.004],
      ['mature', 0, 0.004],
    ]);


    await scrollToProgress(page, 0.5);
    await expectOpacities(page, [
      ['seed', 0.99, 1],
      ['seedling', 0.99, 1],
      ['young', 0.4, 1],
      ['mature', 0, 0.004],
    ]);


    await scrollToProgress(page, 0.8);
    await expectOpacities(page, [
      ['seed', 0.99, 1],
      ['seedling', 0.99, 1],
      ['young', 0.99, 1],
      ['mature', 0.3, 1],
    ]);


    await scrollToProgress(page, 1);
    await expectOpacities(page, [
      ['seed', 0.99, 1],
      ['seedling', 0.99, 1],
      ['young', 0.99, 1],
      ['mature', 0.99, 1],
    ]);




    const rail = await page.locator('.ff-journey').boundingBox();
    const innerWidth = await page.evaluate(() => window.innerWidth);
    expect(rail).not.toBeNull();
    const railCenterX = rail.x + rail.width / 2;
    const fractions = { seed: [0, 0.12], seedling: [0.08, 0.3], young: [0.3, 0.6], mature: [0.75, 1] };
    for (const stage of names) {
      const box = await page.locator(`[data-stage="${stage}"]`).boundingBox();
      expect(box, `${stage} should have a layout box`).not.toBeNull();
      const centreY = (box.y + box.height / 2 - rail.y) / rail.height;
      const [lo, hi] = fractions[stage];
      expect(centreY, `${stage} station within rail`).toBeGreaterThanOrEqual(lo - 0.03);
      expect(centreY, `${stage} station within rail`).toBeLessThanOrEqual(hi + 0.03);
      const centreX = box.x + box.width / 2;
      expect(Math.abs(centreX - railCenterX), `${stage} centred on rail`).toBeLessThanOrEqual(8);
      expect(box.x + box.width, `${stage} inside viewport (no clipped ink)`).toBeLessThanOrEqual(innerWidth + 1);
    }


    const seedBox = await page.locator('[data-stage="seed"]').boundingBox();
    const matureBox = await page.locator('[data-stage="mature"]').boundingBox();
    expect(seedBox.width).toBeGreaterThanOrEqual(15);
    expect(matureBox.width).toBeGreaterThanOrEqual(26);
    expect(matureBox.height).toBeGreaterThanOrEqual(58);


    const draw = await page.evaluate(() => {
      const stem = document.querySelector('.ff-journey-line');
      return { offset: Number.parseFloat(stem.style.strokeDashoffset), length: stem.getTotalLength() };
    });
    expect(draw.offset).toBeLessThanOrEqual(draw.length * 0.02);


    await scrollToProgress(page, 0.2);
    await expectOpacities(page, [
      ['seed', 0.99, 1],
      ['seedling', 0.5, 1],
      ['young', 0, 0.004],
      ['mature', 0, 0.004],
    ]);
    await scrollToProgress(page, 0);
    await expectOpacities(page, [
      ['seed', 0.99, 1],
      ['seedling', 0, 0.004],
    ]);


    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(1);
    await expect(page.locator('.ff-journey')).toHaveAttribute('aria-hidden', 'true');
    await expect(page.locator('.ff-journey')).toHaveCSS('pointer-events', 'none');


    await page.getByRole('button', { name: 'Switch to dark theme' }).click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await expect(page.locator('[data-stage="seed"] .ff-fill-soft')).not.toHaveCSS('fill', 'none');
  });
}
