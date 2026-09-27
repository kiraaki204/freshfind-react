# FreshFind

Discover nearby farmers' markets, explore seasonal produce and plan your visit.

React + Vite + Bootstrap CSS. No backend — all data is static and bundled.

## Run it

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Structure

```
src/
├── chatbot/       assistant engine (NLU + intents, site-agnostic)
├── components/    reusable UI (cards, header, footer, map, chat, …)
├── data/          markets.json, produce.json — single source of truth
├── hooks/         shared state (bookmarks, geolocation, chat, filters, toasts)
├── pages/         one component per route
├── styles/        tokens, layout and component CSS
├── utils/         schedule/season, geo/distance, market filtering
├── App.jsx        routes + providers
└── main.jsx       entry point
```

Data files:

- `src/data/markets.json`
- `src/data/produce.json`

## Interaction updates

- Card images reveal a dark glass detail action on hover/focus; touch devices
  show the action without a hover gesture. Save buttons remain independent.
- The journal's market planner applies area/day filters directly to the map.
  The map and directory share the same results, including after location permission
  is granted.
- Market pictures are representative stock photography, not verified locations.
  Produce uses custom stylized imagery. Sources: `public/images/CREDITS.md`.

## Voice assistant

Uses browser Web Speech APIs; no API keys or backend are required. In the chat's
**Voice settings**, choose an English accent, an available voice, and pace.
Preferences are stored locally. Natural/enhanced English voices are preferred
when the device provides them; quality varies by browser/OS. Dictation is a draft:
finish with the mic button, review/edit, then send. Closing chat releases the mic
and stops playback. Browser speech recognition may use an online service and
requires microphone permission in a secure context (HTTPS or localhost).

## Tests

```bash
npm test                         # data, map consistency, speech utilities
npx playwright install chromium # first-time browser install
npm run test:e2e                  # desktop/touch interactions and mocked Web Speech
npm run build
```

For an existing Chromium installation, set
`PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` to its executable path. Browser tests mock speech services and external map tiles.
