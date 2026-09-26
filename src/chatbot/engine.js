/* FreshFind Assistant — understanding + intent engine.
 *
 * Pure logic module: tokenise → synonym-expand → extract entities →
 * score intents → answer live from the market/produce data. Anything that
 * acts on the site (navigation, filters, bookmarks, location, map) goes
 * through the `agent` object injected by the caller, so this module never
 * touches React or the DOM. Product/market info always comes from the
 * shared data files — single source of truth.
 *
 * The shopping cart is chat-only (there is no cart UI on the site), so it
 * lives here, persisted to localStorage the same way bookmarks are. Lines
 * only store produce id + qty; names/emojis resolve live from produceData.
 */

import marketsData from '../data/markets.json';
import produceData from '../data/produce.json';
import { formatTime, getMarketStatus, getNextOpenDay, getCurrentSeason, todayName } from '../utils/time.js';
import { NEAR_RADIUS_KM, nearbyMarkets, fmtDist } from '../utils/geo.js';
import { marketMatchesQuery } from '../utils/markets.js';

export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const DAY_ABBR = {
  Monday: 'Mon', Tuesday: 'Tue', Wednesday: 'Wed', Thursday: 'Thu',
  Friday: 'Fri', Saturday: 'Sat', Sunday: 'Sun',
};

/* ------------------------------------------------------------------ types */

export const emptyContext = () => ({
  lastMarketId: null,
  lastProduceId: null,
  lastIntent: null,
  turns: 0,
});

/* --------------------------------------------------------- text utilities */

const STOPWORDS = new Set([
  'a','an','the','is','are','am','was','were','be','been','do','does','did','doing',
  'i','me','my','you','your','it','its','to','of','in','on','at','for','with','and',
  'or','can','could','would','should','will','shall','please','have','has','had',
  'about','any','some','there','that','this','these','those','tell','know','want',
  'need','like','get','got','go','going','show','looking','look','find','found',
]);

