import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  // External tiles are not needed to test our marker/filter behavior.
  await page.route('https://tile.openstreetmap.org/**', (route) => route.fulfill({ status: 200, contentType: 'image/png', body: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=', 'base64') }));
});

test('market hover and keyboard detail actions leave save independent', async ({ page }) => {
  await page.goto('/markets');
  const card = page.locator('.m-card').first();
  const detail = card.locator('.image-details-overlay');
  await expect(detail).toHaveCSS('opacity', '0');
  await card.hover();
  await expect(detail).toHaveCSS('opacity', '1');
  await card.getByRole('button', { name: /^Save / }).click();
  await expect(page.locator('.mm-dialog')).toHaveCount(0);
  await detail.click();
  await expect(page.locator('.mm-dialog')).toBeVisible();
  await page.getByRole('button', { name: /^Close .* details$/ }).click();
  await detail.focus();
  await detail.press('Enter');
  await expect(page.locator('.mm-dialog')).toBeVisible();
});

test('all area matches stay on the map after geolocation and filter changes', async ({ page, context }) => {
  await context.grantPermissions(['geolocation']);
  await context.setGeolocation({ latitude: 40.502, longitude: -74.019 });
  await page.goto('/markets');
  await page.getByRole('button', { name: 'Near Me', exact: true }).click();
  await expect(page.getByText('Location found!', { exact: false })).toBeVisible();
  await page.getByRole('button', { name: 'Filters', exact: true }).click();
  await page.getByRole('button', { name: 'Show market map' }).click();
  for (const area of ['Greenfield', 'Lakeview', 'Downtown', 'Eastside', 'Westside', 'Southside', 'Northside']) {
    await page.getByRole('button', { name: /Location \/ Area/ }).click();
    await page.getByRole('option', { name: area, exact: true }).click();
    await expect(page.locator('.m-card')).toHaveCount(2);
    await expect(page.locator('.ff-pin-icon')).toHaveCount(2);
    await expect(page.locator('.ffmap-chip')).toContainText('2 matching markets');
    await expect.poll(() => page.evaluate(() => {
      const box = document.querySelector('.ffmap-canvas').getBoundingClientRect();
      return [...document.querySelectorAll('.ff-pin-icon')].every((pin) => {
        const r = pin.getBoundingClientRect();
        return r.left >= box.left && r.right <= box.right && r.top >= box.top && r.bottom <= box.bottom;
      });
    }), { message: `Both ${area} pins are in view` }).toBe(true);
  }
  await page.getByRole('textbox', { name: 'Search the market directory' }).fill('no such market');
  await expect(page.locator('.ff-pin-icon')).toHaveCount(0);
  await expect(page.locator('.ffmap-chip')).toContainText('0 matching markets');
});

test('map-view image opens details instead of only focusing a marker', async ({ page }) => {
  await page.goto('/markets');
  await page.getByRole('button', { name: 'Show market map' }).click();
  await page.locator('.m-card .image-details-overlay').first().click();
  await expect(page.locator('.mm-dialog')).toBeVisible();
});

test('homepage planner replaces the how-to panel and contact has no follow box', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#contact')).not.toContainText('Follow Us');
  await expect(page.getByText('How the journal works for you')).toHaveCount(0);
  await page.getByRole('button', { name: 'Open The FreshFind Field Journal' }).click();
  await page.getByLabel('Where are you heading?').selectOption('Greenfield');
  await page.getByLabel('When would you like to go?').selectOption('Wednesday');
  await expect(page.locator('.journal-planner')).toContainText('1 market to explore');
  await page.getByRole('button', { name: 'See matches on the map' }).click();
  await expect(page).toHaveURL('/markets');
  await expect(page.locator('.ff-pin-icon')).toHaveCount(1);
  await expect(page.locator('.m-card')).toHaveCount(1);
});

test.describe('touch screens', () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  test('visible image actions open market and produce modals in one tap', async ({ page }) => {
    await page.goto('/markets');
    const action = page.locator('.m-card .image-details-overlay').first();
    await expect(action).toHaveCSS('opacity', '1');
    await action.tap();
    await expect(page.locator('.mm-dialog')).toBeVisible();
    await page.getByRole('button', { name: /^Close .* details$/ }).tap();
    await page.goto('/#produce');
    const produce = page.locator('.ff-produce-card').first();
    await produce.scrollIntoViewIfNeeded();
    await expect(produce.locator('.image-details-overlay')).toHaveCSS('opacity', '1');
    await produce.getByRole('button', { name: /^Save / }).tap();
    await expect(page.locator('.produce-detail-dialog')).toHaveCount(0);
    await produce.locator('.image-details-overlay').tap();
    await expect(page.locator('.produce-detail-dialog')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  });
});

