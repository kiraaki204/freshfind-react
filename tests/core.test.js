import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { visibleMarkets, nearbyMarkets } from '../src/utils/geo.js';
import { applyMarketFilters } from '../src/utils/markets.js';
import { chooseVoice, cleanForSpeech, speechChunks } from '../src/utils/voice.js';
const markets = JSON.parse(readFileSync(new URL('../src/data/markets.json', import.meta.url)));
const produce = JSON.parse(readFileSync(new URL('../src/data/produce.json', import.meta.url)));

test('map and list match every area, with and without a visitor location', () => {
  for (const area of new Set(markets.map((m) => m.area))) {
    const list = applyMarketFilters(markets, { area }, {});
    assert.equal(list.length, 2, area);
    for (const user of [null, { lat: 40.5, lng: -74 }, { lat: 51.5, lng: -.12 }]) {
      assert.deepEqual(visibleMarkets(list, user).displayed, list, area);
    }
  }
});
test('a radius boundary never hides a listed result', () => {
  const list = [{ id: 1, lat: 0, lng: 0 }, { id: 2, lat: 1, lng: 0 }];
  const user = { lat: 0, lng: 0 };
  assert.equal(nearbyMarkets(list, user).near.length, 1);
  assert.equal(visibleMarkets(list, user).displayed.length, 2);
  assert.deepEqual(visibleMarkets([], user).displayed, []);
});
test('filters combine without adding extra map markets', () => {
  const list = applyMarketFilters(markets, { area: 'Greenfield', day: 'Wednesday', produce: 'Dairy' }, {});
  assert.ok(list.length > 0);
  assert.deepEqual(visibleMarkets(list, null).displayed, list);
  assert.deepEqual(visibleMarkets(applyMarketFilters(markets, { search: 'no such market' }, {}), null).displayed, []);
});
test('all market and produce images exist locally', () => {
  for (const image of [...markets.flatMap((m) => [m.image, ...m.gallery]), ...produce.map((p) => p.image)]) {
    assert.ok(image.startsWith('/images/'));
    assert.ok(existsSync(new URL(`../public${image}`, import.meta.url)), image);
  }
});
const voices = [
  { voiceURI: 'fr', name: 'Default French', lang: 'fr-FR', default: true },
  { voiceURI: 'us-basic', name: 'Basic English', lang: 'en-US', localService: true },
  { voiceURI: 'us-natural', name: 'Natural English', lang: 'en-US', localService: false },
  { voiceURI: 'uk', name: 'Enhanced UK', lang: 'en-GB', localService: true },
];
test('voice selection prioritizes English, accent, quality and explicit choice', () => {
  assert.equal(chooseVoice(voices, 'en-US').voiceURI, 'us-natural');
  assert.equal(chooseVoice(voices, 'en-GB').voiceURI, 'uk');
  assert.equal(chooseVoice(voices, 'en-US', 'us-basic').voiceURI, 'us-basic');
  assert.equal(chooseVoice(voices, 'en-US', 'removed').voiceURI, 'us-natural');
  assert.equal(chooseVoice([voices[0]], 'en-US'), null);
  assert.equal(chooseVoice([], 'en-US'), null);
});
test('speech copy normalizes brand, times, markup and distance', () => {
  const cleaned = cleanForSpeech('🌿 **FreshFind** opens at 09:00 AM · 2 km away.\n[Markets](https://example.org) & produce');
  assert.equal(cleaned, 'Fresh Find opens at 9 A M. 2 kilometres away. Markets and produce');
  assert.match(cleanForSpeech('9:05 PM'), /9 oh 5 P M/);
});
test('long replies are split safely without lost or repeated words', () => {
  const text = `FreshFind is here. ${'Find local markets and seasonal produce. '.repeat(20)}`;
  const chunks = speechChunks(text);
  assert.ok(chunks.every((chunk) => chunk.length <= 220));
  assert.equal(chunks.join(' '), cleanForSpeech(text));
  assert.deepEqual(speechChunks(''), []);
});

test('decimal ratings and distances are not broken into separate utterances', () => {
  assert.deepEqual(speechChunks('Rated 4.9 stars, just 2.5 km away.'), ['Rated 4.9 stars, just 2.5 kilometres away.']);
});

test('header stacks above leaflet maps so contact map cannot cover the nav', () => {
  const css = readFileSync(new URL('../src/index.css', import.meta.url), 'utf8');
  const header = css.match(/\.site-header\s*\{[^}]*z-index:\s*(\d+)/);
  const miniMap = css.match(/\.mini-map\s*\{[^}]*\}/s);
  assert.ok(header, 'site-header z-index is set');
  assert.ok(Number(header[1]) > 1000, 'header sits above Leaflet panes/controls');
  assert.match(miniMap?.[0] ?? '', /isolation:\s*isolate/);
  assert.match(miniMap?.[0] ?? '', /z-index:\s*0/);
});
