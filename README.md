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
├── utils/         schedule/season, geo/distance, market filtering
├── App.jsx        routes + providers
└── main.jsx       entry point
```

Data files:

- `src/data/markets.json`
- `src/data/produce.json`
