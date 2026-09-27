import { test, expect } from '@playwright/test';

const checkpoints = [
  { progress: 0, stage: 'seed' },
  { progress: 0.2, stage: 'seedling' },
  { progress: 0.5, stage: 'young' },
  { progress: 0.82, stage: 'mature' },
  { progress: 1, stage: 'mature' },
];

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

async function expectStage(page, expected) {
  const stages = page.locator('.ff-stage');
  const opacities = await stages.evaluateAll((elements) => elements.map((element) => (
    Number.parseFloat(getComputedStyle(element).opacity)
  )));
  const names = ['seed', 'seedling', 'young', 'mature'];
  expect(names[opacities.indexOf(Math.max(...opacities))]).toBe(expected);
  await expect(page.locator(`[data-stage="${expected}"]`)).toHaveCSS('visibility', 'visible');
}

for (const viewport of [{ width: 1280, height: 900 }, { width: 390, height: 844 }]) {
  test(`all botanical stages follow scroll in both directions at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');

    for (const checkpoint of checkpoints) {
      await scrollToProgress(page, checkpoint.progress);
      await expectStage(page, checkpoint.stage);
    }

    // Scrolling upward must use the same reversible progress mapping.
    await scrollToProgress(page, 0.5);
    await expectStage(page, 'young');
    await scrollToProgress(page, 0.2);
    await expectStage(page, 'seedling');
    await scrollToProgress(page, 0);
    await expectStage(page, 'seed');

    const stageViewport = await page.locator('.ff-journey-stages').boundingBox();
    expect(stageViewport).not.toBeNull();
    expect(stageViewport.width).toBeGreaterThanOrEqual(44);

    // Theme tokens must keep the illustrations painted in both themes.
    await page.getByRole('button', { name: 'Switch to dark theme' }).click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await expect(page.locator('[data-stage="seed"] .ff-fill-soft')).not.toHaveCSS('fill', 'none');
  });
}