/** lower-case, strip punctuation, expand "&" */
function normalizeText(input) {
  return input
    .toLowerCase()
    .replace(/[’']/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function singular(word) {
  if (word.length > 4 && word.endsWith('ies')) return `${word.slice(0, -3)}y`;
  if (word.length > 3 && word.endsWith('s') && !word.endsWith('ss') && !word.endsWith('us')) {
    return word.slice(0, -1);
  }
  return word;
}

function levenshtein(a, b) {
  const m = a.length;
  const n = b.length;
  if (!m) return n;
  if (!n) return m;
  let prev = Array.from({ length: n + 1 }, (_, i) => i);
  for (let i = 1; i <= m; i += 1) {
    const cur = [i];
    for (let j = 1; j <= n; j += 1) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    prev = cur;
  }
  return prev[n];
}

/** tolerant single-word comparison — absorbs typos on longer words */
function fuzzyHas(tokenList, word) {
  if (word.length < 4) return false;
  const tolerance = word.length >= 8 ? 2 : 1;
  return tokenList.some((t) => {
    if (Math.abs(t.length - word.length) > tolerance) return false;
    return levenshtein(t, word) <= tolerance;
  });
}

/* ------------------------------------------------------------ vocabulary */

const SYNONYMS = {
  // greetings / politeness
  hello: 'hi', hey: 'hi', hiya: 'hi', howdy: 'hi', yo: 'hi', morning: 'hi',
  thanks: 'thanks', thank: 'thanks', thankyou: 'thanks', thx: 'thanks', ty: 'thanks',
  cheers: 'thanks', appreciate: 'thanks',
  bye: 'bye', goodbye: 'bye', cya: 'bye', later: 'bye',
  // days
  mon: 'monday', tue: 'tuesday', tues: 'tuesday', wed: 'wednesday', weds: 'wednesday',
  thu: 'thursday', thurs: 'thursday', fri: 'friday', sat: 'saturday', sun: 'sunday',
  // time words
  timing: 'hours', timings: 'hours', schedule: 'hours', hr: 'hours', hrs: 'hours',
  opens: 'open', opening: 'open', opened: 'open', closing: 'close',
  // proximity
  closest: 'near', nearest: 'near', nearby: 'near', around: 'near', proximity: 'near',
  // produce words
  veggie: 'vegetables', veggies: 'vegetables', veg: 'vegetables',
  fruit: 'fruits',
  // quality
  top: 'best', rated: 'best', rating: 'best', popular: 'best', recommend: 'best',
  recommended: 'best', favourite: 'best', favorite: 'best',
  // saving
  bookmark: 'bookmark', bookmarks: 'bookmark', save: 'bookmark', saved: 'bookmark',
  favourite2: 'bookmark', wishlist: 'bookmark', heart: 'bookmark', unsave: 'remove',
  // cart
  basket: 'cart', trolley: 'cart',
  // clear / remove
  empty: 'clear', wipe: 'clear', erase: 'clear', delete: 'remove',
  // misc
  pesticide: 'organic', pesticides: 'organic',
  wheelchair: 'accessible', disability: 'accessible', disabled: 'accessible',
  pram: 'accessible', stroller: 'accessible',
  dogs: 'pet', dog: 'pet', pets: 'pet', dogfriendly: 'pet',
  car: 'parking', park: 'parking',
  autum: 'autumn', fall: 'autumn',
  directions: 'address', located: 'address', location: 'address', map: 'address',
};

const ASPECT_WORDS = {
  hours: ['hours', 'time', 'open', 'close', 'when', 'schedule', 'day', 'days'],
  address: ['address', 'where', 'directions', 'located', 'location', 'map', 'place', 'far', 'distance', 'distance2'],
  contact: ['contact', 'email', 'phone', 'call', 'number', 'website', 'site', 'reach'],
  parking: ['parking', 'parking2', 'car'],
  pet: ['pet', 'dogs', 'dog'],
  accessible: ['accessible', 'wheelchair', 'disability', 'disabled', 'pram', 'stroller'],
  rating: ['rating', 'rated', 'stars', 'review', 'reviews', 'score'],
  vendors: ['vendors', 'stalls', 'stall', 'sellers', 'shops', 'size', 'big'],
  produce: ['produce', 'sell', 'sells', 'selling', 'stock', 'available', 'offer'],
  price: ['price', 'prices', 'cost', 'costs', 'cheap', 'expensive', 'budget'],
  established: ['established', 'since', 'founded', 'history', 'old', 'long'],
};

/** market-name keywords (deliberately excludes generic words like "market") */
const MARKET_KEYWORDS = {
  1: ['riverside'],
  2: ['lakeside', 'lake'],
  3: ['maple'],
  4: ['central', 'city', 'downtown'],
  5: ['valley', 'greenfield'],
  6: ['sunnyside'],
  7: ['harbour', 'harbor'],
  8: ['meadow', 'lane'],
};

const PRODUCE_KEYWORDS = {
  tomatoes: ['tomato', 'tomatos', 'tamato', 'cherry'],
  carrots: ['carrot'],
  'leafy-greens': ['leafy', 'greens', 'spinach', 'kale', 'lettuce', 'rocket', 'silverbeet', 'chard', 'salad'],
  strawberries: ['strawberry'],
  berries: ['berry', 'blueberry', 'raspberry', 'blackberry'],
  corn: ['corn', 'maize', 'sweetcorn'],
  cucumbers: ['cucumber'],
  peppers: ['pepper', 'capsicum', 'chilli', 'chili'],
  pumpkins: ['pumpkin', 'squash'],
  apples: ['apple', 'cider'],
  'root-veg': ['root', 'parsnip', 'beetroot', 'turnip', 'swede'],
  citrus: ['citrus', 'orange', 'lemon', 'lime', 'mandarin', 'grapefruit'],
  herbs: ['herb', 'basil', 'thyme', 'rosemary', 'parsley', 'coriander', 'cilantro', 'mint', 'chives', 'dill'],
  eggs: ['egg'],
  honey: ['honey'],
  bread: ['bread', 'bakery', 'baguette', 'sourdough', 'pastry', 'pastries', 'cake'],
  flowers: ['flower', 'bouquet', 'blooms'],
  dairy: ['dairy', 'cheese', 'milk', 'yoghurt', 'yogurt', 'butter'],
  radishes: ['radish'],
  asparagus: ['asparagus'],
};

const AREAS = ['greenfield', 'lakeview', 'northside', 'downtown', 'eastside', 'westside', 'southside'];

const CATEGORY_WORDS = {
  Vegetables: ['vegetables', 'vegetable', 'veg', 'veggies', 'vegetarian', 'vegan'],
  Fruits: ['fruits', 'fruit'],
  Dairy: ['dairy', 'cheese', 'milk', 'eggs'],
  'Baked Goods': ['bread', 'bakery', 'baked', 'pastries'],
  Flowers: ['flowers', 'flower', 'bouquet'],
  Herbs: ['herbs', 'herb'],
  Other: ['honey', 'other'],
};

const GREETING_RE =
  /(^|\s)(hi|hello|hey|hiya|yo|howdy|good morning|good afternoon|good evening|salam|assalamualaikum|assalam)(\s|$|[!,.?])/;

/** quantities the agent understands ("add 2 tomatoes", "add two tomatoes") */
const NUM_WORDS = {
  one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8,
  nine: 9, ten: 10, eleven: 11, twelve: 12, dozen: 12, couple: 2, few: 3,
};

/** words that are never the "thing" a user is asking about (used by leftoverNoun) */
const ACTION_NOISE = new Set([
  'cart', 'basket', 'trolley', 'add', 'put', 'place', 'drop', 'remove', 'take',
  'clear', 'find', 'search', 'show', 'buy', 'order', 'please', 'now', 'item',
  'items', 'something', 'anything', 'thing', 'things', 'many', 'much', 'inside',
  'there', 'currently', 'today', 'right',
]);

/* ---------------------------------------------------------- time helpers */

function formatDays(days) {
  return days.map((d) => DAY_ABBR[d] ?? d).join(' & ');
}

/** Live open / closed state computed from the market's real schedule. */
function liveMarketStatus(market) {
  const st = getMarketStatus(market);
  if (st.status === 'open') {
    return { open: true, label: `Open now · closes ${formatTime(market.closingTime)}` };
  }
  if (st.status === 'opens-today') {
    return { open: false, label: `Opens today at ${formatTime(market.openingTime)}` };
  }
  const next = getNextOpenDay(market);
  if (!next) return { open: false, label: 'Closed' };
  const when = next.inDays === 1 ? 'tomorrow' : next.day.toLowerCase();
  return { open: false, label: `Closed · opens ${when} ${formatTime(market.openingTime)}` };
}

/* -------------------------------------------------------------- entities */

function buildTokens(norm) {
  const out = new Set();
  for (const rawToken of norm.split(' ')) {
    if (!rawToken) continue;
    const mapped = SYNONYMS[rawToken] ?? rawToken;
    out.add(mapped);
    out.add(singular(mapped));
  }
  return out;
}

function detectMarket(tokens, tokenList) {
  let best = null;
  let bestScore = 0;
  for (const m of marketsData) {
    const words = MARKET_KEYWORDS[m.id] ?? [];
    let score = 0;
    for (const w of words) {
      if (tokens.has(w)) score += 3;
      // fuzzy only on 5+ letter names — shorter words cause false hits
      // ("take" ≈ "lake" → Lakeside!). Exact matching still covers them.
      else if (w.length >= 5 && fuzzyHas(tokenList, w)) score += 3; // "central citi"
    }
    if (score > bestScore) {
      bestScore = score;
      best = m;
    }
  }
  return bestScore >= 3 ? best : null;
}

function detectProduce(tokens, tokenList) {
  let best = null;
  let bestScore = 0;
  for (const p of produceData) {
    const words = PRODUCE_KEYWORDS[p.id] ?? [singular(p.id)];
    let score = 0;
    for (const w of words) {
      if (tokens.has(w) || tokens.has(singular(w))) score += 3;
      else if (w.length >= 5 && fuzzyHas(tokenList, w)) score += 3; // "honney"
    }
    if (score > bestScore) {
      bestScore = score;
      best = p;
    }
  }
  return bestScore >= 3 ? best : null;
}

function detectDay(tokens, tokenList) {
  for (const d of DAYS) {
    if (tokens.has(d.toLowerCase()) || fuzzyHas(tokenList, d.toLowerCase())) {
      return { day: d, label: d };
    }
  }
  const fuzzy = (w) => tokens.has(w) || fuzzyHas(tokenList, w);
  if (fuzzy('weekend')) return { day: 'weekend', label: 'the weekend' };
  if (fuzzy('weekday')) return { day: 'weekday', label: 'weekdays' };
  if (fuzzy('today')) return { day: todayName(), label: 'today' };
  if (fuzzy('tomorrow')) {
    const now = new Date();
    const sundayFirst = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return { day: sundayFirst[(now.getDay() + 1) % 7], label: 'tomorrow' };
  }
  return { day: null, label: null };
}

function extract(raw, ctx, useMemory = false) {
  const norm = normalizeText(raw);
  const tokens = buildTokens(norm);
  const tokenList = [...tokens];

  let market = detectMarket(tokens, tokenList);
  let produce = detectProduce(tokens, tokenList);
  const { day, label } = detectDay(tokens, tokenList);

  let area = null;
  for (const a of AREAS) {
    if (tokens.has(a) || fuzzyHas(tokenList, a)) {
      area = a;
      break;
    }
  }

  let season = null;
  for (const s of ['spring', 'summer', 'autumn', 'winter']) {
    if (tokens.has(s) || fuzzyHas(tokenList, s)) {
      season = s === 'autumn' ? 'Autumn' : s.charAt(0).toUpperCase() + s.slice(1);
      break;
    }
  }

  let category = null;
  for (const [cat, words] of Object.entries(CATEGORY_WORDS)) {
    if (words.some((w) => tokens.has(w) || (w.length >= 5 && fuzzyHas(tokenList, w)))) {
      category = cat;
      break;
    }
  }

  // aspects use EXACT matching only — fuzzy matching here produced
  // nonsense like "does"→"dogs" and "tell"→"sell"
  const aspects = new Set();
  for (const [aspect, words] of Object.entries(ASPECT_WORDS)) {
    if (words.some((w) => tokens.has(w))) aspects.add(aspect);
  }

  // a named market beats a produce guess ("green valley" ≠ leafy greens)
  if (market && produce && tokens.has('market')) produce = null;

  // ---- conversation memory (opt-in, see getReply) ----
  if (useMemory) {
    if (!market && ctx.lastMarketId) {
      market = marketsData.find((m) => m.id === ctx.lastMarketId) ?? null;
    }
    if (!produce && ctx.lastProduceId) {
      produce = produceData.find((p) => p.id === ctx.lastProduceId) ?? null;
    }
  }

  return {
    raw,
    norm,
    tokens,
    tokenList,
    e: { market, produce, day, dayLabel: label, area, season, category, aspects },
    ctx,
    greeted: GREETING_RE.test(norm),
  };
}

/**
 * Intent keyword test — exact match, plus typo tolerance on longer words
 * ("organik" → "organic"). Short words stay exact so "does" can't match "dogs".
 */
const has = (q, ...words) =>
  words.some((w) => q.tokens.has(w) || (w.length >= 5 && fuzzyHas(q.tokenList, w)));

/* ---------------------------------------------------------- card builders */

function chatMarketCard(m) {
  const st = liveMarketStatus(m);
  return {
    type: 'market',
    id: String(m.id),
    title: m.name,
    subtitle: `${m.location} · ${m.area}`,
    meta: `${formatDays(m.days)} · ${formatTime(m.openingTime)} – ${formatTime(m.closingTime)}`,
    image: m.image,
    badge: st.open ? '● Open now' : formatDays(m.days),
  };
}

function chatProduceCard(p) {
  const season = getCurrentSeason();
  return {
    type: 'produce',
    id: p.id,
    title: `${p.emoji} ${p.name}`,
    subtitle: p.category,
    meta: `Season: ${p.season.join(', ')}`,
    image: p.image,
    badge: p.season.includes(season) ? 'In season' : undefined,
  };
}

/** markets that stock a given produce item (both directions of the relation) */
function marketsForProduce(p) {
  return marketsData.filter((m) => m.produce.includes(p.id) || p.markets.includes(m.id));
}

/** markets that carry a whole category (single source: market ↔ produce data) */
function marketsWithCategory(cat) {
  return marketsData.filter((m) =>
    m.produceTypes.includes(cat) || m.tags.includes(cat) ||
    m.produce.some((pid) => {
      const pd = produceData.find((x) => x.id === pid);
      return pd && pd.category === cat;
    }));
}

/* ============================================================================
 * SHOPPING CART (chat-only, persisted like bookmarks)
 * ========================================================================== */

const CART_KEY = 'freshfind_cart';
let cartCache = null;

function cart() {
  if (!Array.isArray(cartCache)) {
    let stored = [];
    try { stored = JSON.parse(localStorage.getItem(CART_KEY) || '[]'); } catch { /* ignore */ }
    cartCache = Array.isArray(stored)
      ? stored.filter((l) => l && l.id && Number(l.qty) > 0)
      : [];
  }
  return cartCache;
}

function persistCart() {
  try { localStorage.setItem(CART_KEY, JSON.stringify(cart())); } catch { /* ignore */ }
}

function cartLine(id) {
  return cart().find((l) => l.id === id) || null;
}

function cartCount() {
  return cart().reduce((n, l) => n + l.qty, 0);
}

function cartLabel(line) {
  const p = produceData.find((x) => x.id === line.id);
  return p ? `${p.emoji} ${p.name}` : line.id;
}

function addToCart(p, qty) {
  const amount = Math.max(1, Math.min(99, Math.floor(qty) || 1));
  const line = cartLine(p.id);
  if (line) line.qty = Math.min(99, line.qty + amount);
  else cart().push({ id: p.id, qty: amount, addedAt: new Date().toISOString() });
  persistCart();
  return cartLine(p.id);
}

function removeFromCart(p) {
  const had = !!cartLine(p.id);
  cartCache = cart().filter((l) => l.id !== p.id);
  persistCart();
  return had;
}

function clearCart() {
  const n = cartCount();
  cartCache = [];
  persistCart();
  return n;
}

function cartSummary() {
  return cart().map((l) => `• ${cartLabel(l)} × ${l.qty}`).join('\n');
}

/* --------------------------------------------------------------- agent utils */

function parseQty(q) {
  for (const t of q.tokenList) {
    if (/^\d+$/.test(t)) {
      const n = parseInt(t, 10);
      if (n >= 1 && n <= 99) return n;
    }
    if (NUM_WORDS[t] != null) return NUM_WORDS[t];
  }
  return 1;
}

/** the "thing" the user mentioned that we failed to resolve (e.g. "bananas") */
function leftoverNoun(q) {
  const words = q.norm.split(' ').filter((t) => {
    const mapped = SYNONYMS[t] ?? t;
    return t && !STOPWORDS.has(mapped) && !STOPWORDS.has(t)
      && !ACTION_NOISE.has(mapped) && !ACTION_NOISE.has(t)
      && !NUM_WORDS[mapped] && !/^\d+$/.test(t)
      && !['add', 'put', 'place', 'take', 'bring', 'go', 'visit', 'navigate', 'head',
           'open', 'show', 'me', 'us', 'to', 'the', 'my', 'in', 'out', 'off', 'from',
           'into', 'on', 'for', 'with', 'and', 'please', 'hey', 'hi', 'you', 'i',
           'find', 'search', 'get', 'want', 'need', 'buy', 'remove', 'clear',
           'section', 'page', 'guide', 'tab', 'markets', 'market', 'directory',
           'produce', 'items', 'item', 'of', 'a', 'an', 'some', 'any', 'do', 'does',
           'is', 'are', 'whats', 'what', 'which', 'where', 'how', 'many', 'much',
           'have', 'has', 'there', 'left', 'be', 'been'].includes(mapped);
  });
  return words.slice(0, 3).join(' ');
}

const PAGE_WORDS = [
  { page: 'home', words: ['home', 'homepage', 'start', 'landing'] },
  { page: 'bookmarks', words: ['bookmark', 'wishlist', 'favourite', 'favorite'] },
  { page: 'about', words: ['about'] },
  { page: 'contact', words: ['contact'] },
  { page: 'produce', words: ['produce'] },
  { page: 'directory', words: ['directory', 'market', 'markets'] },
];

/** what a navigation command ("take me to …") is pointing at */
function navTarget(q) {
  if (q.e.market) return { kind: 'market', market: q.e.market };
  if (q.e.produce) return { kind: 'produce', produce: q.e.produce };
  if (q.e.category) return { kind: 'category', category: q.e.category };
  for (const pw of PAGE_WORDS) {
    if (pw.words.some((w) => q.tokens.has(w) || q.tokens.has(singular(w)))) {
      return { kind: 'page', page: pw.page };
    }
  }
  return null;
}

/* --------------------------------------------------------------- intents */

const nl = (parts) => parts.filter((p) => Boolean(p)).join('\n');

function buildIntents(agent) {
  return [
    /* ====================================================== CART (actions) */
    {
      id: 'cart_clear',
      score: (q) => {
        if (!q.tokens.has('cart')) return 0;
        if (has(q, 'clear', 'wipe', 'erase', 'reset')) return 42;
        if (q.tokens.has('clear')) return 42; // 'empty' maps to 'clear' via synonyms
        if (has(q, 'remove') && has(q, 'all', 'everything')) return 42;
        return 0;
      },
      handle: () => {
        const n = clearCart();
        if (!n) {
          return {
            text: `🧺 Your cart is already empty — nothing to clear!`,
            suggestions: ['Add tomatoes to my cart', 'Show me vegetables', 'What produce is in season?'],
          };
        }
        return {
          text: `🧹 Done — I removed ${n} item${n > 1 ? 's' : ''} from your cart. It's empty now.`,
          suggestions: ['Add tomatoes to my cart', 'Show me vegetables', 'What produce is in season?'],
        };
      },
    },

    {
      id: 'cart_remove',
      score: (q) => {
        if (has(q, 'bookmark')) return 0; // "…from my saved items" → bookmarks
        if (!has(q, 'remove', 'take', 'drop')) return 0;
        if (q.tokens.has('cart')) return 40;
        if (q.e.produce && !q.tokens.has('where')) return 34; // bare "remove tomatoes"
        return 0;
      },
      handle: (q) => {
        const p = q.e.produce;
        if (!p) {
          const c = cart();
          if (!c.length) {
            return {
              text: `🧺 Your cart is empty — there's nothing to remove.`,
              suggestions: ['Add tomatoes to my cart', 'Show me vegetables'],
            };
          }
          return {
            text: `Which item should I take out? Your cart currently has:\n\n${cartSummary()}`,
            suggestions: c.slice(0, 3).map((l) => `Remove ${cartLabel(l).replace(/^\S+\s/, '').toLowerCase()} from my cart`),
          };
        }
        const had = removeFromCart(p);
        if (!had) {
          const c = cart();
          return {
            text: `${p.emoji} ${p.name} isn't in your cart${c.length ? '. Currently in your cart:' : ' — it\'s empty right now.'}\n\n${c.length ? cartSummary() : ''}`.trim(),
            suggestions: [`Add ${p.name.toLowerCase()} to my cart`, "What's in my cart?"],
          };
        }
        const c = cart();
        return {
          text: `🗑️ Done — I took ${p.name} out of your cart.${c.length ? '\n\nStill in your cart:\n' + cartSummary() : ' Your cart is now empty.'}`,
          suggestions: c.length ? ["What's in my cart?", 'Clear my cart'] : ['Add tomatoes to my cart', 'Show me vegetables'],
        };
      },
    },

    {
      id: 'cart_add',
      score: (q) => {
        if (has(q, 'bookmark')) return 0;
        const addV = has(q, 'add', 'put', 'place', 'drop', 'throw', 'toss');
        const wantV = has(q, 'want', 'need', 'like', 'order', 'buy');
        if (q.tokens.has('cart')) return addV || wantV ? 40 : 30;
        if (addV && q.e.produce) return 38; // bare "add 2 tomatoes"
        return 0;
      },
      handle: (q) => {
        const p = q.e.produce;
        if (!p) {
          const guess = leftoverNoun(q);
          return {
            text: guess
              ? `🤔 I couldn't find "${guess}" in our produce data, so I haven't added anything — I never invent items. We currently stock: ${produceData.map((x) => x.name).join(', ')}.`
              : `What would you like in your cart? Try "Add tomatoes to my cart".`,
            suggestions: ['Add tomatoes to my cart', 'Add honey to my cart', 'Show me vegetables'],
          };
        }
        const qty = parseQty(q);
        addToCart(p, qty);
        const line = cartLine(p.id);
        const total = cartCount();
        return {
          text: `${p.emoji} Added ${qty > 1 ? qty + ' × ' : ''}${p.name} to your cart — that's ${line.qty} in the cart now (${total} item${total > 1 ? 's' : ''} in total).`,
          cards: [chatProduceCard(p)],
          suggestions: ["What's in my cart?", `Where can I get ${p.name.toLowerCase()}?`, 'Show me vegetables'],
        };
      },
    },

    {
      id: 'cart_view',
      score: (q) => {
        if (!q.tokens.has('cart')) return 0;
        // let the specific cart intents own their verbs
        if (has(q, 'clear', 'wipe', 'erase', 'reset', 'add', 'put', 'place', 'remove', 'take', 'drop', 'checkout')) return 0;
        return 38;
      },
      handle: (q) => {
        const c = cart();
        if (q.e.produce) {
          const line = cartLine(q.e.produce.id);
          return line
            ? {
                text: `${q.e.produce.emoji} You have ${line.qty} × ${q.e.produce.name} in your cart.`,
                suggestions: [`Remove ${q.e.produce.name.toLowerCase()} from my cart`, `Add 2 more ${q.e.produce.name.toLowerCase()}`],
              }
            : {
                text: `${q.e.produce.emoji} ${q.e.produce.name} isn't in your cart yet.`,
                suggestions: [`Add ${q.e.produce.name.toLowerCase()} to my cart`, "What's in my cart?"],
              };
        }
        if (!c.length) {
          return {
            text: `🧺 Your cart is empty right now. Want me to add something fresh?`,
            suggestions: ['Add tomatoes to my cart', 'Add honey to my cart', 'Show me vegetables'],
          };
        }
        return {
          text: `🧺 You have ${cartCount()} item${cartCount() > 1 ? 's' : ''} in your cart:\n\n${cartSummary()}`,
          cards: c
            .map((l) => {
              const p = produceData.find((x) => x.id === l.id);
              return p ? chatProduceCard(p) : null;
            })
            .filter(Boolean),
          suggestions: ['Clear my cart', 'Add tomatoes to my cart', 'Where can I get tomatoes?'],
        };
      },
    },

    /* ================================================= NAVIGATION (actions) */
    {
      id: 'navigate',
      score: (q) => {
        if (q.tokens.has('cart')) return 0;
        const strongV = has(q, 'take', 'go', 'navigate', 'visit', 'head', 'bring', 'jump', 'switch', 'move');
        const softV = has(q, 'open', 'show');
        const target = navTarget(q);
        if (!target) return 0;
        if (strongV) {
          return has(q, 'to', 'me', 'us', 'back') || q.e.market || q.e.produce || q.e.category ? 36 : 30;
        }
        if (softV && target.kind === 'page' && has(q, 'page', 'section', 'guide', 'directory', 'tab', 'screen')) {
          return 32; // "open the produce guide", "show me the directory page"
        }
        return 0;
      },
      handle: (q) => {
        const t = navTarget(q);
        if (t.kind === 'market') {
          const m = t.market;
          agent.openMarket(m);
          const st = liveMarketStatus(m);
          return {
            text: `🏪 Taking you to ${m.name} — ${m.location}, ${m.area}.\n\n${st.open ? '🟢' : '⏸️'} ${st.label}`,
            cards: [chatMarketCard(m)],
            suggestions: [`What's sold at ${m.name}?`, 'Markets open today', 'Take me back home'],
          };
        }
        if (t.kind === 'produce') {
          const p = t.produce;
          agent.openProduce(p);
          return {
            text: `${p.emoji} Here you go — I've opened the ${p.name} page for you.`,
            cards: [chatProduceCard(p)],
            suggestions: [`Where can I get ${p.name.toLowerCase()}?`, `Add ${p.name.toLowerCase()} to my cart`],
          };
        }
        if (t.kind === 'category') {
          agent.openProduceGuide({ category: t.category });
          const n = produceData.filter((p) => p.category === t.category).length;
          return {
            text: `🧺 Done — the Produce Guide is now filtered to ${t.category} (${n} item${n === 1 ? '' : 's'}).`,
            suggestions: ['Show me all produce', 'What produce is in season?', 'Markets open on Saturday'],
          };
        }
        const labels = {
          home: 'the Home page',
          directory: 'the Market Directory',
          produce: 'the Produce Guide',
          bookmarks: 'your Saved Items',
          about: 'the About Us section on the homepage',
          contact: 'the Contact Us section on the homepage',
        };
        if (t.page === 'directory') agent.openDirectory('');
        else if (t.page === 'produce') agent.openProduceGuide({});
        else agent.openPage(t.page);
        const count = agent.bookmarkCount();
        const extra = t.page === 'bookmarks'
          ? ` You have ${count} saved item${count === 1 ? '' : 's'}.`
          : '';
        return {
          text: `📍 Taking you to ${labels[t.page]}.${extra}`,
          suggestions: ['Which markets are open now?', 'What produce is in season?', 'Show me all markets'],
        };
      },
    },

    /* ================================================ FIND / SHOW (actions) */
    {
      id: 'find_produce',
      score: (q) => {
        if (!q.e.produce || q.tokens.has('cart') || q.tokens.has('where')) return 0;
        return has(q, 'find', 'search', 'look', 'locate', 'show', 'need', 'want', 'spot') ? 32 : 0;
      },
      handle: (q) => {
        const p = q.e.produce;
        agent.openProduce(p);
        const list = marketsForProduce(p);
        return {
          text: nl([
            `${p.emoji} Found it! I've opened ${p.name} (${p.category}) on the site.`,
            p.season.length ? `📅 In season: ${p.season.join(', ')}.` : null,
            list.length ? `🛒 You can get it at: ${list.map((m) => m.name).join(', ')}.` : null,
          ]),
          cards: [chatProduceCard(p)],
          suggestions: [`Where can I get ${p.name.toLowerCase()}?`, `Add ${p.name.toLowerCase()} to my cart`, `Tell me more about ${p.name.toLowerCase()}`],
        };
      },
    },

    {
      id: 'browse',
      score: (q) => {
        if (q.e.day) return 0; // "saturday markets" → open_on_day
        // specialised market questions keep their own intents
        if (has(q, 'organic', 'parking', 'accessible', 'wheelchair', 'pet',
                'best', 'rating', 'hours', 'timing', 'schedule', 'season', 'seasonal')) return 0;
        // an explicit "search …" command always runs the directory search
        if (has(q, 'search')) return 26;
        if (q.e.produce || q.e.market || q.tokens.has('cart') || q.e.category) return 0;
        if (has(q, 'near') || q.e.area) return 0; // "markets near me" → find_market
        const showV = has(q, 'show', 'browse', 'list', 'view', 'see', 'display', 'open', 'find');
        if (!showV && !has(q, 'all', 'every')) return 0;
        if (has(q, 'markets', 'market', 'directory')) return 28;
        if (has(q, 'produce')) return 28;
        return 0;
      },
      handle: (q) => {
        if (has(q, 'search')) {
          const terms = leftoverNoun(q);
          const query = (q.e.area || terms || '').trim();
          if (query) {
            agent.openDirectory(query);
            const matches = marketsData.filter((m) => marketMatchesQuery(m, query));
            return {
              text: matches.length
                ? `🔎 I've searched the Market Directory for "${query}" — ${matches.length} market${matches.length === 1 ? '' : 's'} match.`
                : `🔎 I searched the Market Directory for "${query}" but nothing matched. Here's the full list instead.`,
              cards: (matches.length ? matches : marketsData).slice(0, 4).map(chatMarketCard),
              suggestions: ['Show me all markets', 'Which markets are open now?'],
            };
          }
        }
        const wantsProduce = has(q, 'produce') && !has(q, 'markets', 'market', 'directory');
        if (wantsProduce) {
          agent.openProduceGuide({});
          return {
            text: `🧺 Opening the Produce Guide with all ${produceData.length} items.`,
            suggestions: ['Show me vegetables', 'Show me fruits', 'What produce is in season?'],
          };
        }
        agent.openDirectory('');
        return {
          text: `📍 Opening the Market Directory with all ${marketsData.length} markets.`,
          cards: marketsData.slice(0, 4).map(chatMarketCard),
          suggestions: ['Which markets are open now?', 'Markets open on Saturday', 'Which markets are organic?'],
        };
      },
    },

    /* ============================================ NEAR-ME (real geolocation) */
    {
      id: 'near_me',
      score: (q) => {
        if (q.tokens.has('cart') || has(q, 'bookmark')) return 0;
        // "use my location", "share my location", … count as near-me requests
        const locW = /(my|your|real|actual|current) location|use (my|the) location|share my location/.test(q.norm);
        const nearW = q.tokens.has('near') || q.tokens.has('here') || locW;
        if (!nearW) return 0;
        const meW = q.tokens.has('me') || q.tokens.has('my') || q.tokens.has('here') || locW;
        if (!meW && q.e.area) return 0; // "near greenfield" → find_market
        return q.e.produce || q.e.category ? 36 : 30;
      },
      handle: (q) => new Promise((resolve) => {
        agent.locate((user, err) => {
          const p = q.e.produce;
          const cat = q.e.category;
          const label = p ? p.name.toLowerCase() : cat ? cat.toLowerCase() : null;
          const list = p ? marketsForProduce(p) : cat ? marketsWithCategory(cat) : marketsData.slice();

          if (!list.length) {
            resolve({
              text: `🤔 None of our markets are listed with ${label} — and I never invent stock. The Produce Guide shows everything we do have.`,
              links: [{ label: 'Produce Guide', page: 'produce' }],
              suggestions: ['What produce is in season?', 'Show me all markets'],
            });
            return;
          }

          if (!label) {
            /* "show markets near me" / "use my real location" → open the map */
            const markerCount = agent.openMapView(null);
            if (user) {
              const { sorted, near } = nearbyMarkets(list, user);
              const shown = near.length ? near : sorted.slice(0, 4);
              resolve({
                text: near.length
                  ? `📍 I've centred the map on your live location — ${near.length} market${near.length > 1 ? 's are' : ' is'} within ${NEAR_RADIUS_KM} km of you:\n\n${near.map((x) => `• ${x.m.name} — ${fmtDist(x.d)} away · ${liveMarketStatus(x.m).label}`).join('\n')}\n\nTap a red marker for the market card.`
                  : `📍 Using your live location — the closest FreshFind market${shown.length > 1 ? 's' : ''} to you right now:\n\n${shown.map((x) => `• ${x.m.name} — ${fmtDist(x.d)} away · ${liveMarketStatus(x.m).label}`).join('\n')}\n\nI've centred the map on you with these markets in view — tap a red marker for the market card.`,
                cards: shown.map((x) => chatMarketCard(x.m)),
                suggestions: ['Which markets near me have vegetables?', 'Which markets are open now?', 'Show me all markets'],
              });
            } else {
              const names = list.slice(0, 4).map((m) => m.name).join(', ');
              const more = list.length > 4 ? ` and ${list.length - 4} more` : '';
              resolve({
                text: `📍 I asked your browser for your live location but it was ${err || 'unavailable'}, so I can't centre on you yet — the map is showing our market area meanwhile: ${names}${more}, all on it as red markers.\n\nTip: embedded previews often block the location prompt. Open the site's direct link in a normal browser tab and choose "Allow" — I'll use your live location the moment it's approved.`,
                cards: list.slice(0, 4).map(chatMarketCard),
                suggestions: ['Use my real location', 'Which markets are open now?', 'Show me vegetables'],
              });
            }
            return;
          }

          /* produce / category + "near me" → answer with real market names */
          if (user) {
            const { sorted, near } = nearbyMarkets(list, user);
            const shown = near.length ? near : sorted.slice(0, 4);
            resolve({
              text: near.length
                ? `📍 Using your live location, I found ${near.length} market${near.length > 1 ? 's' : ''} near you with ${label}:\n\n${near.map((x) => `• ${x.m.name} — ${fmtDist(x.d)} away · ${liveMarketStatus(x.m).label}`).join('\n')}`
                : `📍 From your live location, the closest markets with ${label} are:\n\n${shown.map((x) => `• ${x.m.name} — ${fmtDist(x.d)} away · ${liveMarketStatus(x.m).label}`).join('\n')}`,
              cards: shown.map((x) => chatMarketCard(x.m)),
              links: [{ label: 'Open Market Directory', page: 'directory' }],
              suggestions: ['Show me on the map', p ? `Add ${p.name.toLowerCase()} to my cart` : 'Show me vegetables', 'Show markets near me'],
            });
          } else {
            resolve({
              text: `📍 I asked your browser for your live location but it was ${err || 'unavailable'}, so I can't rank by distance yet — these are the actual markets with ${label}:\n\n${list.map((m) => `• ${m.name} — ${m.area}`).join('\n')}\n\nTip: embedded previews often block the location prompt — open the site's direct link in a normal tab and choose "Allow", then ask me again and I'll answer from your live location.`,
              cards: list.slice(0, 4).map(chatMarketCard),
              links: [{ label: 'Open Market Directory', page: 'directory' }],
              suggestions: ['Use my real location', 'Show me on the map', p ? `Add ${p.name.toLowerCase()} to my cart` : 'Show me vegetables'],
            });
          }
        });
      }),
    },

    /* =================================================== OPEN THE MAP ===== */
    {
      id: 'map_view',
      score: (q) => {
        if (q.tokens.has('cart')) return 0;
        // note: the word "map" is synonym-mapped to the "address" aspect, so
        // look at the raw text here instead of the token set
        if (!/\bmaps?\b/.test(q.norm)) return 0;
        if (has(q, 'show', 'open', 'view', 'see', 'display', 'take', 'go', 'switch')) return 30;
        return 0;
      },
      handle: (q) => {
        const n = agent.openMapView(q.e.market ? q.e.market.id : null);
        const user = agent.userLocation();
        return {
          text: `🗺️ I've opened the interactive map with ${n} red market marker${n === 1 ? '' : 's'}${user ? ', centred on your location' : ''}. Tap any marker to see the market card — status, address, hours, produce and more.`,
          suggestions: ['Show markets near me', 'Which markets are open now?', 'Markets open on Saturday'],
        };
      },
    },

    /* ------------------------------------------------------------- open now */
    {
      id: 'open_now',
      score: (q) => {
        let s = 0;
        if (has(q, 'open')) s += 6;
        if (q.norm.includes('right now') || has(q, 'now') || has(q, 'currently')) s += 20;
        if (q.norm.includes('at the moment')) s += 20;
        return s;
      },
      handle: () => {
        const open = marketsData.filter((m) => liveMarketStatus(m).open);
        const soon = marketsData
          .filter((m) => getMarketStatus(m).status === 'opens-today')
          .sort((a, b) => a.openingTime.localeCompare(b.openingTime));

        if (open.length) {
          return {
            text: `🟢 ${open.length} market${open.length > 1 ? 's are' : ' is'} open right now:\n\n${open
              .map((m) => `• ${m.name} — until ${formatTime(m.closingTime)} (${m.area})`)
              .join('\n')}\n\nTap a card below for full details.`,
            cards: open.map(chatMarketCard),
            links: [{ label: 'Open Market Directory', page: 'directory' }],
            suggestions: ['What time does it close?', 'Markets open tomorrow', 'What produce is in season?'],
          };
        }
        if (soon.length) {
          return {
            text: `😴 No market is open at the moment, but these open later today:\n\n${soon
              .map((m) => `• ${m.name} — ${formatTime(m.openingTime)} (${m.area})`)
              .join('\n')}`,
            cards: soon.slice(0, 3).map(chatMarketCard),
            suggestions: ['Markets open on Saturday', 'Show me all markets', 'What produce is in season?'],
          };
        }
        const next = [...marketsData].sort((a, b) =>
          liveMarketStatus(a).label.localeCompare(liveMarketStatus(b).label));
        return {
          text: `😴 All markets are closed right now.\n\nNext up:\n${next
            .slice(0, 4)
            .map((m) => `• ${m.name} — ${liveMarketStatus(m).label}`)
            .join('\n')}`,
          cards: next.slice(0, 3).map(chatMarketCard),
          suggestions: ['Markets open on Saturday', 'Show me all market hours', 'Which markets are organic?'],
        };
      },
    },

    /* --------------------------------------------------------- open on day */
    {
      id: 'open_on_day',
      score: (q) => {
        if (!q.e.day) return 0;
        let s = 24;
        if (has(q, 'open', 'market', 'markets', 'hours')) s += 6;
        if (q.e.market) s -= 16; // "is riverside open today" → market_info
        return s;
      },
      handle: (q) => {
        const day = q.e.day;
        const label = q.e.dayLabel ?? day;
        const list = marketsData
          .filter((m) =>
            day === 'weekend'
              ? m.days.includes('Saturday') || m.days.includes('Sunday')
              : day === 'weekday'
                ? m.days.some((d) => !['Saturday', 'Sunday'].includes(d))
                : m.days.includes(day))
          .sort((a, b) => a.openingTime.localeCompare(b.openingTime));

        if (!list.length) {
          return {
            text: `📅 No market runs on ${label}. Our markets operate between Monday and Sunday across 8 locations — try another day!`,
            suggestions: ['Markets open on Saturday', 'Markets open on Sunday', 'Show me all market hours'],
          };
        }
        return {
          text: `📅 ${list.length} market${list.length > 1 ? 's' : ''} open ${label}:\n\n${list
            .map((m) => `• ${m.name} — ${formatTime(m.openingTime)} – ${formatTime(m.closingTime)} · ${m.area}`)
            .join('\n')}`,
          cards: list.map(chatMarketCard),
          links: [{ label: 'Browse Full Directory', page: 'directory' }],
          suggestions: ['Which are organic?', 'Markets with parking', 'What produce is in season?'],
        };
      },
    },

    /* ----------------------------------------------------- specific market */
    {
      id: 'market_info',
      score: (q) => (q.e.market ? 26 : 0),
      handle: (q) => {
        const m = q.e.market;
        const st = liveMarketStatus(m);
        const dayAsked = q.e.day && q.e.day !== 'weekend' && q.e.day !== 'weekday' ? q.e.day : null;
        // "is it open on Sunday?" → the day IS the question, so answer with hours
        const a = q.e.aspects.size === 0 && dayAsked ? new Set(['hours']) : q.e.aspects;
        const show = (aspect) => a.size === 0 || a.has(aspect);
        const showStatus = !dayAsked || dayAsked === todayName();

        const text = nl([
          `🏪 ${m.name}`,
          show('hours') &&
            (dayAsked
              ? m.days.includes(dayAsked)
                ? `🕐 ${dayAsked}: ${formatTime(m.openingTime)} – ${formatTime(m.closingTime)}`
                : `🕐 Closed on ${dayAsked}. Open ${formatDays(m.days)} · ${formatTime(m.openingTime)} – ${formatTime(m.closingTime)}`
              : `🕐 ${formatDays(m.days)} · ${formatTime(m.openingTime)} – ${formatTime(m.closingTime)}`),
          show('hours') && showStatus && `${st.open ? '🟢' : '⏸️'} ${st.label}`,
          a.size === 0 && m.shortDescription,
          show('address') && `📍 ${m.location}, ${m.area}\n🗺️ ${m.address}`,
          show('rating') && `⭐ ${m.rating}/5 rating · ${m.vendors} vendors${show('established') ? ` · since ${m.established}` : ''}`,
          show('vendors') && a.size > 0 && `🧺 ${m.vendors} vendors on site`,
          show('established') && a.size > 0 && `📜 Trading since ${m.established}`,
          show('produce') && `🛒 Known for: ${m.produce.map((id) => produceData.find((p) => p.id === id)?.name.toLowerCase() ?? id).join(', ')}`,
          (show('parking') || show('pet') || show('accessible')) &&
            nl([
              show('parking') && `🅿️ Parking: ${m.parkingAvailable ? 'available' : 'not available'}`,
              show('pet') && `🐕 Dogs: ${m.petFriendly ? 'welcome' : 'not allowed'}`,
              show('accessible') && `♿ Wheelchair: ${m.wheelchairAccessible ? 'accessible' : 'limited access'}`,
            ]),
          a.size === 0 &&
            nl([
              `🅿️ ${m.parkingAvailable ? 'Parking available' : 'No parking'} · 🐕 ${m.petFriendly ? 'Dog friendly' : 'No dogs'} · ♿ ${m.wheelchairAccessible ? 'Wheelchair accessible' : 'Limited access'}`,
              `🏷️ ${m.tags.join(' · ')}`,
            ]),
          show('contact') && `📞 ${m.phone}\n✉️ ${m.contact}${m.website ? `\n🌐 ${m.website}` : ''}`,
          show('price') && `💷 Prices are set by each grower, so they vary stall to stall — most vendors take cash and card.`,
          a.size > 0 && !show('hours') && `${st.open ? '🟢' : '⏸️'} ${st.label}`,
        ]);

        return {
          text,
          cards: [chatMarketCard(m)],
          suggestions: [
            `Take me to ${m.name}`,
            `What's sold at ${m.name}?`,
            'Is it open on Saturday?',
          ],
        };
      },
    },

    /* -------------------------------------------------- where to buy X */
    {
      id: 'where_to_buy',
      score: (q) => {
        if (!q.e.produce) return 0;
        let s = 16;
        if (has(q, 'buy', 'get', 'find', 'market', 'markets', 'where', 'which', 'sell', 'available', 'stock', 'near')) s += 14;
        return s;
      },
      handle: (q) => {
        const p = q.e.produce;
        const list = marketsForProduce(p);
        if (!list.length) {
          agent.openProduce(p);
          return {
            text: `🛒 ${p.name} isn't listed at any of our markets right now — I've opened its page anyway. Try ${produceData[0].name.toLowerCase()} or browse the produce guide.`,
            suggestions: ['What produce is in season?', 'Show me all markets'],
          };
        }
        agent.openProduce(p); // show the real "Available At" list on the site
        return {
          text: `🛒 You'll find ${p.name.toLowerCase()} at ${list.length} market${list.length > 1 ? 's' : ''}:\n\n${list
            .map((m) => `• ${m.name} — ${formatDays(m.days)} ${formatTime(m.openingTime)}–${formatTime(m.closingTime)} · ${m.area}`)
            .join('\n')}\n\nI've opened the ${p.name} page on the site so you can jump straight to any of them.${p.storageHint ? `\n\n🧊 Tip: ${p.storageHint}` : ''}`,
          cards: list.map(chatMarketCard),
          suggestions: [`Add ${p.name.toLowerCase()} to my cart`, `Tell me about ${p.name.toLowerCase()}`, 'Markets open on Saturday'],
        };
      },
    },

    /* ------------------------------------------------------ produce info */
    {
      id: 'produce_info',
      score: (q) => (q.e.produce ? 24 : 0),
      handle: (q) => {
        const p = q.e.produce;
        const list = marketsForProduce(p);
        const inSeason = p.season.includes(getCurrentSeason());
        return {
          text: nl([
            `${p.emoji} ${p.name} — ${p.category}`,
            p.description,
            `📅 Season: ${p.season.join(', ')}${inSeason ? ' ✅ in season right now' : ''}`,
            `💪 Nutrition: ${p.nutritionHighlights}`,
            `🧊 Storage: ${p.storageHint}`,
            list.length ? `🛒 Available at: ${list.map((m) => m.name).join(', ')}` : null,
          ]),
          cards: [chatProduceCard(p), ...list.slice(0, 3).map(chatMarketCard)],
          suggestions: [`Where can I buy ${p.name.toLowerCase()}?`, `Add ${p.name.toLowerCase()} to my cart`, 'What else is in season?'],
        };
      },
    },

    /* ---------------------------------------------------------- seasonal */
    {
      id: 'seasonal',
      score: (q) => {
        let s = 0;
        if (q.e.season) s += 18;
        if (has(q, 'season', 'seasonal', 'ripe', 'fresh', 'now')) s += 14;
        if (has(q, 'produce', 'vegetables', 'fruits', 'grow', 'available')) s += 6;
        if (q.e.produce) s = 0;
        return s;
      },
      handle: (q) => {
        const season = q.e.season ?? getCurrentSeason();
        const now = new Date();
        const isNow = season === getCurrentSeason();
        const list = produceData.filter((p) => p.season.includes(season));
        return {
          text: `${isNow ? '🌿' : '📆'} ${
            isNow
              ? `In season right now (${season}, ${now.toLocaleString(undefined, { month: 'long' })})`
              : `${season} produce on FreshFind`
          }:\n\n${list.map((p) => `${p.emoji} ${p.name} — ${p.category}`).join('\n')}\n\n💡 Seasonal produce is cheaper, tastier and picked far fresher.`,
          cards: list.map(chatProduceCard),
          links: [{ label: 'Open Produce Guide', page: 'produce' }],
          suggestions: ['Where can I buy tomatoes?', 'Which markets are organic?', 'Markets open on Saturday'],
        };
      },
    },

    /* ----------------------------------------------------------- organic */
    {
      id: 'organic',
      score: (q) => {
        let s = 0;
        if (has(q, 'organic')) s += 20;
        if (has(q, 'pesticide', 'chemical')) s += 12;
        return s;
      },
      handle: () => {
        const list = marketsData.filter((m) => m.tags.includes('Organic'));
        return {
          text: `🌱 ${list.length} of our markets are tagged Organic:\n\n${list
            .map((m) => `✅ ${m.name} — ${formatDays(m.days)} · ${m.area}`)
            .join('\n')}\n\nLook for the green Organic badge on market cards!`,
          cards: list.map(chatMarketCard),
          links: [{ label: 'Filter Organic Markets', page: 'directory' }],
          suggestions: ['Which market has the best rating?', 'Markets open on Sunday', 'What produce is in season?'],
        };
      },
    },

    /* ---------------------------------------------------------- category */
    {
      id: 'category',
      score: (q) => (q.e.category && !q.e.produce && !q.tokens.has('cart') ? 20 : 0),
      handle: (q) => {
        const cat = q.e.category;
        // EXECUTE the site's real category filter, then report what it shows
        agent.openProduceGuide({ category: cat });
        const items = produceData.filter((p) => p.category === cat);
        const markets = marketsData.filter((m) => m.produceTypes.includes(cat));
        return {
          text: `🧺 The Produce Guide is now filtered to ${cat} — ${items.length} item${items.length === 1 ? '' : 's'}:\n\n${items
            .map((p) => `${p.emoji} ${p.name} — ${p.season.join('/')}`)
            .join('\n')}\n\n🏪 Best markets for ${cat.toLowerCase()}: ${markets.map((m) => m.name).join(', ')}`,
          cards: [...items.map(chatProduceCard), ...markets.slice(0, 2).map(chatMarketCard)],
          suggestions: ['Show me all produce', 'What produce is in season?', 'Markets open on Saturday'],
        };
      },
    },

    /* -------------------------------------------------------------- best */
    {
      id: 'best',
      score: (q) => {
        let s = 0;
        if (has(q, 'best', 'good', 'great')) s += 14;
        if (has(q, 'rating', 'popular', 'busiest', 'biggest')) s += 10;
        return s;
      },
      handle: () => {
        const top = [...marketsData].sort((a, b) => b.rating - a.rating).slice(0, 4);
        return {
          text: `⭐ Our highest rated markets:\n\n${top
            .map((m, i) => `${i + 1}. ${m.name} — ${m.rating}/5 · ${m.vendors} vendors · ${m.area}`)
            .join('\n')}\n\n🏆 ${top[0].name} tops the list with ${top[0].vendors} vendors.`,
          cards: top.map(chatMarketCard),
          links: [{ label: 'See All Markets', page: 'directory' }],
          suggestions: ['Is it open now?', 'Which markets are organic?', 'Markets with parking'],
        };
      },
    },

    /* ---------------------------------------------------------- features */
    {
      id: 'features',
      score: (q) => {
        let s = 0;
        if (has(q, 'parking')) s += 16;
        if (has(q, 'pet', 'dogs', 'dog')) s += 16;
        if (has(q, 'accessible', 'wheelchair', 'disability', 'disabled')) s += 16;
        if (q.e.market) s = 0;
        return s;
      },
      handle: (q) => {
        if (has(q, 'parking')) {
          const list = marketsData.filter((m) => m.parkingAvailable);
          return {
            text: `🅿️ ${list.length} markets have parking:\n\n${list.map((m) => `• ${m.name} — ${m.area}`).join('\n')}`,
            cards: list.map(chatMarketCard),
            suggestions: ['Dog friendly markets', 'Wheelchair accessible markets', 'Markets open on Saturday'],
          };
        }
        if (has(q, 'pet', 'dogs', 'dog')) {
          const list = marketsData.filter((m) => m.petFriendly);
          return {
            text: `🐕 ${list.length} markets welcome dogs:\n\n${list.map((m) => `• ${m.name} — ${m.area}`).join('\n')}\n\nPlease keep pets on a short lead.`,
            cards: list.map(chatMarketCard),
            suggestions: ['Markets with parking', 'Wheelchair accessible markets', 'Markets open on Sunday'],
          };
        }
        const list = marketsData.filter((m) => m.wheelchairAccessible);
        return {
          text: `♿ ${list.length} markets are wheelchair accessible:\n\n${list.map((m) => `• ${m.name} — ${m.area}`).join('\n')}`,
          cards: list.map(chatMarketCard),
          suggestions: ['Markets with parking', 'Dog friendly markets', 'Which markets are organic?'],
        };
      },
    },

    /* -------------------------------------------------------- all hours */
    {
      id: 'all_hours',
      score: (q) => {
        let s = 0;
        if (q.e.aspects.has('hours')) s += 14;
        if (has(q, 'market', 'markets')) s += 4;
        if (q.e.market) s = 0;
        return s;
      },
      handle: () => ({
        text: `🕐 Full market schedule:\n\n${marketsData
          .map((m) => `• ${m.name} — ${formatDays(m.days)} ${formatTime(m.openingTime)}–${formatTime(m.closingTime)}`)
          .join('\n')}`,
        cards: marketsData.map(chatMarketCard),
        links: [{ label: 'Open Directory', page: 'directory' }],
        suggestions: ['Which markets are open now?', 'Markets open on Saturday', 'Which markets are organic?'],
      }),
    },

    /* ------------------------------------------------------- find / near */
    {
      id: 'find_market',
      score: (q) => {
        let s = 0;
        if (has(q, 'near', 'nearby', 'closest')) s += 18;
        if (q.e.area) s += 16;
        if (has(q, 'find', 'search', 'browse', 'list', 'all', 'show')) s += 6;
        return s;
      },
      handle: (q) => {
        const area = q.e.area;
        const list = area
          ? marketsData.filter((m) => m.area.toLowerCase() === area)
          : [...marketsData].sort((a, b) => b.rating - a.rating).slice(0, 4);

        if (area && !list.length) {
          return {
            text: `📍 No market in ${area}. Our markets are in ${[...new Set(marketsData.map((m) => m.area))].join(', ')}.`,
            suggestions: ['Show me all markets', 'Markets open on Saturday'],
          };
        }
        return {
          text: area
            ? `📍 ${list.length} market${list.length > 1 ? 's' : ''} in ${list[0].area}:\n\n${list
                .map((m) => `• ${m.name} — ${formatDays(m.days)} ${formatTime(m.openingTime)}–${formatTime(m.closingTime)}`)
                .join('\n')}`
            : `📍 Finding a market near you is easy:\n\n1️⃣ Hit "Find Near Me" on the directory to sort by distance\n2️⃣ Or search by area — ${[...new Set(marketsData.map((m) => m.area))].join(', ')}\n3️⃣ Open a market card for the map, parking and contact details\n\nHere are our top-rated markets to start with:`,
          cards: list.map(chatMarketCard),
          links: [{ label: 'Open Market Directory', page: 'directory' }],
          suggestions: ['Which are open now?', 'Markets with parking', 'Which markets are organic?'],
        };
      },
    },

    /* ------------------------------------------------- bookmarks (actions) */
    {
      id: 'bookmarks',
      score: (q) => {
        if (q.tokens.has('cart')) return 0;
        if (!has(q, 'bookmark', 'wishlist', 'heart')) return 0;
        return q.e.produce || q.e.market ? 34 : 22;
      },
      handle: (q) => {
        const item = q.e.market
          ? { id: `market-${q.e.market.id}`, type: 'market', name: q.e.market.name, location: q.e.market.location }
          : q.e.produce
            ? { id: `produce-${q.e.produce.id}`, type: 'produce', name: q.e.produce.name, category: q.e.produce.category }
            : null;

        if (!item) {
          agent.openPage('bookmarks'); // actually open Saved Items
          return {
            text: `❤️ I've opened your Saved Items.\n\nReminder — you can save anything by tapping the heart on a market or produce card, add notes, and export the list. Saved items stay in this browser.`,
            suggestions: ['Save honey for later', 'Show me all markets', 'What produce is in season?'],
          };
        }

        const wantsRemove = has(q, 'remove', 'unsave') || q.tokens.has('unsave');
        if (wantsRemove) {
          const res = agent.unsaveItem(item);
          const count = agent.bookmarkCount();
          return res === 'removed'
            ? {
                text: `💔 Done — ${item.name} was removed from your saved items. ${count ? `You have ${count} left.` : 'Nothing is saved now.'}`,
                suggestions: ['Show my saved items', `Save ${item.name.toLowerCase()} again`],
              }
            : {
                text: `${item.name} wasn't in your saved items, so there was nothing to remove.`,
                suggestions: [`Save ${item.name.toLowerCase()}`, 'Show my saved items'],
              };
        }
        const res = agent.saveItem(item);
        const count = agent.bookmarkCount();
        return res === 'saved'
          ? {
              text: `❤️ Saved ${item.name}! You now have ${count} saved item${count === 1 ? '' : 's'}.`,
              suggestions: ['Show my saved items', 'What produce is in season?'],
            }
          : {
              text: `${item.name} is already in your saved items.`,
              suggestions: ['Show my saved items', `Remove ${item.name.toLowerCase()} from my saved items`],
            };
      },
    },

    /* -------------------------------------------------------------- tips */
    {
      id: 'tips',
      score: (q) => {
        let s = 0;
        if (has(q, 'tip', 'tips', 'advice', 'bring', 'bag', 'cash', 'card', 'early')) s += 18;
        if (q.norm.includes('first time')) s += 12;
        if (q.norm.includes('what should i')) s += 4;
        return s;
      },
      handle: () => ({
        text: `🧺 Farmers' market tips:\n\n🕐 Arrive early for the best pick — or late for end-of-day bargains\n💵 Bring cash; some small growers don't take cards\n👜 Carry your own bags or a basket\n🗣️ Talk to the growers — they'll tell you what's best that morning\n🍓 Buy seasonal for the best flavour and price\n♻️ Ask about refill and deposit schemes\n\nWant to know what's seasonal right now? Just ask!`,
        suggestions: ['What produce is in season?', 'Which markets are open now?', 'Markets with parking'],
      }),
    },

    /* ------------------------------------------------------------- about */
    {
      id: 'about',
      score: (q) => {
        let s = 0;
        if (has(q, 'freshfind')) s += 16;
        if (q.norm.includes('about us') || q.norm.includes('who are you') || q.norm.includes('what is this')) s += 14;
        return s;
      },
      handle: () => ({
        text: `🌱 FreshFind is a free discovery platform for local farmers' markets.\n\nWhat we do:\n✅ List 8 markets with live open/closed status\n✅ Show what's in season month by month\n✅ Help you find organic, dog friendly and accessible markets\n✅ Let you save favourites for your next trip\n\nEverything on this site is community sourced — happy browsing!`,
        links: [{ label: 'About FreshFind', page: 'about' }],
        suggestions: ['Show me all markets', 'What produce is in season?', 'Contact FreshFind'],
      }),
    },

    /* ----------------------------------------------------------- contact */
    {
      id: 'contact',
      score: (q) => {
        let s = 0;
        if (has(q, 'email', 'phone', 'call', 'contact', 'support', 'complaint')) s += 18;
        if (q.norm.includes('get in touch') || q.norm.includes('reach out')) s += 10;
        return s;
      },
      handle: () => ({
        text: `📬 Get in touch with FreshFind:\n\n📧 hello@freshfind.com\n📞 +92346267809\n📍 10 Market Square, Greenfield\n🕐 Mon–Fri, 9:00 AM – 5:00 PM\n\nPrefer self-service? Each market card lists its own phone and email too.`,
        links: [{ label: 'Contact Section', page: 'contact' }],
        suggestions: ['Show me all markets', 'What are the market hours?', 'About FreshFind'],
      }),
    },

    /* --------------------------------------------------------- abilities */
    {
      id: 'abilities',
      score: (q) => {
        let s = 0;
        if (q.norm.includes('what can you do') || q.norm.includes('can you do')) s += 26;
        if (q.norm.includes('help me')) s += 14;
        if (has(q, 'options', 'commands', 'menu') && has(q, 'what', 'which', 'any', 'show')) s += 12;
        return s;
      },
      handle: () => ({
        text: `🤖 I'm the FreshFind Assistant — I don't just answer questions, I can act on the site. Try:\n\n📍 "Which markets are open right now?"\n🕐 "What time does Riverside open?"\n🍓 "Find tomatoes" / "Where can I get honey?"\n🧺 "Show me vegetables" (I'll filter the Produce Guide)\n📍 "Take me to the Produce Guide" / "Take me to Lakeside"\n🗺️ "Show me on the map" / "Show markets near me" (uses your real location)\n🥩 "Which markets near me have meat?"\n🛒 "Add 2 tomatoes to my cart"\n🧺 "What's in my cart?" / "Remove honey" / "Clear my cart"\n❤️ "Save apples for later"\n\nYou can type naturally — I'll do my best to follow along.`,
        suggestions: ['Which markets are open now?', 'Add tomatoes to my cart', 'Show me vegetables'],
      }),
    },

    /* -------------------------------------------------------- small talk */
    {
      id: 'smalltalk',
      score: (q) => {
        let s = 0;
        if (q.norm.includes('how are you')) s += 22;
        if (q.norm.includes('your name') || q.norm.includes('who made you') || q.norm.includes('are you a bot') || q.norm.includes('are you human')) s += 22;
        if (has(q, 'joke', 'sing', 'weather')) s += 18;
        return s;
      },
      handle: (q) => {
        if (q.norm.includes('how are you')) {
          return {
            text: `🌿 Doing great — it's market day somewhere! I'm ready whenever you want to track down fresh produce. What are you looking for?`,
            suggestions: ['What produce is in season?', 'Which markets are open now?', 'Best rated markets'],
          };
        }
        if (has(q, 'joke')) {
          return {
            text: `🥕 Why did the tomato blush?\n\nBecause it saw the salad dressing! 😄\n\nNow — shall we find you a real one?`,
            suggestions: ['Where can I buy tomatoes?', 'What produce is in season?'],
          };
        }
        if (has(q, 'weather')) {
          return {
            text: `🌤️ I don't have live weather, but markets are mostly outdoor — worth checking the forecast before you go. Want today's market list?`,
            suggestions: ['Which markets are open now?', 'Markets open tomorrow'],
          };
        }
        return {
          text: `🤖 I'm the FreshFind Assistant — a cheerful bot that knows all ${marketsData.length} markets and ${produceData.length} produce items on this site. No humans were harmed in the making of my produce puns. 😄`,
          suggestions: ['What can you do?', 'Show me all markets', 'What produce is in season?'],
        };
      },
    },

    /* ------------------------------------------------------------ thanks */
    {
      id: 'thanks',
      score: (q) => (has(q, 'thanks') ? 26 : 0),
      handle: () => ({
        text: `😊 You're very welcome! Enjoy the market — and don't forget to bring a bag. 🧺`,
        suggestions: ['Which markets are open now?', 'What produce is in season?', 'Markets with parking'],
      }),
    },

    /* --------------------------------------------------------------- bye */
    {
      id: 'bye',
      score: (q) => (has(q, 'bye') ? 26 : 0),
      handle: () => ({
        text: `👋 See you at the market! Tap the green button any time if you need me again.`,
        suggestions: ['Which markets are open now?', 'What produce is in season?'],
      }),
    },
  ];
}

/* -------------------------------------------------------------- fallback */

const FALLBACK_SUGGESTIONS = [
  'Which markets are open now?',
  'What produce is in season?',
  'Which markets are organic?',
  'Markets open on Saturday',
];

function nearestTopic(q) {
  const candidates = [
    ...marketsData.map((m) => ({ label: m.name, words: MARKET_KEYWORDS[m.id] ?? [] })),
    ...produceData.map((p) => ({ label: p.name, words: PRODUCE_KEYWORDS[p.id] ?? [] })),
    { label: 'market hours', words: ['hours', 'timing', 'schedule', 'open'] },
    { label: 'seasonal produce', words: ['season', 'seasonal', 'ripe'] },
    { label: 'organic markets', words: ['organic', 'pesticide'] },
    { label: 'saved items', words: ['bookmark', 'save', 'favourite'] },
  ];
  let best = null;
  let bestDist = 2; // only a single-character slip counts as "did you mean"
  for (const c of candidates) {
    for (const w of c.words) {
      if (w.length < 5) continue;
      for (const t of q.tokenList) {
        if (Math.abs(t.length - w.length) > 1) continue;
        const d = levenshtein(t, w);
        if (d > 0 && d < bestDist) {
          bestDist = d;
          best = c.label;
        }
      }
    }
  }
  return best;
}

function fallback(q) {
  const guess = nearestTopic(q);
  const noun = leftoverNoun(q);
  const wantsProduct = has(q, 'find', 'add', 'buy', 'show', 'get', 'want', 'need', 'remove', 'search', 'locate', 'look');
  const wantsMarketNav = has(q, 'take', 'visit', 'navigate', 'head', 'bring', 'jump');

  /* "find me bananas" / "add bananas to my cart" — unknown produce */
  if (wantsProduct && noun) {
    return {
      text: nl([
        `🤔 "${noun}" isn't in our produce data, so I can't find, add or remove it — I never invent items!`,
        `We currently stock ${produceData.length} things: ${produceData.map((p) => p.name).join(', ')}.`,
        guess ? `Did you mean ${guess}?` : null,
      ]),
      suggestions: ['Find tomatoes', 'What produce is in season?', 'Show me all markets'],
      links: [{ label: 'Produce Guide', page: 'produce' }],
    };
  }

  /* "take me to walmart" — unknown destination */
  if (wantsMarketNav && noun) {
    return {
      text: `🤔 I couldn't find "${noun}" anywhere on FreshFind, and I won't make up a place. Our ${marketsData.length} markets are:\n\n${marketsData
        .map((m) => `• ${m.name} — ${m.area}`)
        .join('\n')}`,
      suggestions: ['Take me to Riverside', 'Show me all markets', 'Markets open on Saturday'],
      links: [{ label: 'Market Directory', page: 'directory' }],
    };
  }

  const meaningful = q.tokenList.filter((t) => !STOPWORDS.has(t) && t.length > 2);
  return {
    text: nl([
      `🤔 I'm not completely sure about "${meaningful.slice(0, 5).join(' ') || 'that'}" — I'm a market specialist rather than a general assistant!`,
      guess && `Did you mean ${guess}?`,
      `Here's what I can help with:\n• Open markets right now\n• Market days and times\n• Where to buy a specific produce\n• What's in season\n• Organic, dog friendly and accessible markets\n• Your shopping cart and saved items`,
    ]),
    suggestions: guess ? [`Tell me about ${guess}`, ...FALLBACK_SUGGESTIONS.slice(0, 2)] : FALLBACK_SUGGESTIONS,
    links: [
      { label: 'Market Directory', page: 'directory' },
      { label: 'Produce Guide', page: 'produce' },
    ],
  };
}

/* ----------------------------------------------------------- public API */

const GREETING_PREFIXES = ['👋 Hey! ', '👋 Hi there! ', '👋 Hello! '];

/** words that refer back to something we were just talking about */
const PRONOUNS = ['it', 'there', 'this', 'that', 'they', 'them', 'its'];

function pickBest(q, intents) {
  let intent = null;
  let score = 0;
  for (const i of intents) {
    const s = i.score(q);
    if (s > score) {
      score = s;
      intent = i;
    }
  }
  return { intent, score };
}

export function getReply(input, ctx, agent) {
  const MIN_SCORE = 12;
  const intents = buildIntents(agent);

  /* --- pass 1: answer on the user's own words, no assumptions ---------- */
  let q = extract(input, ctx, false);
  let { intent, score } = pickBest(q, intents);

  const asksBack = PRONOUNS.some((p) => q.tokens.has(p));
  const remembers = Boolean(ctx.lastMarketId || ctx.lastProduceId);

  /* "and on Sunday?" → keep talking about the market from last turn */
  const dayFollowUp =
    intent?.id === 'open_on_day' &&
    ctx.lastMarketId !== null &&
    !q.tokens.has('markets') &&
    q.tokenList.length <= 5;

  /* --- pass 2: only fall back to conversation memory when the new
         message is vague ("...and on Sunday?", "what about it?", "parking?").
         A completely unrelated question must NOT resurrect old context. --- */
  const vague = q.tokenList.length <= 3;
  /* if the message already names something concrete (an area, category,
     season or entity), memory must stay out of the way — otherwise
     "search greenfield" gets hijacked by whatever was mentioned earlier. */
  const concrete = Boolean(q.e.market || q.e.produce || q.e.area || q.e.category || q.e.season);
  if (remembers && (dayFollowUp || (!concrete && (asksBack || vague)))) {
    const memQ = extract(input, ctx, true);
    const mem = pickBest(memQ, intents);
    /* an explicit navigation ("go home", "take me to the produce section")
       is self-contained — old context must not hijack the destination
       ("take me there" with no target still benefits from memory). */
    if (mem.intent && (mem.score > score || dayFollowUp) && intent?.id !== 'navigate') {
      q = memQ;
      intent = mem.intent;
      score = mem.score;
    }
  }

  /* --- nothing matched: greet back or apologise ------------------------ */
  if (!intent || score < MIN_SCORE) {
    if (q.greeted) {
      const w = welcomeMessage();
      return {
        reply: w,
        ctx: { ...ctx, lastIntent: 'greeting', turns: ctx.turns + 1 },
      };
    }
    return {
      reply: fallback(q),
      ctx: { ...ctx, lastIntent: 'fallback', turns: ctx.turns + 1 },
    };
  }

  /* "which markets are organic?" switches topic — forget the old market */
  const GLOBAL_INTENTS = new Set([
    'organic', 'seasonal', 'features', 'best', 'all_hours', 'category',
    'bookmarks', 'about', 'contact', 'abilities', 'tips', 'smalltalk',
    'thanks', 'bye', 'open_now', 'find_market', 'browse', 'navigate',
    'find_produce', 'cart_add', 'cart_remove', 'cart_view', 'cart_clear',
    'near_me', 'map_view',
  ]);
  const switchesTopic =
    GLOBAL_INTENTS.has(intent.id) || (intent.id === 'open_on_day' && q.tokens.has('markets'));

  const nextCtx = {
    lastMarketId: q.e.market?.id ?? (switchesTopic ? null : ctx.lastMarketId),
    lastProduceId: q.e.produce?.id ?? ctx.lastProduceId,
    lastIntent: intent.id,
    turns: ctx.turns + 1,
  };

  const build = (reply) => {
    const text = q.greeted
      ? `${GREETING_PREFIXES[Math.floor(Math.random() * GREETING_PREFIXES.length)]}${reply.text}`
      : reply.text;
    return { reply: { ...reply, text }, ctx: nextCtx };
  };

  /* intent handlers may answer with a promise (e.g. while the browser
     geolocation permission is being requested) — callers handle both */
  const maybeReply = intent.handle(q);
  if (maybeReply && typeof maybeReply.then === 'function') {
    return maybeReply.then(build);
  }
  return build(maybeReply);
}

export const quickQuestions = [
  'Which markets are open now?',
  'What produce is in season?',
  'Show markets near me',
  'Add tomatoes to my cart',
  'Markets open on Saturday',
];

export function welcomeMessage() {
  const openNow = marketsData.filter((m) => liveMarketStatus(m).open).length;
  return {
    text: `👋 Hi! I'm the FreshFind Assistant.\n\nI know all ${marketsData.length} markets and ${produceData.length} produce items on this site${
      openNow ? ` — ${openNow} ${openNow > 1 ? 'are' : 'is'} open right now` : ''
    }. Ask me about market times or seasonal produce — or tell me to do things: "find tomatoes", "show me vegetables", "take me to Lakeside", "add 2 tomatoes to my cart".`,
    suggestions: quickQuestions,
  };
}