async function mockVoice(page) {
  await page.addInitScript(() => {
    const voices = [
      { voiceURI: 'fr', name: 'French default', lang: 'fr-FR', default: true },
      { voiceURI: 'en', name: 'Natural English', lang: 'en-US', localService: false },
    ];
    window.voiceTest = { spoken: [], cancels: 0, aborted: 0 };
    Object.defineProperty(window, 'speechSynthesis', { value: {
      getVoices: () => voices,
      addEventListener() {}, removeEventListener() {},
      cancel() { window.voiceTest.cancels++; },
      speak(utter) { window.voiceTest.spoken.push({ text: utter.text, lang: utter.lang, voice: utter.voice?.voiceURI, rate: utter.rate }); window.voiceTest.utter = utter; },
    } });
    window.SpeechSynthesisUtterance = class { constructor(text) { this.text = text; } };
    window.SpeechRecognition = class {
      start() { window.voiceTest.rec = this; }
      stop() { this.onend?.(); }
      abort() { window.voiceTest.aborted++; this.onend?.(); }
    };
    window.voiceTest.result = (parts) => {
      window.voiceTest.rec.onresult({ results: parts.map((text) => [{ transcript: text }]) });
    };
  });
  await page.goto('/');
  await page.getByRole('button', { name: 'Open chat assistant' }).click();
}

test('dictation retains multiple phrases and requires review before sending', async ({ page }) => {
  await mockVoice(page);
  await page.getByRole('button', { name: 'Speak your question' }).click();
  await page.evaluate(() => window.voiceTest.result(['Find markets']));
  await page.evaluate(() => window.voiceTest.result(['Find markets', 'in Greenfield on Sunday']));
  const input = page.getByRole('textbox', { name: 'Message FreshFind Assistant' });
  await expect(input).toHaveValue('Find markets in Greenfield on Sunday');
  await expect(page.locator('.bubble.user')).toHaveCount(0);
  await page.getByRole('button', { name: 'Stop voice input' }).click();
  await expect(input).toBeEditable();
  await input.fill('Find markets in Greenfield');
  await page.getByRole('button', { name: 'Send message', exact: true }).click();
  await expect(page.locator('.bubble.user')).toHaveText('Find markets in Greenfield');
});

test('English voice, pace, stop, persistence and stale callbacks', async ({ page }) => {
  await mockVoice(page);
  await page.locator('.voice-settings summary').click();
  await page.getByLabel('Speaking pace', { exact: false }).fill('0.9');
  await page.getByRole('button', { name: 'Preview voice', exact: true }).click();
  const spoken = await page.evaluate(() => window.voiceTest.spoken[0]);
  expect(spoken).toMatchObject({ voice: 'en', lang: 'en-US', rate: .9 });
  expect(spoken.text).toContain('Fresh Find');
  await page.getByRole('button', { name: 'Stop preview', exact: true }).click();
  await page.evaluate(() => window.voiceTest.utter.onend());
  expect(await page.evaluate(() => window.voiceTest.spoken.length)).toBe(1);
  await page.getByRole('button', { name: 'Preview voice', exact: true }).click();
  await page.getByRole('button', { name: 'Speak your question' }).click();
  await expect(page.getByText('Speaking…', { exact: true })).toHaveCount(0);
  await page.getByRole('button', { name: 'Close chat', exact: true }).click();
  expect(await page.evaluate(() => window.voiceTest.aborted)).toBeGreaterThan(0);
  await page.reload();
  await page.getByRole('button', { name: 'Open chat assistant' }).click();
  await page.locator('.voice-settings summary').click();
  await expect(page.getByLabel('Speaking pace', { exact: false })).toHaveValue('0.9');
});

test('microphone errors are clear and typing still works', async ({ page }) => {
  await mockVoice(page);
  await page.getByRole('button', { name: 'Speak your question' }).click();
  await page.evaluate(() => window.voiceTest.rec.onerror({ error: 'not-allowed' }));
  await expect(page.locator('.voice-status')).toContainText('Microphone access was blocked');
  await expect(page.getByRole('textbox', { name: 'Message FreshFind Assistant' })).toBeEditable();
});

test('unsupported speech APIs preserve text chat', async ({ page }) => {
  await page.addInitScript(() => {
    delete window.SpeechRecognition;
    delete window.webkitSpeechRecognition;
    delete window.speechSynthesis;
  });
  await page.goto('/');
  await page.getByRole('button', { name: 'Open chat assistant' }).click();
  await expect(page.getByRole('button', { name: 'Speak your question' })).toHaveCount(0);
  await page.locator('.voice-settings summary').click();
  await expect(page.locator('.voice-settings')).toContainText('Voice input is not supported here');
  await page.getByRole('textbox', { name: 'Message FreshFind Assistant' }).fill('Hello');
  await page.getByRole('button', { name: 'Send message', exact: true }).click();
  await expect(page.locator('.bubble.user')).toHaveText('Hello');
});
