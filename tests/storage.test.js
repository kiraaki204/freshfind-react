import test from 'node:test';
import assert from 'node:assert/strict';
import { readJSON, writeJSON } from '../src/utils/storage.js';

test('readJSON returns its fallback and clears corrupt storage', () => {
  const values = new Map([['broken', '{{{']]);
  globalThis.localStorage = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
  };
  assert.deepEqual(readJSON('broken', []), []);
  assert.equal(values.has('broken'), false);
});

test('writeJSON and readJSON round-trip values', () => {
  writeJSON('saved', { ok: true });
  assert.deepEqual(readJSON('saved', null), { ok: true });
});
