import { test, expect } from '@playwright/test';

const benefits = [
  ['Accurate Information', 'Market details, schedules and produce all in one place.'],
  ['Seasonal Guidance', "Know what's likely to be available before you visit."],
  ['Support Local', 'Discover local farmers and markets in your community.'],
  ['Easy to Use', 'Simple, accessible experience for everyone.'],
];

for (const viewport of [{ width: 1280, height: 900 }, { width: 390, height: 844 }]) {
  test(`Why FreshFind lives on the final journal page at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Why FreshFind?' })).toHaveCount(0);
    await expect(page.locator('.why-card')).toHaveCount(0);

    const journal = page.locator('#journal');
    const mobile = viewport.width < 768;
    await journal.getByRole('button', { name: 'Open The FreshFind Field Journal' }).click();
    await expect(journal.getByRole('heading', { name: 'Why FreshFind?' })).toHaveCount(0);
    await journal.getByRole('button', { name: 'Go to spread 5: Your Market Field Guide' }).click();

    if (mobile) {


      await expect(journal.getByRole('heading', { name: 'Pocket tips for market day' })).toBeVisible();
      await expect(journal.getByRole('heading', { name: 'Why FreshFind?' })).toHaveCount(0);
      await journal.getByRole('button', { name: 'Turn to the next spread' }).click();
    }

    const lastPage = journal.locator(mobile ? '.fj-sheet-page' : '.fj-page--right .fj-page-inner').last();
    await expect(lastPage.getByRole('heading', { name: 'Why FreshFind?' })).toBeVisible();
    for (const [title, description] of benefits) {
      await expect(lastPage.getByRole('heading', { name: title, exact: true })).toBeVisible();
      await expect(lastPage.getByText(description, { exact: true })).toBeVisible();
    }
    if (mobile) {

      await expect(journal.getByRole('heading', { name: 'Pocket tips for market day' })).toHaveCount(0);
    } else {
      await expect(journal.getByRole('heading', { name: 'Pocket tips for market day' })).toBeVisible();
    }
    await expect(journal.getByRole('button', { name: 'Turn to the next spread' })).toBeDisabled();
    await expect(lastPage.getByRole('button', { name: 'Browse the Market Directory' })).toBeVisible();
    await expect(lastPage.getByRole('button', { name: 'Explore the Produce Guide' })).toBeVisible();
    expect(await lastPage.evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true);

    await journal.getByRole('button', { name: 'Turn to the previous spread' }).click();
    await expect(journal.getByRole('heading', { name: 'Why FreshFind?' })).toHaveCount(0);
    await journal.getByRole('button', { name: 'Turn to the next spread' }).click();
    await journal.getByRole('button', { name: '← close the journal', exact: true }).click();
    await expect(journal.getByRole('button', { name: 'Open The FreshFind Field Journal' })).toBeVisible();
  });
}
