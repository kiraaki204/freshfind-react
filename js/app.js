/* FreshFind front-end
   HTML + Bootstrap + a bit of JS. Data lives in the *data.js files. */

var ICONS = {
  leaf: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>',
  heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>',
  menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>',
  x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/></svg>',
  pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>',
  carrot: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2.3 21.7c.4.4 1 .6 1.5.4 2.6-.8 8.2-3.4 12.4-7.6 1.3-1.3 2-3 2-4.8 0-.4 0-.8-.1-1.1"/><path d="M20.6 13.2c.4-.9.6-1.9.4-2.9-.2-1.3-.9-2.5-1.9-3.4-1-.9-2.2-1.5-3.5-1.6"/><path d="M16 2s.4 2.2-1.2 3.8S11 8 11 8"/><path d="M18 8s2.2.4 3.8-1.2S24 2 24 2"/></svg>',
  info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>',
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.4 2.1L8.1 9.9a16 16 0 0 0 6 6l1.5-1.2a2 2 0 0 1 2.1-.4c.8.3 1.7.5 2.6.6a2 2 0 0 1 1.7 2.1z"/></svg>',
  chevron: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg>',
  chevronL: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m15 18-6-6 6-6"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>',
  star: '<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
  users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6 9 17l-5-5"/></svg>',
  store: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m2 7 4.4-4.4A2 2 0 0 1 7.8 2h8.4a2 2 0 0 1 1.4.6L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a3 3 0 0 0-6 0v4"/><path d="M2 7h20"/></svg>',
  chat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>',
  send: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>',
  trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
  'arrow-down': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M19 12l-7 7-7-7"/></svg>',
  nav: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>',
  list: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>',
  map: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.1 17.5 9 20.4 3.7 17.8a1 1 0 0 1-.5-.9V5.3a1 1 0 0 1 1.4-.9L9 6.6l5.3-2.8 5.3 2.6a1 1 0 0 1 .5.9v11.6a1 1 0 0 1-1.4.9Z"/></svg>',
  sliders: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/></svg>',
  mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>',
  globe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
  calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>',
  share: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4"/></svg>',
  download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>',
  edit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>',
  save: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><path d="M17 21v-8H7v8M7 3v5h8"/></svg>',
  flower: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8"/></svg>',
  sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
  snow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12h20M12 2v20M4.9 4.9l14.2 14.2M19.1 4.9 4.9 19.1"/></svg>',
  sprout: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 20h10"/><path d="M10 20c5.5-2.5.8-6.4 3-10"/><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z"/><path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z"/></svg>',
  user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M6 20v-1a6 6 0 0 1 12 0v1"/></svg>',
  msg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
  bulb: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18h6M10 22h4"/><path d="M15.1 14.2A6 6 0 1 0 9 14.2L10 18h4z"/></svg>',
  parking: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 17V7h4a3 3 0 0 1 0 6H9"/></svg>',
  paw: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="4" r="2"/><circle cx="18" cy="8" r="2"/><circle cx="20" cy="16" r="2"/><path d="M9 10a5 5 0 0 1 5 5v3.5a3.5 3.5 0 0 1-6.84 1.05Q6.52 17.48 4.4 16.2a3.5 3.5 0 1 1 3.2-6.1Z"/></svg>',
  access: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="8" r="1.5"/><path d="M8 14h8M10 11l-1 6M14 11l1 6"/></svg>',
  checkc: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>',
  alert: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>',
  tag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12.6 2.3a2 2 0 0 0-1.8-.5L4.4 3.5a2 2 0 0 0-1.5 1.6l-1.7 6.4a2 2 0 0 0 .5 1.8l8.4 8.4a2 2 0 0 0 2.8 0l7.2-7.2a2 2 0 0 0 0-2.8Z"/><circle cx="7.5" cy="7.5" r="1.5"/></svg>',
  fb: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 9h2.5V6H14c-2.2 0-3.8 1.6-3.8 3.8v1.9H8.4V14h1.8v6h2.9v-6h2.2l.4-2.3h-2.6v-1.7c0-.6.4-1 .9-1z"/></svg>',
  ig: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.4" cy="6.6" r="1.2" fill="currentColor" stroke="none"/></svg>',
  xtw: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 3.5h3.9l4.2 5.6 4.6-5.6h2.4l-5.9 7.1 6.3 8.9h-3.9l-4.5-6-4.9 6H3.5l6.2-7.5L4 3.5z"/></svg>',
  yt: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M21.6 7.2c-.2-1.1-.9-1.9-2-2.1C17.7 4.8 12 4.8 12 4.8s-5.7 0-7.6.3c-1.1.2-1.8 1-2 2.1-.3 1.9-.3 4.8-.3 4.8s0 2.9.3 4.8c.2 1.1.9 1.9 2 2.1 1.9.3 7.6.3 7.6.3s5.7 0 7.6-.3c1.1-.2 1.8-1 2-2.1.3-1.9.3-4.8.3-4.8s0-2.9-.3-4.8zM10.2 15.4V8.6l5.8 3.4-5.8 3.4z"/></svg>'
};

function icon(name, size) {
  size = size || 16;
  var svg = ICONS[name] || '';
  return svg.replace('<svg', '<svg width="' + size + '" height="' + size + '" aria-hidden="true"');
}

function fillIcons(root) {
  (root || document).querySelectorAll('[data-icon]').forEach(function (el) {
    if (el.getAttribute('data-filled')) return;
    var name = el.getAttribute('data-icon');
    var size = el.getAttribute('data-size') || 18;
    el.innerHTML = icon(name, size);
    el.setAttribute('data-filled', '1');
  });
}

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
    return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c];
  });
}

function imgPath(p) {
  if (!p) return 'images/hero-market.jpg';
  return String(p).replace(/^\//, '');
}

/* ---- clock / status (same rules as the original) ---- */
function formatTime(t) {
  var parts = t.split(':').map(Number);
  var h = parts[0], m = parts[1];
  var ampm = h >= 12 ? 'PM' : 'AM';
  var hh = h % 12 || 12;
  return hh + ':' + String(m).padStart(2, '0') + ' ' + ampm;
}

function formatClockTime(d) {
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
}

function getMarketStatus(days, openingTime, closingTime, now) {
  var dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var todayName = dayNames[now.getDay()];
  var currentMinutes = now.getHours() * 60 + now.getMinutes();
  var openParts = openingTime.split(':').map(Number);
  var closeParts = closingTime.split(':').map(Number);
  var openMinutes = openParts[0] * 60 + openParts[1];
  var closeMinutes = closeParts[0] * 60 + closeParts[1];
  var isOpenDay = days.indexOf(todayName) !== -1;
  var isOpen = isOpenDay && currentMinutes >= openMinutes && currentMinutes < closeMinutes;
  var opensLater = isOpenDay && currentMinutes < openMinutes;
  var nextDay = '';
  if (!isOpen && !opensLater) {
    for (var i = 1; i <= 7; i++) {
      var n = dayNames[(now.getDay() + i) % 7];
      if (days.indexOf(n) !== -1) { nextDay = n; break; }
    }
  }
  if (isOpen) return { status: 'open', label: 'Open Now' };
  if (opensLater) return { status: 'opens-today', label: 'Opens Today at ' + formatTime(openingTime) };
  if (nextDay) return { status: 'closed', label: 'Next: ' + nextDay };
  return { status: 'closed', label: 'Closed' };
}

function getCurrentSeason() {
  var m = new Date().getMonth();
  if (m >= 2 && m <= 4) return 'Spring';
  if (m >= 5 && m <= 7) return 'Summer';
  if (m >= 8 && m <= 10) return 'Autumn';
  return 'Winter';
}

function haversine(lat1, lng1, lat2, lng2) {
  var R = 6371;
  var dLat = (lat2 - lat1) * Math.PI / 180;
  var dLng = (lng2 - lng1) * Math.PI / 180;
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/* ---- app state ---- */
var state = {
  page: 'home',
  marketId: null,
  produceId: null,
  search: '',
  visitorCount: 12458 + Math.floor(Math.random() * 100),
  bookmarks: [],
  now: new Date(),
  geo: { lat: null, lng: null, error: null, loading: false, granted: false },
  dir: { search: '', area: '', day: '', produce: '', sort: 'alpha', view: 'list', showFilters: false },
  prodFilter: { search: '', category: 'All', season: 'All' }
};

try {
  var savedBm = JSON.parse(localStorage.getItem('freshfind_bookmarks') || '[]');
  if (Array.isArray(savedBm)) state.bookmarks = savedBm;
} catch (e) {}

function persistBookmarks() {
  try { localStorage.setItem('freshfind_bookmarks', JSON.stringify(state.bookmarks)); } catch (e) {}
}

function isBookmarked(id) {
  return state.bookmarks.some(function (b) { return b.id === id; });
}

function toggleBookmark(item) {
  if (isBookmarked(item.id)) {
    state.bookmarks = state.bookmarks.filter(function (b) { return b.id !== item.id; });
    showToast(item.name + ' removed from saved items.');
  } else {
    state.bookmarks.push({
      id: item.id, type: item.type, name: item.name,
      location: item.location || '', category: item.category || '',
      note: '', savedAt: new Date().toISOString()
    });
    showToast(item.name + ' saved!');
  }
  persistBookmarks();
  updateSavedCount();
}

function updateSavedCount() {
  var el = document.getElementById('savedCount');
  if (!el) return;
  var n = state.bookmarks.length;
  if (n > 0) {
    el.hidden = false;
    el.textContent = n > 9 ? '9+' : n;
  } else {
    el.hidden = true;
  }
}

function showToast(msg, type) {
  type = type || 'success';
  var stack = document.getElementById('toasts');
  var t = document.createElement('div');
  t.className = 'ff-toast ' + type;
  var ico = type === 'error' ? 'alert' : type === 'info' ? 'info' : 'checkc';
  t.innerHTML = icon(ico, 16) + '<span>' + esc(msg) + '</span>';
  stack.appendChild(t);
  setTimeout(function () { t.remove(); }, 3000);
}

function go(page, extra) {
  state.page = page;
  if (extra && extra.marketId != null) state.marketId = extra.marketId;
  if (extra && extra.produceId != null) state.produceId = extra.produceId;
  if (extra && extra.search != null) {
    state.dir.search = extra.search;
  }
  window.scrollTo({ top: 0, behavior: extra && extra.instant ? 'auto' : 'smooth' });
  document.getElementById('mobileMenu').classList.remove('open');
  render();
}

function breadcrumb(items) {
  var html = '<nav class="crumb" aria-label="Breadcrumb"><button type="button" data-go="home">' + icon('home', 14) + ' Home</button>';
  items.forEach(function (it, i) {
    html += '<span class="d-inline-flex align-items-center gap-1">' + icon('chevron', 14);
    if (it.page && i < items.length - 1) {
      html += '<button type="button" data-go="' + it.page + '">' + esc(it.label) + '</button>';
    } else {
      html += '<span class="here">' + esc(it.label) + '</span>';
    }
    html += '</span>';
  });
  return html + '</nav>';
}

function statusBadge(m, size) {
  var st = getMarketStatus(m.days, m.openingTime, m.closingTime, state.now);
  var cls = st.status === 'open' ? 'status-open' : st.status === 'opens-today' ? 'status-soon' : 'status-closed';
  var pad = size === 'md' ? 'padding:4px 12px;font-size:13px;' : 'padding:2px 8px;font-size:12px;';
  var dot = st.status === 'open' ? '<span class="pulse-dot me-1"></span>' : '';
  return '<span class="rounded-pill fw-medium d-inline-flex align-items-center ' + cls + '" style="' + pad + '">' + dot + esc(st.label) + '</span>';
}

function heartBtn(item, size) {
  var saved = isBookmarked(item.id);
  return '<button type="button" class="heart-btn' + (saved ? ' saved' : '') + (size === 'sm' ? ' sm' : '') + '" data-bm=\'' + esc(JSON.stringify(item)) + '\' aria-label="' + (saved ? 'Remove' : 'Save') + ' ' + esc(item.name) + '">' + icon('heart', size === 'sm' ? 16 : 18) + '</button>';
}

function marketCard(m, compact) {
  var html = '<article class="m-card">';
  html += '<div class="thumb' + (compact ? ' compact' : '') + '">';
  html += '<img src="' + imgPath(m.image) + '" alt="' + esc(m.name) + '" loading="lazy">';
  html += '<div class="heart-abs">' + heartBtn({ id: 'market-' + m.id, type: 'market', name: m.name, location: m.location }, 'md') + '</div>';
  html += '<div class="status-abs">' + statusBadge(m) + '</div>';
  if (m.tags.indexOf('Organic') !== -1) {
    html += '<div class="org-abs"><span class="chip" style="background:#16a34a;color:#fff;border:none;">Organic</span></div>';
  }
  html += '</div><div class="p-3 d-flex flex-column flex-grow-1">';
  html += '<div class="d-flex justify-content-between gap-2 mb-2"><h3 class="h6 mb-0 line-2">' + esc(m.name) + '</h3>';
  html += '<span class="small text-nowrap" style="color:#d97706;">' + icon('star', 14) + ' ' + m.rating + '</span></div>';
  html += '<div class="small text-muted mb-1">' + icon('pin', 14) + ' ' + esc(m.location) + ', ' + esc(m.area) + '</div>';
  html += '<div class="small text-muted mb-2">' + icon('clock', 14) + ' ' + esc(m.days.join(', ')) + ' · ' + formatTime(m.openingTime) + ' – ' + formatTime(m.closingTime) + '</div>';
  if (!compact) html += '<p class="small text-muted line-2">' + esc(m.shortDescription) + '</p>';
  html += '<div class="d-flex flex-wrap gap-1 mb-3">';
  m.tags.slice(0, 3).forEach(function (tag) { html += '<span class="chip">' + esc(tag) + '</span>'; });
  html += '</div>';
  html += '<button class="btn-green w-100 mt-auto" data-market="' + m.id + '">View Details ' + icon('chevron', 16) + '</button>';
  html += '</div></article>';
  return html;
}

function produceCard(p) {
  var mkts = marketsData.filter(function (m) { return p.markets.indexOf(m.id) !== -1; });
  var html = '<article class="m-card">';
  html += '<div class="p-thumb">';
  html += '<span>' + p.emoji + '</span>';
  html += '<div class="heart-abs">' + heartBtn({ id: 'produce-' + p.id, type: 'produce', name: p.name, category: p.category }, 'sm') + '</div>';
  html += '<div class="org-abs"><span class="chip" style="background:rgba(255,255,255,.85);color:#4b5563;">' + esc(p.category) + '</span></div>';
  html += '</div><div class="p-3 d-flex flex-column flex-grow-1">';
  html += '<h3 class="h6">' + esc(p.name) + '</h3>';
  html += '<p class="small text-muted line-2">' + esc(p.description) + '</p>';
  html += '<div class="d-flex flex-wrap gap-1 mb-2">';
  p.season.forEach(function (s) {
    html += '<span class="chip season-' + s.toLowerCase() + '">' + esc(s) + '</span>';
  });
  html += '</div>';
  if (mkts.length) html += '<p class="small text-muted">Available at ' + mkts.length + ' market' + (mkts.length > 1 ? 's' : '') + '</p>';
  html += '<button class="btn-outline-green w-100 mt-auto" data-produce="' + p.id + '">View Details ' + icon('chevron', 16) + '</button>';
  html += '</div></article>';
  return html;
}

/* ---- pages ---- */
function renderHome() {
  var openNow = marketsData.filter(function (m) {
    return getMarketStatus(m.days, m.openingTime, m.closingTime, state.now).status === 'open';
  });
  var featured = marketsData.filter(function (m) { return m.featured; });
  var live = openNow.length ? openNow.length + ' market' + (openNow.length > 1 ? 's' : '') + ' open right now' : 'Markets open daily';

  var html = '';
  html += '<section class="hero" aria-label="Hero section">';
  html += '<img class="hero-bg" src="images/hero-market.jpg" alt="Vibrant farmers market scene with fresh produce">';
  html += '<div class="hero-shade"></div>';
  html += '<div class="hero-copy"><div style="max-width:36rem;">';
  html += '<div class="live-pill"><span class="pulse-dot" style="background:#bbf7d0;"></span> ' + esc(live) + '</div>';
  html += '<h1>Find Farmers\'<br><span>Markets</span> Near You</h1>';
  html += '<p class="text-white mb-4" style="opacity:.85;max-width:28rem;">Discover nearby markets, check schedules and locations, and see what\'s in season.</p>';
  html += '<form id="heroSearch" class="d-flex gap-2 mb-3" style="max-width:36rem;">';
  html += '<div class="search-wrap flex-grow-1"><span class="s-ico">' + icon('search', 18) + '</span>';
  html += '<input class="form-control" id="heroQ" placeholder="Search by market name, location or produce..." style="height:52px;border-radius:12px;" aria-label="Search markets"></div>';
  html += '<button class="btn-green" style="border-radius:12px;padding:0 22px;">Search</button></form>';
  html += '<button class="btn btn-link text-white text-decoration-none p-0" data-go="directory">' + icon('pin', 16) + ' Find Markets Near Me ' + icon('chevron', 16) + '</button>';
  html += '</div></div></section>';

  html += '<div class="clock-bar"><div class="inner">';
  html += '<div>' + icon('clock', 16) + ' <span style="color:#bbf7d0;">Current Time:</span> <span class="fw-semibold font-monospace" id="liveClock">' + formatClockTime(state.now) + '</span></div>';
  html += '<div style="color:#86efac;font-size:12px;">' + icon('leaf', 14) + ' <span id="visCount">' + state.visitorCount.toLocaleString() + '</span> visitors exploring FreshFind</div>';
  html += '</div></div>';

  var actions = [
    { ico: 'pin', label: 'Find a Market', desc: 'Search nearby markets', page: 'directory', bg: '#16a34a' },
    { ico: 'store', label: 'Market Directory', desc: 'Browse all markets', page: 'directory', bg: '#059669' },
    { ico: 'leaf', label: 'Produce Guide', desc: 'Explore seasonal produce', page: 'produce', bg: '#0d9488' },
    { ico: 'chat', label: 'AI Chatbot', desc: 'Get instant answers', page: 'chat', bg: '#15803d' }
  ];
  html += '<section class="py-5 bg-light"><div class="container" style="max-width:80rem;"><div class="row g-3">';
  actions.forEach(function (a) {
    html += '<div class="col-6 col-lg-3"><button class="qa-card" data-go="' + a.page + '">';
    html += '<div class="qa-ico" style="background:' + a.bg + ';">' + icon(a.ico, 22) + '</div>';
    html += '<h3 class="h6 mb-1">' + a.label + '</h3><p class="small text-muted mb-0">' + a.desc + '</p></button></div>';
  });
  html += '</div></div></section>';

  html += '<section class="py-5"><div class="container" style="max-width:80rem;">';
  html += '<div class="d-flex justify-content-between align-items-end mb-4"><div>';
  html += '<div class="d-flex align-items-center gap-2 mb-1"><span class="pulse-dot" style="width:10px;height:10px;"></span><h2 class="h4 mb-0">Open Right Now</h2></div>';
  html += '<p class="text-muted small mb-0">Markets currently open — updated live</p></div>';
  html += '<span class="small text-muted font-monospace" id="liveClock2">' + formatClockTime(state.now) + '</span></div>';
  if (openNow.length) {
    html += '<div class="row g-4">';
    openNow.forEach(function (m) { html += '<div class="col-md-6 col-lg-4">' + marketCard(m, true) + '</div>'; });
    html += '</div>';
  } else {
    html += '<div class="p-5 text-center rounded-4" style="background:#fffbeb;border:1px solid #fde68a;">';
    html += icon('clock', 40) + '<h3 class="h6 mt-3" style="color:#92400e;">No markets open right now</h3>';
    html += '<p class="small" style="color:#b45309;">Check back during market hours or browse our directory to plan your next visit.</p>';
    html += '<button class="btn-green" style="background:#d97706;" data-go="directory">View All Markets</button></div>';
  }
  html += '</div></section>';

  html += '<section class="py-5 bg-light"><div class="container" style="max-width:80rem;">';
  html += '<div class="d-flex justify-content-between mb-4"><div><h2 class="h4">Featured Markets</h2><p class="small text-muted mb-0">Discover some of our favourite local farmers\' markets</p></div>';
  html += '<button class="btn btn-link text-decoration-none d-none d-sm-inline" style="color:#15803d;" data-go="directory">View all markets ' + icon('chevron', 16) + '</button></div>';
  html += '<div class="row g-4">';
  featured.slice(0, 6).forEach(function (m) { html += '<div class="col-md-6 col-lg-4">' + marketCard(m) + '</div>'; });
  html += '</div><div class="text-center mt-4"><button class="btn-green" data-go="directory">Browse All Markets</button></div></div></section>';

  var seasons = [
    { name: 'Spring', ico: 'flower', color: '#fdf2f8', border: '#fbcfe8', accent: '#db2777', items: ['Leafy Greens', 'Radishes', 'Asparagus', 'Strawberries'], desc: 'Fresh spring greens and the first fruits of the year.' },
    { name: 'Summer', ico: 'sun', color: '#fffbeb', border: '#fde68a', accent: '#d97706', items: ['Tomatoes', 'Berries', 'Corn', 'Cucumbers', 'Peppers'], desc: 'Peak season for vibrant summer produce and stone fruits.' },
    { name: 'Autumn', ico: 'leaf', color: '#fff7ed', border: '#fed7aa', accent: '#ea580c', items: ['Pumpkins', 'Apples', 'Squash', 'Root Vegetables'], desc: 'Warm, hearty autumn harvest of roots and orchard fruits.' },
    { name: 'Winter', ico: 'snow', color: '#eff6ff', border: '#bfdbfe', accent: '#2563eb', items: ['Citrus', 'Root Vegetables', 'Broccoli', 'Winter Greens'], desc: 'Citrus, brassicas and stored roots for the cool months.' }
  ];
  var cur = getCurrentSeason();
  html += '<section class="py-5"><div class="container" style="max-width:80rem;">';
  html += '<div class="text-center mb-4"><h2 class="h4">What\'s In Season</h2><p class="text-muted">Discover what fresh produce is available throughout the year at your local farmers\' markets.</p></div>';
  html += '<div class="row g-3">';
  seasons.forEach(function (s) {
    html += '<div class="col-sm-6 col-lg-3"><div class="season-card' + (cur === s.name ? ' current' : '') + '" style="background:' + s.color + ';border:1px solid ' + s.border + ';">';
    if (cur === s.name) html += '<span class="chip position-absolute" style="top:12px;right:12px;background:#16a34a;color:#fff;border:none;">Current</span>';
    html += '<div class="rounded-3 bg-white d-inline-flex p-2 mb-2" style="opacity:.8;color:' + s.accent + ';">' + icon(s.ico, 22) + '</div>';
    html += '<h3 class="h5" style="color:' + s.accent + ';">' + s.name + '</h3>';
    html += '<p class="small text-muted">' + s.desc + '</p><ul class="list-unstyled small mb-3">';
    s.items.forEach(function (it) { html += '<li class="mb-1"><span class="pulse-dot me-1"></span>' + it + '</li>'; });
    html += '</ul><button class="btn btn-link p-0 text-decoration-none small" style="color:' + s.accent + ';" data-go="produce">Explore ' + s.name + ' Produce ' + icon('chevron', 14) + '</button>';
    html += '</div></div>';
  });
  html += '</div></div></section>';

  html += '<section class="py-5" style="background:#f0fdf4;"><div class="container text-center" style="max-width:80rem;">';
  html += '<h2 class="h4 mb-1">How FreshFind Works</h2><p class="text-muted mb-5">Three simple steps to your nearest farmers\' market</p>';
  html += '<div class="row g-4">';
  [{ n: '01', ico: 'search', t: 'Search', d: 'Find markets near you by name, location, area or produce type.' },
   { n: '02', ico: 'leaf', t: 'Explore', d: 'View market details, produce lists, schedules and location maps.' },
   { n: '03', ico: 'clock', t: 'Plan Your Visit', d: 'Check opening times, current status and plan your market trip.' }
  ].forEach(function (s) {
    html += '<div class="col-sm-4"><div class="position-relative d-inline-block mb-3">';
    html += '<div class="bg-white rounded-4 shadow-sm d-flex align-items-center justify-content-center" style="width:64px;height:64px;color:#16a34a;">' + icon(s.ico, 26) + '</div>';
    html += '<span class="step-num">' + s.n + '</span></div><h3 class="h5">' + s.t + '</h3><p class="small text-muted">' + s.d + '</p></div>';
  });
  html += '</div></div></section>';

  html += '<section class="py-5"><div class="container" style="max-width:80rem;">';
  html += '<div class="text-center mb-4"><h2 class="h4">Why FreshFind?</h2><p class="text-muted">Everything you need to connect with local food</p></div><div class="row g-3">';
  [{ ico: 'checkc', t: 'Accurate Information', d: 'Market details, schedules and produce all in one place.' },
   { ico: 'leaf', t: 'Seasonal Guidance', d: "Know what's likely to be available before you visit." },
   { ico: 'users', t: 'Support Local', d: 'Discover local farmers and markets in your community.' },
   { ico: 'star', t: 'Easy to Use', d: 'Simple, accessible experience for everyone.' }
  ].forEach(function (w) {
    html += '<div class="col-sm-6 col-lg-3"><div class="ff-card p-4 why-card h-100"><div class="why-ico">' + icon(w.ico, 20) + '</div><h3 class="h6">' + w.t + '</h3><p class="small text-muted mb-0">' + w.d + '</p></div></div>';
  });
  html += '</div></div></section>';

  html += '<section class="cta-band"><h2 class="fw-bold mb-3">Good Food. Stronger Communities.</h2>';
  html += '<p class="mb-4" style="color:#bbf7d0;max-width:28rem;margin-left:auto;margin-right:auto;">Discover fresh local produce and support the people who grow it.</p>';
  html += '<div class="d-flex flex-column flex-sm-row gap-3 justify-content-center">';
  html += '<button class="btn-green" style="background:#fff;color:#15803d;" data-go="directory">' + icon('store', 18) + ' Find a Market</button>';
  html += '<button class="btn-green" style="background:#16a34a;border:2px solid rgba(255,255,255,.3);" data-go="produce">' + icon('carrot', 18) + ' Explore Produce</button>';
  html += '</div></section>';

  return html;
}

function renderDirectory() {
  var f = state.dir;
  var list = marketsData.slice();
  var q = (f.search || '').toLowerCase().trim();
  if (q) {
    list = list.filter(function (m) {
      return (m.name + m.location + m.area + m.description + m.produce.join(' ') + m.tags.join(' ')).toLowerCase().indexOf(q) !== -1;
    });
  }
  if (f.area) list = list.filter(function (m) { return m.area === f.area; });
  if (f.day) list = list.filter(function (m) { return m.days.indexOf(f.day) !== -1; });
  if (f.produce) {
    if (f.produce === 'Organic') list = list.filter(function (m) { return m.tags.indexOf('Organic') !== -1; });
    else list = list.filter(function (m) { return m.produceTypes.indexOf(f.produce) !== -1 || m.tags.indexOf(f.produce) !== -1; });
  }
  if (f.sort === 'alpha') list.sort(function (a, b) { return a.name.localeCompare(b.name); });
  else if (f.sort === 'proximity' && state.geo.lat) {
    list.sort(function (a, b) {
      return haversine(state.geo.lat, state.geo.lng, a.lat, a.lng) - haversine(state.geo.lat, state.geo.lng, b.lat, b.lng);
    });
  } else if (f.sort === 'next-open') {
    var dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var today = state.now.getDay();
    function nextOpen(m) {
      for (var i = 0; i <= 7; i++) {
        if (m.days.indexOf(dayNames[(today + i) % 7]) !== -1) return i;
      }
      return 7;
    }
    list.sort(function (a, b) { return nextOpen(a) - nextOpen(b); });
  } else if (f.sort === 'rating') list.sort(function (a, b) { return b.rating - a.rating; });

  var areas = [];
  marketsData.forEach(function (m) { if (areas.indexOf(m.area) === -1) areas.push(m.area); });
  areas.sort();
  var days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  var produce = ['Fruits', 'Vegetables', 'Herbs', 'Dairy', 'Meat', 'Baked Goods', 'Organic', 'Flowers', 'Other'];
  var activeN = [f.area, f.day, f.produce].filter(Boolean).length;

  var html = '<div class="wrap">';
  html += breadcrumb([{ label: 'Market Directory', page: 'directory' }]);
  html += '<h1 class="h3 mt-3">Market Directory</h1><p class="text-muted">Find and explore farmers\' markets in your area.</p>';
  html += '<div class="ff-card p-3 mb-4"><div class="d-flex flex-column flex-sm-row gap-2 mb-2">';
  html += '<div class="search-wrap flex-grow-1"><span class="s-ico">' + icon('search', 18) + '</span>';
  html += '<input class="form-control" id="dirSearch" value="' + esc(f.search) + '" placeholder="Search markets, locations or produce..." style="border-radius:12px;"></div>';
  html += '<div class="d-flex gap-2">';
  html += '<button class="btn-outline-green" id="toggleFilters">' + icon('sliders', 16) + ' Filters' + (activeN ? ' <span class="count-badge position-static d-inline-flex">' + activeN + '</span>' : '') + '</button>';
  html += '<button class="btn-outline-green" id="nearMe">' + icon('nav', 16) + ' ' + (state.geo.loading ? 'Finding...' : 'Near Me') + '</button>';
  html += '</div></div>';
  if (state.geo.error) html += '<div class="alert alert-warning py-2 small">' + esc(state.geo.error) + '</div>';
  if (state.geo.granted) html += '<div class="alert alert-success py-2 small">Location found! Markets sorted by proximity.</div>';
  if (f.showFilters) {
    html += '<div class="row g-2 pt-3" style="border-top:1px solid #f3f4f6;">';
    html += '<div class="col-sm-6 col-lg-3"><label class="small text-muted">Location / Area</label><select class="form-select" id="fArea"><option value="">All Areas</option>';
    areas.forEach(function (a) { html += '<option' + (f.area === a ? ' selected' : '') + '>' + a + '</option>'; });
    html += '</select></div>';
    html += '<div class="col-sm-6 col-lg-3"><label class="small text-muted">Day of Week</label><select class="form-select" id="fDay"><option value="">All Days</option>';
    days.forEach(function (d) { html += '<option' + (f.day === d ? ' selected' : '') + '>' + d + '</option>'; });
    html += '</select></div>';
    html += '<div class="col-sm-6 col-lg-3"><label class="small text-muted">Produce Type</label><select class="form-select" id="fProduce"><option value="">All Types</option>';
    produce.forEach(function (p) { html += '<option' + (f.produce === p ? ' selected' : '') + '>' + p + '</option>'; });
    html += '</select></div>';
    html += '<div class="col-sm-6 col-lg-3"><label class="small text-muted">Sort By</label><select class="form-select" id="fSort">';
    [['alpha', 'Alphabetically'], ['proximity', 'By Proximity'], ['next-open', 'By Next Opening'], ['rating', 'By Rating']].forEach(function (o) {
      html += '<option value="' + o[0] + '"' + (f.sort === o[0] ? ' selected' : '') + '>' + o[1] + '</option>';
    });
    html += '</select></div>';
    if (activeN) html += '<div class="col-12"><button class="btn btn-outline-danger btn-sm" id="clearFilters">' + icon('x', 14) + ' Clear All Filters</button></div>';
    html += '</div>';
  }
  html += '</div>';

  html += '<div class="d-flex justify-content-between align-items-center mb-3"><p class="small text-muted mb-0"><strong class="text-dark">' + list.length + '</strong> market' + (list.length !== 1 ? 's' : '') + ' found' + (q ? ' for "' + esc(q) + '"' : '') + '</p>';
  html += '<div><button class="icon-btn' + (f.view === 'list' ? ' text-white' : '') + '" id="viewList" style="' + (f.view === 'list' ? 'background:#16a34a;' : '') + '">' + icon('list', 16) + '</button>';
  html += '<button class="icon-btn' + (f.view === 'map' ? ' text-white' : '') + '" id="viewMap" style="' + (f.view === 'map' ? 'background:#16a34a;' : '') + '">' + icon('map', 16) + '</button></div></div>';

  if (f.view === 'map') {
    html += renderMapView(list);
  } else if (list.length) {
    html += '<div class="row g-3">';
    list.forEach(function (m) { html += '<div class="col-sm-6 col-lg-4 col-xl-3">' + marketCard(m) + '</div>'; });
    html += '</div>';
  } else {
    html += '<div class="text-center py-5"><h3 class="h5">No markets found</h3><p class="text-muted">Try adjusting your search or filters.</p><button class="btn-green" id="clearFilters">Clear Search</button></div>';
  }
  html += '</div>';
  return html;
}

/* ---- interactive market map ------------------------------------------------
   Self-contained, data-driven map: every marker is projected from the real
   lat/lng stored in marketsData (no invented coordinates), the user's own
   position only ever comes from the browser geolocation API, and all cards /
   pop-ups are rendered from the same market + produce data the rest of the
   site uses. ------------------------------------------------------------------ */

var NEAR_RADIUS_KM = 25; // what we consider "nearby" for a real user location

/** markets sorted by true distance from a (geolocated) user */
function nearbyMarkets(list, user, radius) {
  if (radius == null) radius = NEAR_RADIUS_KM;
  var sorted = list.map(function (m) {
    return { m: m, d: haversine(user.lat, user.lng, m.lat, m.lng) };
  });
  sorted.sort(function (a, b) { return a.d - b.d; });
  return { sorted: sorted, near: sorted.filter(function (x) { return x.d <= radius; }) };
}

/** the real, permission-granted browser location — never invented */
function userLocation() {
  return state.geo && state.geo.granted && state.geo.lat != null
    ? { lat: state.geo.lat, lng: state.geo.lng }
    : null;
}

function fmtDist(km) {
  return km < 10 ? km.toFixed(1) + ' km' : Math.round(km).toLocaleString() + ' km';
}

/* map view state (zoom / pan / open pop-up survive re-renders) */
var mapCtl = { zoom: 1, dx: 0, dy: 0, open: null, list: null, view: null };

function computeMapView(list, user) {
  var lats = list.map(function (m) { return m.lat; });
  var lngs = list.map(function (m) { return m.lng; });
  var minLat = Math.min.apply(null, lats), maxLat = Math.max.apply(null, lats);
  var minLng = Math.min.apply(null, lngs), maxLng = Math.max.apply(null, lngs);

  var userNear = false;
  if (user) {
    // a granted live location is ALWAYS honoured: the frame includes the
    // user so the map is centred on their area with the markets in view
    userNear = nearbyMarkets(list, user).near.length > 0;
    minLat = Math.min(minLat, user.lat); maxLat = Math.max(maxLat, user.lat);
    minLng = Math.min(minLng, user.lng); maxLng = Math.max(maxLng, user.lng);
  }
  var padLat = Math.max((maxLat - minLat) * 0.22, 0.008);
  var padLng = Math.max((maxLng - minLng) * 0.22, 0.008);
  minLat -= padLat; maxLat += padLat; minLng -= padLng; maxLng += padLng;

  var midLat = (minLat + maxLat) / 2;
  var kx = Math.cos(midLat * Math.PI / 180);
  var span = Math.max(maxLat - minLat, (maxLng - minLng) * kx);
  return { cx: (minLng + maxLng) / 2, cy: midLat, kx: kx, span: span, userNear: userNear };
}

function mapProject(lat, lng, view) {
  var cx = view.cx + mapCtl.dx / mapCtl.zoom;
  var cy = view.cy + mapCtl.dy / mapCtl.zoom;
  var span = view.span / mapCtl.zoom;
  return {
    x: 50 + ((lng - cx) * view.kx / span) * 100,
    y: 50 - ((lat - cy) / span) * 100
  };
}

function mapBackground() {
  // decorative street-map styling only — no geographic claims
  return '<svg class="ffmap-bg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">' +
    '<rect width="100" height="100" fill="#eaf3e7"/>' +
    '<ellipse cx="12" cy="86" rx="26" ry="20" fill="#dbeafe" opacity=".8"/>' +
    '<ellipse cx="88" cy="10" rx="20" ry="14" fill="#d1fae5"/>' +
    '<ellipse cx="70" cy="78" rx="16" ry="11" fill="#d1fae5" opacity=".8"/>' +
    '<g stroke="#ffffff" stroke-width="2.6" opacity=".9">' +
    '<path d="M -5 30 H 105" /><path d="M -5 62 H 105" /><path d="M 26 -5 V 105" /><path d="M 64 -5 V 105" /><path d="M -5 88 L 105 44" /></g>' +
    '<g stroke="#ffffff" stroke-width="1.1" opacity=".8">' +
    '<path d="M -5 14 H 105" /><path d="M -5 46 H 105" /><path d="M -5 78 H 105" />' +
    '<path d="M 10 -5 V 105" /><path d="M 44 -5 V 105" /><path d="M 82 -5 V 105" /></g>' +
    '<g stroke="#fde68a" stroke-width="1.6" opacity=".7"><path d="M -5 52 L 105 20" /><path d="M 48 -5 L 74 105" /></g>' +
    '</svg>';
}

function mapPopupHTML(m, pos) {
  var items = produceData.filter(function (p) { return m.produce.indexOf(p.id) !== -1; });
  var below = pos.y < 46;
  var left = Math.max(18, Math.min(82, pos.x));
  var html = '<div class="ffmap-popup' + (below ? ' below' : '') + '" style="left:' + left + '%;top:' + pos.y + '%;" role="dialog" aria-label="' + esc(m.name) + '">';
  html += '<button class="icon-btn position-absolute top-0 end-0 m-1 p-1" data-mapclose aria-label="Close pop-up">' + icon('x', 14) + '</button>';
  html += '<h3 class="h6 mb-1 pe-3">' + esc(m.name) + '</h3>';
  html += '<div class="mb-2">' + statusBadge(m) + '</div>';
  html += '<div class="small text-muted mb-1">' + icon('pin', 13) + ' ' + esc(m.address) + '</div>';
  html += '<div class="small text-muted mb-2">' + icon('clock', 13) + ' ' + esc(m.days.join(', ')) + ' · ' + formatTime(m.openingTime) + ' – ' + formatTime(m.closingTime) + '</div>';
  if (items.length) {
    html += '<div class="d-flex flex-wrap gap-1 mb-2">';
    items.slice(0, 6).forEach(function (p) { html += '<span class="chip" title="' + esc(p.name) + '">' + p.emoji + ' ' + esc(p.name) + '</span>'; });
    if (items.length > 6) html += '<span class="chip">+' + (items.length - 6) + '</span>';
    html += '</div>';
  }
  html += '<div class="d-flex gap-1">';
  html += '<button class="btn-green py-1 px-2 flex-grow-1" style="font-size:12px;" data-market="' + m.id + '">View Details ' + icon('chevron', 13) + '</button>';
  html += '<button class="btn-outline-green py-1 px-2" style="font-size:12px;" data-mapsave=\'' + esc(JSON.stringify({ id: 'market-' + m.id, type: 'market', name: m.name, location: m.location })) + '\'>' + icon('heart', 13) + ' Save</button>';
  html += '</div></div>';
  return html;
}

function mapInner(list) {
  var user = userLocation();

  /* when we know the user's real location, focus on the markets that are
     actually nearby (spec: user area → nearby markets → markers). Without a
     location, or far away, the full (filtered) list is shown as before. */
  var nearInfo = user ? nearbyMarkets(list, user) : null;
  var displayed = list;
  if (nearInfo && nearInfo.near.length && nearInfo.near.length < list.length) {
    displayed = nearInfo.near.map(function (x) { return x.m; });
  }
  var focused = nearInfo && nearInfo.near.length > 0;

  var view = computeMapView(displayed, user);
  mapCtl.view = view;
  var html = mapBackground();

  html += '<div class="ffmap-ctl">';
  html += '<button data-mapzoom="in" aria-label="Zoom in">+</button>';
  html += '<button data-mapzoom="out" aria-label="Zoom out">−</button>';
  html += '<button data-mapzoom="reset" aria-label="Reset view" style="font-size:12px;">⌂</button>';
  html += '</div>';

  /* status / legend chip: count, legend, and the current location state */
  var chips = '<div class="ffmap-chip d-flex flex-column gap-1">';
  chips += '<span>' + icon('pin', 13) + ' ' + displayed.length +
    (focused && displayed.length !== list.length ? ' nearby market' + (displayed.length !== 1 ? 's' : '') + ' (of ' + list.length + ')' : ' market' + (displayed.length !== 1 ? 's' : '')) +
    ' · tap a marker</span>';
  chips += '<span class="ffmap-legend"><i class="lg-pin"></i> Market' +
    (user ? ' &nbsp;<i class="lg-you"></i> You' : '') + '</span>';
  if (state.geo.loading) {
    chips += '<span style="color:#1d4ed8;">' + icon('nav', 13) + ' Requesting your location…</span>';
  } else if (user) {
    var closest = nearInfo.sorted[0];
    chips += '<span style="color:#2563eb;">' + icon('nav', 13) + ' centred on your location' +
      (view.userNear ? '' : ' · closest market ~' + fmtDist(closest.d) + ' away') + '</span>';
  } else if (state.geo.error) {
    chips += '<span style="color:#b45309;">' + icon('alert', 13) + ' ' + esc(state.geo.error) + ' — showing all markets</span>';
  }
  chips += '</div>';
  html += chips;

  var placed = [];
  displayed.forEach(function (m) {
    var p = mapProject(m.lat, m.lng, view);
    if (p.x < -4 || p.x > 104 || p.y < -4 || p.y > 104) return;
    // simple declutter: nudge visually-overlapping pins apart. Display-only —
    // the underlying coordinates stay exactly as stored in marketsData.
    var dxs = [0, 4.5, -4.5, 0, 4.5, -4.5, 9, -9];
    var dys = [0, -6, -6, 7, 7, 7, 0, 0];
    for (var i = 0; i < dxs.length; i++) {
      var nx = p.x + dxs[i], ny = p.y + dys[i];
      var free = placed.every(function (o) { return Math.abs(o.x - nx) > 4 || Math.abs(o.y - ny) > 4; });
      if (free) { p = { x: nx, y: ny }; break; }
    }
    placed.push(p);
    html += '<button class="ffmap-marker' + (mapCtl.open === m.id ? ' active' : '') + '" data-mapmarket="' + m.id + '" style="left:' + p.x + '%;top:' + p.y + '%;" aria-label="' + esc(m.name) + '" title="' + esc(m.name) + '">';
    html += '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2C7.9 2 4.5 5.3 4.5 9.4c0 5.4 7.5 12.6 7.5 12.6s7.5-7.2 7.5-12.6C19.5 5.3 16.1 2 12 2z" fill="#dc2626" stroke="#991b1b" stroke-width="1"/><circle cx="12" cy="9.4" r="2.7" fill="#fff"/></svg>';
    html += '<span class="ffmap-tag">' + esc(m.name.split(' ').slice(0, 2).join(' ')) + '</span></button>';
  });

  if (user) {
    var up = mapProject(user.lat, user.lng, view);
    html += '<div class="ffmap-user" style="left:' + up.x + '%;top:' + up.y + '%;" title="Your location"><span></span><em class="ffmap-user-tag">You</em></div>';
  }

  if (mapCtl.open != null) {
    var om = displayed.find(function (m) { return m.id === mapCtl.open; });
    if (om) html += mapPopupHTML(om, mapProject(om.lat, om.lng, view));
  }
  return html;
}

function renderMapView(list) {
  mapCtl.list = list;
  return '<div class="ffmap" id="ffmap">' + mapInner(list) + '</div>';
}

function redrawMap() {
  var box = document.getElementById('ffmap');
  if (box && mapCtl.list) box.innerHTML = mapInner(mapCtl.list);
}

function bindMapView() {
  var box = document.getElementById('ffmap');
  if (!box) return;
  var drag = null, suppress = false;

  box.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && mapCtl.open != null) { mapCtl.open = null; redrawMap(); }
  });

  box.addEventListener('pointerdown', function (e) {
    if (e.target.closest('button, .ffmap-popup')) return;
    drag = { x: e.clientX, y: e.clientY, dx: mapCtl.dx, dy: mapCtl.dy, moved: false };
  });
  box.addEventListener('pointermove', function (e) {
    if (!drag || !mapCtl.view) return;
    var r = box.getBoundingClientRect();
    if (Math.abs(e.clientX - drag.x) + Math.abs(e.clientY - drag.y) > 4) drag.moved = true;
    if (!drag.moved) return;
    mapCtl.dx = drag.dx - (e.clientX - drag.x) / r.width * (mapCtl.view.span / mapCtl.zoom);
    mapCtl.dy = drag.dy + (e.clientY - drag.y) / r.height * (mapCtl.view.span / mapCtl.zoom);
    redrawMap();
  });
  box.addEventListener('pointerup', function () {
    if (drag && drag.moved) { suppress = true; setTimeout(function () { suppress = false; }, 0); }
    drag = null;
  });
  box.addEventListener('pointerleave', function () { drag = null; });

  box.addEventListener('click', function (e) {
    if (suppress) return;
    var mk = e.target.closest('[data-mapmarket]');
    if (mk) { mapCtl.open = Number(mk.getAttribute('data-mapmarket')); redrawMap(); return; }
    if (e.target.closest('[data-mapclose]')) { mapCtl.open = null; redrawMap(); return; }
    var z = e.target.closest('[data-mapzoom]');
    if (z) {
      var k = z.getAttribute('data-mapzoom');
      if (k === 'in') mapCtl.zoom = Math.min(8, mapCtl.zoom * 1.5);
      else if (k === 'out') mapCtl.zoom = Math.max(1, mapCtl.zoom / 1.5);
      else { mapCtl.zoom = 1; mapCtl.dx = 0; mapCtl.dy = 0; }
      redrawMap();
      return;
    }
    var sv = e.target.closest('[data-mapsave]');
    if (sv) {
      try { toggleBookmark(JSON.parse(sv.getAttribute('data-mapsave'))); } catch (err) {}
      render();
      return;
    }
    var vd = e.target.closest('[data-market]');
    if (vd) { go('market-detail', { marketId: Number(vd.getAttribute('data-market')) }); return; }
    if (!e.target.closest('button')) { mapCtl.open = null; redrawMap(); }
  });
}

function miniMap(name, address, lat, lng) {
  var q = encodeURIComponent(address);
  var html = '<div class="mini-map">';
  html += '<iframe title="Map of ' + esc(name) + '" src="https://maps.google.com/maps?q=' + q + '&z=14&output=embed" style="width:100%;height:100%;border:0;" loading="lazy"></iframe>';
  html += '</div>';
  html += '<div class="mt-2"><a class="btn-green btn-sm" href="https://www.google.com/maps/search/?api=1&query=' + q + '" target="_blank" rel="noopener">' + icon('nav', 14) + ' Get Directions</a></div>';
  return html;
}

function renderMarket() {
  var m = marketsData.find(function (x) { return x.id === state.marketId; });
  if (!m) {
    return '<div class="wrap text-center py-5"><h2 class="h5">Market not found</h2><button class="btn-green" data-go="directory">Back to Directory</button></div>';
  }
  var items = produceData.filter(function (p) { return m.produce.indexOf(p.id) !== -1; });
  var days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  var dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var html = '<div class="wrap">';
  html += breadcrumb([{ label: 'Market Directory', page: 'directory' }, { label: m.name }]);
  html += '<button class="btn btn-link text-muted text-decoration-none ps-0 mb-3" data-go="directory">' + icon('chevronL', 16) + ' Back to Directory</button>';
  html += '<div class="detail-hero"><img src="' + imgPath(m.image) + '" alt="' + esc(m.name) + '"><div class="shade"></div>';
  html += '<div class="info"><div>' + statusBadge(m, 'md') + '<h1 class="h3 text-white mt-2 mb-1">' + esc(m.name) + '</h1>';
  html += '<p class="text-white-50 small mb-0">' + icon('pin', 16) + ' ' + esc(m.address) + '</p></div>';
  html += heartBtn({ id: 'market-' + m.id, type: 'market', name: m.name, location: m.location }) + '</div></div>';

  html += '<div class="row g-4"><div class="col-lg-8">';
  html += '<div class="ff-card p-4 mb-3"><div class="row text-center">';
  html += '<div class="col-3">' + icon('star', 18) + '<div class="fw-bold">' + m.rating + '</div><div class="small text-muted">Rating</div></div>';
  html += '<div class="col-3" style="color:#22c55e;">' + icon('users', 18) + '<div class="fw-bold text-dark">' + m.vendors + '+</div><div class="small text-muted">Vendors</div></div>';
  html += '<div class="col-3" style="color:#3b82f6;">' + icon('calendar', 18) + '<div class="fw-bold text-dark">' + m.established + '</div><div class="small text-muted">Established</div></div>';
  html += '<div class="col-3" style="color:#a855f7;">' + icon('clock', 18) + '<div class="fw-bold text-dark">' + m.days.length + 'x</div><div class="small text-muted">Per Week</div></div>';
  html += '</div></div>';
  html += '<div class="ff-card p-4 mb-3"><h2 class="h5">About This Market</h2><p class="text-muted">' + esc(m.description) + '</p><div class="d-flex flex-wrap gap-2">';
  if (m.parkingAvailable) html += '<span class="chip" style="background:#eff6ff;color:#1d4ed8;border-color:#bfdbfe;">' + icon('parking', 14) + ' Parking Available</span>';
  if (m.petFriendly) html += '<span class="chip">' + icon('paw', 14) + ' Pet Friendly</span>';
  if (m.wheelchairAccessible) html += '<span class="chip" style="background:#faf5ff;color:#7e22ce;border-color:#e9d5ff;">' + icon('access', 14) + ' Wheelchair Accessible</span>';
  html += '</div></div>';

  html += '<div class="ff-card p-4 mb-3"><h2 class="h5 mb-3">Weekly Schedule</h2>';
  days.forEach(function (day) {
    var open = m.days.indexOf(day) !== -1;
    var today = dayNames[state.now.getDay()] === day;
    html += '<div class="d-flex justify-content-between px-3 py-2 rounded-3 mb-2" style="background:' + (today ? '#f0fdf4' : '#f9fafb') + ';' + (today ? 'border:1px solid #bbf7d0;' : '') + '">';
    html += '<span class="fw-medium">' + day + (today ? ' <small>(Today)</small>' : '') + '</span>';
    html += open ? '<span>' + formatTime(m.openingTime) + ' – ' + formatTime(m.closingTime) + '</span>' : '<span class="text-muted">Closed</span>';
    html += '</div>';
  });
  html += '</div>';

  if (items.length) {
    html += '<div class="ff-card p-4 mb-3"><h2 class="h5 mb-3">Typical Produce Available</h2><div class="row g-2">';
    items.forEach(function (p) {
      html += '<div class="col-6 col-md-3"><button class="w-100 p-3 rounded-3 text-center border-0" style="background:#f0fdf4;" data-produce="' + p.id + '">';
      html += '<div style="font-size:1.6rem;">' + p.emoji + '</div><div class="small fw-medium">' + esc(p.name) + '</div><div class="small text-muted">' + esc(p.category) + '</div></button></div>';
    });
    html += '</div></div>';
  }

  if (m.gallery && m.gallery.length) {
    html += '<div class="ff-card p-4 mb-3"><h2 class="h5 mb-3">Market Gallery</h2><div class="row g-2">';
    m.gallery.forEach(function (g, i) {
      html += '<div class="col-6 col-md-4"><button class="border-0 p-0 w-100 rounded-3 overflow-hidden" data-gallery="' + imgPath(g) + '"><img src="' + imgPath(g) + '" alt="' + esc(m.name) + ' gallery ' + (i + 1) + '" style="height:140px;width:100%;object-fit:cover;"></button></div>';
    });
    html += '</div></div>';
  }

  var shareUrl = encodeURIComponent(location.href);
  html += '<div class="ff-card p-4 mb-3"><h2 class="h5">' + icon('share', 18) + ' Share This Market</h2><div class="d-flex flex-wrap gap-2 mt-2">';
  html += '<a class="btn btn-sm text-white" style="background:#2563eb;" target="_blank" href="https://facebook.com/sharer/sharer.php?u=' + shareUrl + '">Facebook</a>';
  html += '<a class="btn btn-sm text-white" style="background:#111827;" target="_blank" href="https://twitter.com/intent/tweet?text=' + encodeURIComponent('Check out ' + m.name + ' on FreshFind!') + '&url=' + shareUrl + '">Twitter/X</a>';
  html += '<a class="btn btn-sm text-white" style="background:#22c55e;" target="_blank" href="https://wa.me/?text=' + encodeURIComponent('Check out ' + m.name + '! ' + location.href) + '">WhatsApp</a>';
  html += '<button class="btn btn-outline-secondary btn-sm" id="copyLink">Copy Link</button></div></div>';

  html += '</div><div class="col-lg-4">';
  html += '<div class="ff-card p-4 mb-3 text-center">' + heartBtn({ id: 'market-' + m.id, type: 'market', name: m.name, location: m.location }) + '<p class="small text-muted mt-2 mb-0">Save this market to your collection</p></div>';
  html += '<div class="ff-card p-4 mb-3"><h3 class="h6">' + icon('pin', 16) + ' Location</h3>' + miniMap(m.name, m.address, m.lat, m.lng);
  html += '<p class="small fw-medium mt-2 mb-0">' + esc(m.address) + '</p><p class="small text-muted">Area: ' + esc(m.area) + '</p></div>';
  html += '<div class="ff-card p-4 mb-3"><h3 class="h6">' + icon('clock', 16) + ' Today\'s Hours</h3>' + statusBadge(m, 'md');
  html += '<p class="small mt-2 mb-0">Current time: <span class="fw-semibold font-monospace">' + formatClockTime(state.now) + '</span></p>';
  if (m.days.indexOf(dayNames[state.now.getDay()]) !== -1) {
    html += '<p class="small">Hours: ' + formatTime(m.openingTime) + ' – ' + formatTime(m.closingTime) + '</p>';
  }
  html += '</div>';
  html += '<div class="ff-card p-4 mb-3"><h3 class="h6">Contact</h3>';
  html += '<a class="d-block small mb-2" href="mailto:' + esc(m.contact) + '">' + icon('mail', 16) + ' ' + esc(m.contact) + '</a>';
  html += '<a class="d-block small mb-2" href="tel:' + esc(m.phone) + '">' + icon('phone', 16) + ' ' + esc(m.phone) + '</a>';
  if (m.website) html += '<a class="d-block small" href="' + esc(m.website) + '" target="_blank" rel="noopener">' + icon('globe', 16) + ' Visit Website</a>';
  html += '</div><div class="ff-card p-4"><h3 class="h6">Produce Categories</h3><div class="d-flex flex-wrap gap-2">';
  m.tags.forEach(function (t) { html += '<span class="chip">' + esc(t) + '</span>'; });
  html += '</div></div></div></div></div>';
  return html;
}

function renderProduce() {
  var f = state.prodFilter;
  var items = produceData.slice();
  if (f.search) {
    var q = f.search.toLowerCase();
    items = items.filter(function (p) {
      return (p.name + p.category + p.description).toLowerCase().indexOf(q) !== -1;
    });
  }
  if (f.category !== 'All') items = items.filter(function (p) { return p.category === f.category; });
  if (f.season !== 'All') items = items.filter(function (p) { return p.season.indexOf(f.season) !== -1; });
  var cats = ['All', 'Fruits', 'Vegetables', 'Herbs', 'Dairy', 'Meat', 'Baked Goods', 'Flowers', 'Other'];
  var seasons = ['All', 'Spring', 'Summer', 'Autumn', 'Winter'];
  var sIco = { All: 'sprout', Spring: 'flower', Summer: 'sun', Autumn: 'leaf', Winter: 'snow' };

  var html = '<div class="wrap">';
  html += breadcrumb([{ label: 'Produce Guide', page: 'produce' }]);
  html += '<h1 class="h3 mt-3">Produce Guide</h1><p class="text-muted">Explore seasonal fruits, vegetables, herbs and local products.</p>';
  html += '<div class="ff-card p-4 mb-4"><div class="search-wrap mb-3"><span class="s-ico">' + icon('search', 18) + '</span>';
  html += '<input class="form-control" id="prodSearch" value="' + esc(f.search) + '" placeholder="Search produce..." style="border-radius:12px;"></div>';
  html += '<p class="small text-muted mb-2">Category</p><div class="d-flex flex-wrap gap-1 mb-3">';
  cats.forEach(function (c) {
    html += '<button class="filter-tab' + (f.category === c ? ' on' : '') + '" data-cat="' + c + '">' + c + '</button>';
  });
  html += '</div><p class="small text-muted mb-2">Season</p><div class="d-flex flex-wrap gap-1">';
  seasons.forEach(function (s) {
    html += '<button class="filter-tab' + (f.season === s ? ' on' : '') + '" data-season="' + s + '">' + icon(sIco[s], 14) + ' ' + s + '</button>';
  });
  html += '</div></div>';
  html += '<p class="small text-muted"><strong class="text-dark">' + items.length + '</strong> produce items</p>';
  if (items.length) {
    html += '<div class="row g-3">';
    items.forEach(function (p) { html += '<div class="col-6 col-sm-4 col-lg-3 col-xl">' + produceCard(p) + '</div>'; });
    html += '</div>';
  } else {
    html += '<div class="text-center py-5"><h3 class="h5">No produce found</h3><button class="btn-green" id="clearProd">Clear Filters</button></div>';
  }
  html += '</div>';
  return html;
}

function renderProduceDetail() {
  var p = produceData.find(function (x) { return x.id === state.produceId; });
  if (!p) return '<div class="wrap text-center py-5"><h2 class="h5">Produce not found</h2><button class="btn-green" data-go="produce">Back to Produce Guide</button></div>';
  var mkts = marketsData.filter(function (m) { return p.markets.indexOf(m.id) !== -1; });
  var html = '<div class="wrap" style="max-width:64rem;">';
  html += breadcrumb([{ label: 'Produce Guide', page: 'produce' }, { label: p.name }]);
  html += '<button class="btn btn-link text-muted text-decoration-none ps-0 mb-3" data-go="produce">' + icon('chevronL', 16) + ' Back to Produce Guide</button>';
  html += '<div class="row g-4"><div class="col-lg-4">';
  html += '<div class="p-thumb rounded-4 mb-3" style="height:220px;position:relative;"><span style="font-size:5rem;">' + p.emoji + '</span>';
  html += '<div class="heart-abs">' + heartBtn({ id: 'produce-' + p.id, type: 'produce', name: p.name, category: p.category }) + '</div></div>';
  html += '<div class="ff-card p-3 mb-3"><h3 class="h6">In Season</h3><div class="d-flex flex-wrap gap-2">';
  p.season.forEach(function (s) { html += '<span class="chip season-' + s.toLowerCase() + '">' + esc(s) + '</span>'; });
  html += '</div></div><div class="ff-card p-3"><h3 class="h6">Details</h3>';
  html += '<div class="d-flex justify-content-between small"><span class="text-muted">Category</span><span>' + esc(p.category) + '</span></div>';
  html += '<div class="d-flex justify-content-between small mt-2"><span class="text-muted">Available Markets</span><span>' + mkts.length + '</span></div></div></div>';
  html += '<div class="col-lg-8"><span class="chip">' + esc(p.category) + '</span><h1 class="h3 mt-2">' + esc(p.name) + '</h1>';
  html += '<div class="ff-card p-4 mb-3"><h2 class="h6">About</h2><p class="text-muted small mb-0">' + esc(p.description) + '</p></div>';
  html += '<div class="ff-card p-4 mb-3"><h2 class="h6">' + icon('leaf', 16) + ' Nutrition Highlights</h2><p class="small text-muted mb-0">' + esc(p.nutritionHighlights) + '</p></div>';
  html += '<div class="p-4 rounded-4 mb-3" style="background:#f0fdf4;border:1px solid #dcfce7;"><h2 class="h6">' + icon('bulb', 16) + ' Storage Tip</h2><p class="small text-muted mb-0">' + esc(p.storageHint) + '</p></div>';
  if (mkts.length) {
    html += '<div class="ff-card p-4"><h2 class="h6">' + icon('pin', 16) + ' Available At</h2>';
    mkts.forEach(function (m) {
      html += '<div class="d-flex justify-content-between align-items-center p-2 rounded-3 mb-2" style="background:#f9fafb;">';
      html += '<div><div class="small fw-medium">' + esc(m.name) + '</div><div class="small text-muted">' + esc(m.area) + ' · ' + esc(m.days.join(', ')) + '</div></div>';
      html += '<div class="d-flex align-items-center gap-2">' + statusBadge(m) + '<button class="btn-green py-1 px-2" style="font-size:12px;" data-market="' + m.id + '">View</button></div></div>';
    });
    html += '</div>';
  }
  html += '</div></div></div>';
  return html;
}

function renderAbout() {
  var html = '<div class="wrap">';
  html += breadcrumb([{ label: 'About Us' }]);
  html += '<div class="rounded-4 p-5 text-white text-center mb-4 mt-3" style="background:linear-gradient(135deg,#15803d,#14532d);">';
  html += '<div class="mx-auto mb-3 d-flex align-items-center justify-content-center rounded-4" style="width:64px;height:64px;background:rgba(255,255,255,.2);">' + icon('leaf', 32) + '</div>';
  html += '<h1 class="h2">About FreshFind</h1><p class="mb-0" style="color:#bbf7d0;max-width:36rem;margin:0 auto;">FreshFind was born from a simple belief: finding fresh, local food should be easy, enjoyable, and available to everyone.</p></div>';
  html += '<div class="row g-3 mb-4">';
  [{ v: '8+', l: 'Farmers Markets', i: 'pin' }, { v: '200+', l: 'Local Vendors', i: 'users' }, { v: '12k+', l: 'Monthly Visitors', i: 'star' }, { v: '5+', l: 'Years of Community', i: 'heart' }].forEach(function (s) {
    html += '<div class="col-6 col-lg-3"><div class="ff-card p-4 text-center"><div style="color:#16a34a;">' + icon(s.i, 22) + '</div><div class="h4 mb-0">' + s.v + '</div><div class="small text-muted">' + s.l + '</div></div></div>';
  });
  html += '</div><div class="row g-4 mb-4"><div class="col-lg-6"><div class="ff-card p-4 h-100"><h2 class="h4">Our Story</h2>';
  html += '<p class="text-muted">FreshFind started in 2020 when our founder, a former organic farmer, realised that despite there being wonderful farmers\' markets all around the city, many residents had no easy way to discover them.</p>';
  html += '<p class="text-muted">After countless conversations with market vendors and shoppers, we built FreshFind — a simple, friendly platform that helps people discover markets near them, explore seasonal produce, and plan their visits with ease.</p>';
  html += '<p class="text-muted mb-0">Today, FreshFind lists 8 local farmers\' markets and continues to grow. Our mission remains the same: connect communities with the freshest local food possible.</p></div></div>';
  html += '<div class="col-lg-6"><div class="ff-card p-4 h-100"><h2 class="h4">Our Mission</h2>';
  [{ t: 'Connect Communities', d: 'Make it easy for everyone to find and visit their nearest farmers\' market.' },
   { t: 'Support Local Farmers', d: 'Help small, local farms reach more customers and build sustainable businesses.' },
   { t: 'Promote Seasonal Eating', d: 'Educate shoppers about seasonal produce and the benefits of eating locally.' },
   { t: 'Build Food Knowledge', d: 'Help people understand where their food comes from and how to use it.' }
  ].forEach(function (m) {
    html += '<div class="d-flex gap-2 mb-3"><div class="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style="width:24px;height:24px;background:#dcfce7;color:#16a34a;">' + icon('check', 12) + '</div><div><div class="fw-semibold small">' + m.t + '</div><div class="small text-muted">' + m.d + '</div></div></div>';
  });
  html += '</div></div></div>';
  html += '<div class="p-4 rounded-4 mb-4" style="background:#f0fdf4;border:1px solid #dcfce7;"><h2 class="h4 text-center mb-4">How FreshFind Works</h2><div class="row g-3">';
  [{ n: '1', t: 'We Research Markets', d: 'Our team researches and verifies information for every farmers\' market in the directory.' },
   { n: '2', t: 'You Discover Markets', d: 'Search, filter, and explore markets by location, day, and produce type.' },
   { n: '3', t: 'Visit & Support Local', d: 'Use FreshFind to plan your visit and support your local farming community.' }
  ].forEach(function (s) {
    html += '<div class="col-sm-4 text-center"><div class="rounded-circle mx-auto mb-2 d-flex align-items-center justify-content-center text-white fw-bold" style="width:48px;height:48px;background:#16a34a;">' + s.n + '</div><h3 class="h6">' + s.t + '</h3><p class="small text-muted">' + s.d + '</p></div>';
  });
  html += '</div></div>';
  html += '<h2 class="h4 text-center mb-4">What We Stand For</h2><div class="row g-3 mb-4">';
  [{ t: 'Fresh & Local', d: 'We believe everyone deserves access to fresh, locally grown food from farmers they can trust.', bg: '#dcfce7', c: '#16a34a', i: 'leaf' },
   { t: 'Community First', d: 'Farmers\' markets are more than food — they\'re gathering places that strengthen communities.', bg: '#dbeafe', c: '#2563eb', i: 'users' },
   { t: 'Support Farmers', d: 'Every purchase at a farmers\' market supports a local family and their farming operation.', bg: '#fee2e2', c: '#dc2626', i: 'heart' },
   { t: 'Quality Information', d: 'We work hard to keep market information accurate, up-to-date and genuinely useful.', bg: '#fef3c7', c: '#d97706', i: 'star' }
  ].forEach(function (v) {
    html += '<div class="col-sm-6 col-lg-3"><div class="ff-card p-4 text-center h-100"><div class="rounded-3 mx-auto mb-2 d-flex align-items-center justify-content-center" style="width:48px;height:48px;background:' + v.bg + ';color:' + v.c + ';">' + icon(v.i, 22) + '</div><h3 class="h6">' + v.t + '</h3><p class="small text-muted">' + v.d + '</p></div></div>';
  });
  html += '</div><h2 class="h4 text-center mb-4">Meet the Team</h2><div class="row g-3">';
  [{ n: 'Sarah Green', r: 'Founder & CEO', b: 'Former organic farmer passionate about connecting communities with local food.', i: 'sprout' },
   { n: 'Marcus Chen', r: 'Head of Technology', b: 'Full-stack developer with a love for sustainable tech and local food systems.', i: 'globe' },
   { n: 'Priya Patel', r: 'Community Manager', b: 'Community organiser with 8 years of experience supporting local food networks.', i: 'users' },
   { n: 'Tom Riverside', r: 'Market Relations', b: 'Former market manager who knows every vendor by name in the city.', i: 'store' }
  ].forEach(function (t) {
    html += '<div class="col-sm-6 col-lg-3"><div class="ff-card p-4 text-center h-100"><div class="rounded-circle mx-auto mb-2 d-flex align-items-center justify-content-center" style="width:56px;height:56px;background:#dcfce7;color:#15803d;">' + icon(t.i, 24) + '</div><h3 class="h6 mb-0">' + t.n + '</h3><p class="small mb-2" style="color:#16a34a;">' + t.r + '</p><p class="small text-muted mb-0">' + t.b + '</p></div></div>';
  });
  html += '</div></div>';
  return html;
}

function renderContact() {
  var html = '<div class="wrap">';
  html += breadcrumb([{ label: 'Contact Us' }]);
  html += '<h1 class="h3 mt-3">Contact Us</h1><p class="text-muted">We\'d love to hear from you. Reach out anytime.</p>';
  html += '<div class="row g-4"><div class="col-lg-4">';
  [{ i: 'mail', t: 'Email', c: 'hello@freshfind.com', href: 'mailto:hello@freshfind.com', bg: '#eff6ff', col: '#2563eb' },
   { i: 'phone', t: 'Phone', c: '+1 555-FRESH-1', href: 'tel:+15553737341', bg: '#f0fdf4', col: '#16a34a' },
   { i: 'pin', t: 'Address', c: '10 Market Square, Greenfield', href: '', bg: '#faf5ff', col: '#7e22ce' },
   { i: 'clock', t: 'Contact Hours', c: 'Monday – Friday\n9:00 AM – 5:00 PM', href: '', bg: '#fffbeb', col: '#d97706' }
  ].forEach(function (x) {
    html += '<div class="ff-card p-3 mb-3 d-flex gap-3"><div class="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0" style="width:40px;height:40px;background:' + x.bg + ';color:' + x.col + ';">' + icon(x.i, 18) + '</div><div><div class="fw-semibold small">' + x.t + '</div>';
    html += x.href ? '<a class="small" href="' + x.href + '">' + esc(x.c) + '</a>' : '<div class="small text-muted" style="white-space:pre-line;">' + esc(x.c) + '</div>';
    html += '</div></div>';
  });
  html += '<div class="ff-card p-3"><h3 class="h6">Follow Us</h3>' + socialRow('light') + '</div>';
  html += '<div class="ff-card p-3 mt-3" id="geoBox"><h3 class="h6">Your location</h3><p class="small text-muted mb-2" id="geoText">Click below to share your location (used only in this browser).</p><button class="btn-outline-green" id="geoBtn">' + icon('nav', 16) + ' Use my location</button></div>';
  html += '</div><div class="col-lg-8"><div class="ff-card p-4 mb-3"><h2 class="h5">' + icon('mail', 18) + ' Send Us a Message</h2>';
  html += '<form id="contactForm" class="mt-3"><div class="row g-3"><div class="col-sm-6"><label class="form-label small">Name *</label><input class="form-control" name="name" required placeholder="Your name"></div>';
  html += '<div class="col-sm-6"><label class="form-label small">Email *</label><input class="form-control" type="email" name="email" required placeholder="your@email.com"></div>';
  html += '<div class="col-12"><label class="form-label small">Subject</label><input class="form-control" name="subject" placeholder="What\'s this about?"></div>';
  html += '<div class="col-12"><label class="form-label small">Message *</label><textarea class="form-control" name="message" rows="5" required placeholder="Tell us how we can help..."></textarea></div>';
  html += '<div class="col-12"><button class="btn-green w-100" type="submit">' + icon('send', 18) + ' Send Message</button></div></div></form></div>';
  html += '<div class="ff-card p-4"><h2 class="h5">' + icon('pin', 18) + ' Find Us</h2>' + miniMap('FreshFind HQ', '10 Market Square, Greenfield', 40.7128, -74.006) + '</div>';
  html += '</div></div></div>';
  return html;
}

function renderBookmarks() {
  var html = '<div class="wrap" style="max-width:56rem;">';
  html += breadcrumb([{ label: 'Saved Items' }]);
  html += '<div class="d-flex justify-content-between align-items-center mt-3 mb-4"><div><h1 class="h3 mb-0">Saved Items</h1><p class="text-muted mb-0">' + state.bookmarks.length + ' item' + (state.bookmarks.length !== 1 ? 's' : '') + ' saved</p></div>';
  if (state.bookmarks.length) html += '<button class="btn-green" id="exportBm">' + icon('download', 16) + ' Export Bookmarks</button>';
  html += '</div>';
  if (!state.bookmarks.length) {
    html += '<div class="ff-card p-5 text-center"><div class="mx-auto mb-3 d-flex align-items-center justify-content-center rounded-4" style="width:64px;height:64px;background:#fef2f2;color:#fca5a5;">' + icon('heart', 28) + '</div>';
    html += '<h2 class="h5">No saved items yet</h2><p class="text-muted small">Start exploring farmers\' markets and produce items and save your favourites here for quick access.</p>';
    html += '<button class="btn-green me-2" data-go="directory">' + icon('store', 16) + ' Browse Markets</button>';
    html += '<button class="btn-outline-green" data-go="produce">' + icon('carrot', 16) + ' Explore Produce</button></div>';
  } else {
    var mk = state.bookmarks.filter(function (b) { return b.type === 'market'; });
    var pr = state.bookmarks.filter(function (b) { return b.type === 'produce'; });
    if (mk.length) {
      html += '<h2 class="h5 mb-3">' + icon('pin', 18) + ' Saved Markets (' + mk.length + ')</h2>';
      mk.forEach(function (b) {
        var m = marketsData.find(function (x) { return 'market-' + x.id === b.id; });
        html += '<div class="ff-card p-3 mb-3 d-flex gap-3">';
        if (m) html += '<img src="' + imgPath(m.image) + '" alt="" style="width:80px;height:80px;object-fit:cover;border-radius:12px;">';
        html += '<div class="flex-grow-1"><div class="d-flex justify-content-between"><h3 class="h6 mb-1">' + esc(b.name) + '</h3><div>';
        if (m) html += '<button class="btn-green py-1 px-2 me-1" style="font-size:12px;" data-market="' + m.id + '">View</button>';
        html += '<button class="icon-btn" data-remove="' + esc(b.id) + '" aria-label="Remove">' + icon('trash', 16) + '</button></div></div>';
        if (b.location) html += '<p class="small text-muted mb-1">' + icon('pin', 12) + ' ' + esc(b.location) + '</p>';
        html += noteEditor(b) + '</div></div>';
      });
    }
    if (pr.length) {
      html += '<h2 class="h5 mb-3 mt-4">' + icon('tag', 18) + ' Saved Produce (' + pr.length + ')</h2>';
      pr.forEach(function (b) {
        var p = produceData.find(function (x) { return 'produce-' + x.id === b.id; });
        html += '<div class="ff-card p-3 mb-3 d-flex gap-3">';
        html += '<div class="p-thumb" style="width:80px;height:80px;border-radius:12px;font-size:2rem;">' + (p ? p.emoji : '🌿') + '</div>';
        html += '<div class="flex-grow-1"><div class="d-flex justify-content-between"><h3 class="h6 mb-1">' + esc(b.name) + '</h3><div>';
        if (p) html += '<button class="btn-green py-1 px-2 me-1" style="font-size:12px;" data-produce="' + p.id + '">View</button>';
        html += '<button class="icon-btn" data-remove="' + esc(b.id) + '" aria-label="Remove">' + icon('trash', 16) + '</button></div></div>';
        if (b.category) html += '<p class="small text-muted">' + esc(b.category) + '</p>';
        html += noteEditor(b) + '</div></div>';
      });
    }
    html += '<div class="p-3 rounded-4 small mt-3" style="background:#fffbeb;border:1px solid #fde68a;color:#b45309;">Notes are stored in your browser only and are not saved to any server. Export your bookmarks to keep a permanent copy.</div>';
  }
  html += '</div>';
  return html;
}

function noteEditor(b) {
  return '<div class="d-flex align-items-center gap-2 mt-1"><p class="small text-muted fst-italic mb-0 flex-grow-1 note-text">' + esc(b.note || 'Add a personal note...') + '</p>' +
    '<button class="icon-btn p-1" data-editnote="' + esc(b.id) + '">' + icon('edit', 14) + '</button></div>';
}

function socialRow(tone) {
  var cls = tone === 'dark' ? 'social-dark' : 'social-light';
  var names = [['fb', 'Facebook'], ['ig', 'Instagram'], ['xtw', 'X'], ['yt', 'YouTube']];
  return names.map(function (n) {
    return '<a href="#" class="social-btn ' + cls + '" aria-label="' + n[1] + '" onclick="return false;">' + icon(n[0], 16) + '</a>';
  }).join('');
}

/* ---- nav + main render ---- */
var NAV = [
  { label: 'Home', page: 'home', icon: 'home' },
  { label: 'Find a Market', page: 'directory', icon: 'pin', match: ['directory', 'market-detail'] },
  { label: 'Produce Guide', page: 'produce', icon: 'carrot', match: ['produce', 'produce-detail'] },
  { label: 'About Us', page: 'about', icon: 'info' },
  { label: 'Contact Us', page: 'contact', icon: 'phone' }
];

function navActive(link) {
  return (link.match || [link.page]).indexOf(state.page) !== -1;
}

function renderNav() {
  var desk = document.getElementById('desktopNav');
  desk.innerHTML = NAV.map(function (l) {
    return '<button class="ff-nav' + (navActive(l) ? ' active' : '') + '" data-go="' + l.page + '"' + (navActive(l) ? ' aria-current="page"' : '') + '>' + icon(l.icon, 16) + '<span>' + l.label + '</span></button>';
  }).join('');

  var mob = NAV.concat([{ label: 'Saved Items', page: 'bookmarks', icon: 'heart' }]);
  document.getElementById('mobileNav').innerHTML = mob.map(function (l) {
    var badge = l.page === 'bookmarks' && state.bookmarks.length ? '<span class="count-badge position-static d-inline-flex">' + state.bookmarks.length + '</span>' : '';
    return '<button class="mobile-link' + (navActive(l) || (l.page === 'bookmarks' && state.page === 'bookmarks') ? ' active' : '') + '" data-go="' + l.page + '"><span class="mob-ico">' + icon(l.icon, 16) + '</span><span class="flex-grow-1">' + l.label + '</span>' + badge + icon('chevron', 16) + '</button>';
  }).join('') + '<div class="d-flex gap-2 px-2 pt-2 d-lg-none"><button class="btn-login" data-modal="login">Login</button><button class="btn-signup" data-modal="signup">Sign up</button></div>';
}

function render() {
  var page = document.getElementById('page');
  var html = '';
  if (state.page === 'home') html = renderHome();
  else if (state.page === 'directory') html = renderDirectory();
  else if (state.page === 'market-detail') html = renderMarket();
  else if (state.page === 'produce') html = renderProduce();
  else if (state.page === 'produce-detail') html = renderProduceDetail();
  else if (state.page === 'about') html = renderAbout();
  else if (state.page === 'contact') html = renderContact();
  else if (state.page === 'bookmarks') html = renderBookmarks();
  else html = renderHome();
  page.innerHTML = html;
  renderNav();
  updateSavedCount();
  bindPage();
}

function bindPage() {
  var root = document.getElementById('page');
  root.querySelectorAll('[data-go]').forEach(function (el) {
    el.addEventListener('click', function () {
      if (el.getAttribute('data-go') === 'chat') { openChat(true); return; }
      go(el.getAttribute('data-go'));
    });
  });
  root.querySelectorAll('[data-market]').forEach(function (el) {
    el.addEventListener('click', function () { go('market-detail', { marketId: Number(el.getAttribute('data-market')) }); });
  });
  root.querySelectorAll('[data-produce]').forEach(function (el) {
    el.addEventListener('click', function () { go('produce-detail', { produceId: el.getAttribute('data-produce') }); });
  });
  root.querySelectorAll('[data-bm]').forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.stopPropagation();
      try { toggleBookmark(JSON.parse(el.getAttribute('data-bm'))); } catch (err) {}
      render();
    });
  });
  root.querySelectorAll('[data-gallery]').forEach(function (el) {
    el.addEventListener('click', function () {
      document.getElementById('lightboxImg').src = el.getAttribute('data-gallery');
      document.getElementById('lightbox').hidden = false;
    });
  });

  var hs = document.getElementById('heroSearch');
  if (hs) hs.addEventListener('submit', function (e) {
    e.preventDefault();
    go('directory', { search: document.getElementById('heroQ').value });
  });

  var ds = document.getElementById('dirSearch');
  if (ds) ds.addEventListener('input', function () {
    state.dir.search = ds.value;
    render();
    var n = document.getElementById('dirSearch');
    n.focus();
    n.setSelectionRange(n.value.length, n.value.length);
  });
  var tf = document.getElementById('toggleFilters');
  if (tf) tf.addEventListener('click', function () { state.dir.showFilters = !state.dir.showFilters; render(); });
  var nm = document.getElementById('nearMe');
  if (nm) nm.addEventListener('click', findNearMe);
  ['fArea', 'fDay', 'fProduce', 'fSort'].forEach(function (id) {
    var el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('change', function () {
      if (id === 'fArea') state.dir.area = el.value;
      if (id === 'fDay') state.dir.day = el.value;
      if (id === 'fProduce') state.dir.produce = el.value;
      if (id === 'fSort') state.dir.sort = el.value;
      render();
    });
  });
  var cf = document.getElementById('clearFilters');
  if (cf) cf.addEventListener('click', function () { state.dir = { search: '', area: '', day: '', produce: '', sort: 'alpha', view: 'list', showFilters: true }; render(); });
  var vl = document.getElementById('viewList');
  if (vl) vl.addEventListener('click', function () { state.dir.view = 'list'; render(); });
  var vm = document.getElementById('viewMap');
  if (vm) vm.addEventListener('click', function () { state.dir.view = 'map'; render(); });

  var ps = document.getElementById('prodSearch');
  if (ps) ps.addEventListener('input', function () { state.prodFilter.search = ps.value; render(); var n = document.getElementById('prodSearch'); n.focus(); n.setSelectionRange(n.value.length, n.value.length); });
  root.querySelectorAll('[data-cat]').forEach(function (el) {
    el.addEventListener('click', function () { state.prodFilter.category = el.getAttribute('data-cat'); render(); });
  });
  root.querySelectorAll('[data-season]').forEach(function (el) {
    el.addEventListener('click', function () { state.prodFilter.season = el.getAttribute('data-season'); render(); });
  });
  var cp = document.getElementById('clearProd');
  if (cp) cp.addEventListener('click', function () { state.prodFilter = { search: '', category: 'All', season: 'All' }; render(); });

  var cl = document.getElementById('copyLink');
  if (cl) cl.addEventListener('click', function () {
    var txt = location.href;
    if (navigator.clipboard) navigator.clipboard.writeText(txt);
    cl.textContent = 'Copied!';
    showToast('Link copied');
  });

  var cfm = document.getElementById('contactForm');
  if (cfm) cfm.addEventListener('submit', function (e) {
    e.preventDefault();
    showToast("Message sent! We'll get back to you soon.");
    cfm.reset();
  });
  var gb = document.getElementById('geoBtn');
  if (gb) gb.addEventListener('click', function () {
    if (!navigator.geolocation) { document.getElementById('geoText').textContent = 'Geolocation is not supported.'; return; }
    navigator.geolocation.getCurrentPosition(function (pos) {
      document.getElementById('geoText').textContent = 'Approx. location: ' + pos.coords.latitude.toFixed(4) + ', ' + pos.coords.longitude.toFixed(4);
      showToast('Location found', 'info');
    }, function () {
      document.getElementById('geoText').textContent = 'Location access is unavailable. You can still find us on the map.';
    });
  });

  var exp = document.getElementById('exportBm');
  if (exp) exp.addEventListener('click', exportBookmarks);
  root.querySelectorAll('[data-remove]').forEach(function (el) {
    el.addEventListener('click', function () {
      var id = el.getAttribute('data-remove');
      var b = state.bookmarks.find(function (x) { return x.id === id; });
      state.bookmarks = state.bookmarks.filter(function (x) { return x.id !== id; });
      persistBookmarks();
      showToast((b ? b.name : 'Item') + ' removed from saved items.');
      render();
    });
  });
  root.querySelectorAll('[data-editnote]').forEach(function (el) {
    el.addEventListener('click', function () {
      var id = el.getAttribute('data-editnote');
      var b = state.bookmarks.find(function (x) { return x.id === id; });
      var wrap = el.parentNode;
      wrap.innerHTML = '<input class="form-control form-control-sm" value="' + esc(b.note || '') + '"><button class="icon-btn p-1 save-n">' + icon('save', 14) + '</button>';
      wrap.querySelector('.save-n').addEventListener('click', function () {
        b.note = wrap.querySelector('input').value;
        persistBookmarks();
        showToast('Note saved for this session. 📝');
        render();
      });
    });
  });

  bindMapView();
}

function findNearMe() {
  state.geo.loading = true;
  render();
  requestBrowserLocation(function (pos) {
    state.geo = { lat: pos.coords.latitude, lng: pos.coords.longitude, error: null, loading: false, granted: true };
    state.dir.sort = 'proximity';
    render();
  }, function (err) {
    state.geo = { lat: null, lng: null, error: geoErrorMessage(err), loading: false, granted: false };
    render();
  });
}

/* ---- browser geolocation, done properly ----------------------------------
   The browser's `timeout` countdown starts when getCurrentPosition() is
   CALLED — before the user has even seen the permission prompt. A single
   short attempt therefore "times out" whenever the user needs a moment to
   click Allow or the desktop OS location service is slow to warm up.

   Strategy (always the REAL browser geolocation, never invented coords):
     attempt 1 — normal (low-power) accuracy, sensible 10 s budget,
                 accepts a ≤5 min cached fix;
     attempt 2 — ONLY if attempt 1 TIMED OUT (code 3): by then the prompt is
                 settled and the service warm, so a lenient retry (20 s,
                 ≤10 min cache) almost always succeeds;
     denied (1) / unavailable (2) are reported immediately and never retried.
--------------------------------------------------------------------------- */
function requestBrowserLocation(onPos, onErr) {
  if (!navigator.geolocation) { onErr({ code: 2 }); return; }
  navigator.geolocation.getCurrentPosition(onPos, function (err1) {
    if (err1 && err1.code === 3) {
      navigator.geolocation.getCurrentPosition(onPos, onErr,
        { enableHighAccuracy: false, timeout: 20000, maximumAge: 600000 });
      return;
    }
    onErr(err1);
  }, { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 });
}

function geoErrorMessage(err) {
  if (err && err.code === 1) return 'Location permission denied';
  if (err && err.code === 3) return 'Location timed out';
  return 'Location unavailable on this device';
}

function exportBookmarks() {
  if (!state.bookmarks.length) { showToast('No bookmarks to export.', 'info'); return; }
  var lines = ['FreshFind Saved Items', 'Exported: ' + new Date().toLocaleString(), ''];
  state.bookmarks.forEach(function (b) {
    lines.push('━━━━━━━━━━━━━━━━━━━━');
    lines.push('Name: ' + b.name);
    lines.push('Type: ' + (b.type === 'market' ? 'Farmers Market' : 'Produce Item'));
    if (b.location) lines.push('Location: ' + b.location);
    if (b.category) lines.push('Category: ' + b.category);
    lines.push('Note: ' + (b.note || '(No note)'));
    lines.push('Saved: ' + new Date(b.savedAt).toLocaleString());
    lines.push('');
  });
  var blob = new Blob([lines.join('\n')], { type: 'text/plain' });
  var a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'freshfind-bookmarks-' + Date.now() + '.txt';
  a.click();
  showToast('Bookmarks exported successfully! 📥');
}

/* ---- chatbot UI (same engine as chatbot.js) ---- */
var chat = {
  open: false,
  typing: false,
  msgs: [],
  ctx: emptyContext(),
  hint: false
};

try {
  var storedChat = JSON.parse(localStorage.getItem('freshfind_chat') || '[]');
  if (Array.isArray(storedChat) && storedChat.length) {
    chat.msgs = storedChat.map(function (m) { m.timestamp = new Date(m.timestamp); return m; });
  }
} catch (e) {}

function saveChat() {
  try { localStorage.setItem('freshfind_chat', JSON.stringify(chat.msgs.slice(-60))); } catch (e) {}
}

function uid() { return Date.now() + '-' + Math.random().toString(36).slice(2, 8); }

function timeLabel(d) {
  return new Date(d).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function openChat(on) {
  chat.open = on;
  document.getElementById('chatPanel').classList.toggle('open', on);
  document.getElementById('chatFab').innerHTML = icon(on ? 'x' : 'chat', 20);
  document.getElementById('chatFab').setAttribute('aria-label', on ? 'Close chat assistant' : 'Open chat assistant');
  document.getElementById('chatHint').classList.remove('show');
  try { localStorage.setItem('freshfind_chat_hint', 'seen'); } catch (e) {}
  if (on && chat.msgs.length === 0) {
    var w = welcomeMessage();
    chat.msgs.push({ id: 'welcome', sender: 'bot', text: w.text, suggestions: w.suggestions, timestamp: new Date() });
    saveChat();
  }
  drawChat();
  if (on) setTimeout(function () { document.getElementById('chatInput').focus(); }, 200);
}

function drawChat() {
  var box = document.getElementById('chatMsgs');
  var last = chat.msgs.length - 1;
  var html = '';
  chat.msgs.forEach(function (msg, i) {
    html += '<div class="d-flex gap-1 mb-2 ' + (msg.sender === 'user' ? 'justify-content-end' : '') + '">';
    if (msg.sender === 'bot') {
      html += '<div class="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 mt-1" style="width:20px;height:20px;background:#16a34a;color:#fff;">' + icon('leaf', 10) + '</div>';
    }
    html += '<div style="max-width:86%;"><div class="bubble ' + msg.sender + '">' + esc(msg.text) + '</div>';
    if (msg.cards && msg.cards.length) {
      html += '<div class="mt-1 d-flex flex-column gap-1">';
      msg.cards.forEach(function (c) {
        var badgeCls = c.badge && c.badge.indexOf('Open') !== -1 ? 'status-open' : 'status-soon';
        html += '<button class="chat-card" data-card-type="' + c.type + '" data-card-id="' + esc(c.id) + '">';
        html += '<img src="' + imgPath(c.image) + '" alt="" style="width:36px;height:36px;object-fit:cover;border-radius:8px;background:#f3f4f6;">';
        html += '<div class="flex-grow-1 overflow-hidden"><div class="d-flex align-items-center gap-1"><span class="fw-semibold text-truncate" style="font-size:11px;">' + esc(c.title) + '</span>';
        if (c.badge) html += '<span class="chip ' + badgeCls + '" style="font-size:9px;">' + esc(c.badge) + '</span>';
        html += '</div><div class="text-muted text-truncate" style="font-size:10px;">' + esc(c.subtitle) + '</div>';
        html += '<div class="text-truncate" style="font-size:9.5px;color:#15803d;">' + esc(c.meta) + '</div></div></button>';
      });
      html += '</div>';
    }
    if (msg.links && msg.links.length) {
      html += '<div class="mt-1 d-flex flex-wrap gap-1">';
      msg.links.forEach(function (l) {
        html += '<button class="page-link-chip" data-go="' + esc(l.page) + '">' + esc(l.label) + ' →</button>';
      });
      html += '</div>';
    }
    if (msg.sender === 'bot' && msg.suggestions && msg.suggestions.length && i === last) {
      html += '<div class="mt-1 d-flex flex-wrap gap-1">';
      msg.suggestions.forEach(function (s) {
        html += '<button class="sug" data-sug="' + esc(s) + '">' + esc(s) + '</button>';
      });
      html += '</div>';
    }
    html += '<div class="text-muted" style="font-size:9px;' + (msg.sender === 'user' ? 'text-align:right;' : '') + '">' + timeLabel(msg.timestamp) + '</div></div></div>';
  });
  if (chat.typing) {
    html += '<div class="d-flex gap-1"><div class="rounded-circle d-flex align-items-center justify-content-center" style="width:20px;height:20px;background:#16a34a;color:#fff;">' + icon('leaf', 10) + '</div>';
    html += '<div class="bubble bot"><span class="dots"><span></span> <span></span> <span></span></span></div></div>';
    document.getElementById('chatStatus').textContent = 'typing…';
  } else {
    document.getElementById('chatStatus').textContent = 'Online · knows all 8 markets';
  }
  box.innerHTML = html;
  box.scrollTop = box.scrollHeight;

  box.querySelectorAll('[data-sug]').forEach(function (el) {
    el.addEventListener('click', function () { sendChat(el.getAttribute('data-sug')); });
  });
  box.querySelectorAll('[data-go]').forEach(function (el) {
    el.addEventListener('click', function () {
      var p = el.getAttribute('data-go');
      if (p !== 'home') go(p);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      openChat(false);
    });
  });
  box.querySelectorAll('[data-card-type]').forEach(function (el) {
    el.addEventListener('click', function () {
      var type = el.getAttribute('data-card-type');
      var id = el.getAttribute('data-card-id');
      if (type === 'market') go('market-detail', { marketId: Number(id) });
      else go('produce-detail', { produceId: id });
      openChat(false);
    });
  });
}

function sendChat(raw) {
  var text = (raw || '').trim();
  if (!text || chat.typing) return;
  chat.msgs.push({ id: uid(), sender: 'user', text: text, timestamp: new Date() });
  document.getElementById('chatInput').value = '';
  document.getElementById('chatInput').style.height = 'auto';
  document.getElementById('chatSend').disabled = true;
  chat.typing = true;
  saveChat();
  drawChat();
  var think = 450 + Math.min(text.length * 12, 700);
  setTimeout(function () {
    var out = getReply(text, chat.ctx);
    // intent handlers may answer asynchronously (e.g. while waiting for the
    // browser geolocation permission), so accept a promise here too
    var apply = function (o) {
      chat.ctx = o.ctx;
      chat.msgs.push({
        id: uid(), sender: 'bot', text: o.reply.text,
        cards: o.reply.cards, suggestions: o.reply.suggestions, links: o.reply.links,
        timestamp: new Date()
      });
      chat.typing = false;
      saveChat();
      drawChat();
    };
    if (out && typeof out.then === 'function') out.then(apply);
    else apply(out);
  }, think);
}

function clearChat() {
  chat.msgs = [];
  chat.ctx = emptyContext();
  var w = welcomeMessage();
  chat.msgs.push({ id: 'welcome', sender: 'bot', text: w.text, suggestions: w.suggestions, timestamp: new Date() });
  saveChat();
  drawChat();
}

/* ---- header / global events ---- */
function bindGlobal() {
  document.getElementById('logoBtn').addEventListener('click', function () { go('home'); });
  document.getElementById('savedBtn').addEventListener('click', function () { go('bookmarks'); });
  document.getElementById('menuToggle').addEventListener('click', function () {
    var m = document.getElementById('mobileMenu');
    m.classList.toggle('open');
    this.innerHTML = icon(m.classList.contains('open') ? 'x' : 'menu', 20);
  });
  document.getElementById('searchToggle').addEventListener('click', function () {
    document.getElementById('headerSearch').classList.toggle('open');
  });
  document.getElementById('headerSearchForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var q = document.getElementById('headerSearchInput').value;
    if (q.trim()) {
      document.getElementById('headerSearch').classList.remove('open');
      go('directory', { search: q });
    }
  });
  document.querySelectorAll('[data-page]').forEach(function (el) {
    el.addEventListener('click', function () { go(el.getAttribute('data-page')); });
  });
  document.querySelectorAll('[data-soon]').forEach(function (el) {
    el.addEventListener('click', function () { showToast(el.getAttribute('data-soon') + ' coming soon!', 'info'); });
  });
  document.getElementById('openChatFromFooter').addEventListener('click', function () { openChat(true); });
  document.getElementById('chatFab').addEventListener('click', function () { openChat(!chat.open); });
  document.getElementById('closeChat').addEventListener('click', function () { openChat(false); });
  document.getElementById('clearChat').addEventListener('click', clearChat);
  document.getElementById('chatHint').addEventListener('click', function () { openChat(true); });
  document.getElementById('chatForm').addEventListener('submit', function (e) {
    e.preventDefault();
    sendChat(document.getElementById('chatInput').value);
  });
  document.getElementById('chatInput').addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendChat(this.value); }
  });
  document.getElementById('chatInput').addEventListener('input', function () {
    this.style.height = 'auto';
    this.style.height = Math.min(this.scrollHeight, 76) + 'px';
    document.getElementById('chatSend').disabled = !this.value.trim() || chat.typing;
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && chat.open) openChat(false);
  });
  document.getElementById('lightbox').addEventListener('click', function () { this.hidden = true; });
  document.getElementById('lightboxClose').addEventListener('click', function () {
    document.getElementById('lightbox').hidden = true;
  });

  document.querySelectorAll('[data-modal]').forEach(function (el) {
    el.addEventListener('click', function () {
      document.getElementById(el.getAttribute('data-modal') + 'Modal').classList.add('open');
    });
  });
  document.querySelectorAll('[data-close-modal]').forEach(function (el) {
    el.addEventListener('click', function () { el.closest('.modal-back').classList.remove('open'); });
  });
  document.querySelectorAll('.modal-back').forEach(function (el) {
    el.addEventListener('click', function (e) { if (e.target === el) el.classList.remove('open'); });
  });
  document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();
    document.getElementById('loginModal').classList.remove('open');
    showToast('Logged in (demo only)', 'info');
  });
  document.getElementById('signupForm').addEventListener('submit', function (e) {
    e.preventDefault();
    document.getElementById('signupModal').classList.remove('open');
    showToast('Account created (demo only)', 'info');
  });

  window.addEventListener('scroll', function () {
    document.getElementById('header').classList.toggle('scrolled', window.scrollY > 20);
  });

  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-go]');
    if (t && !document.getElementById('page').contains(t) && t.getAttribute('data-go')) {
      var p = t.getAttribute('data-go');
      if (p === 'chat') openChat(true);
      else go(p);
    }
    var m = e.target.closest('[data-modal]');
    if (m) {
      var box = document.getElementById(m.getAttribute('data-modal') + 'Modal');
      if (box) box.classList.add('open');
    }
  });
}

function tickClock() {
  state.now = new Date();
  var a = document.getElementById('liveClock');
  var b = document.getElementById('liveClock2');
  if (a) a.textContent = formatClockTime(state.now);
  if (b) b.textContent = formatClockTime(state.now);
}

document.getElementById('footerSocial').innerHTML = socialRow('dark');
document.getElementById('footVisitors').textContent = state.visitorCount.toLocaleString();
fillIcons(document);
document.getElementById('chatFab').innerHTML = icon('chat', 20);
document.getElementById('chatSend').innerHTML = icon('send', 14);
document.getElementById('clearChat').innerHTML = icon('trash', 14);
document.getElementById('closeChat').innerHTML = icon('x', 16);
document.getElementById('jumpLatest').innerHTML = icon('arrow-down', 12);
document.querySelectorAll('[data-icon]').forEach(function (el) {
  if (!el.innerHTML.trim()) el.innerHTML = icon(el.getAttribute('data-icon'), el.getAttribute('data-size') || 18);
});

bindGlobal();
render();
setInterval(tickClock, 1000);

// little hint bubble after a few seconds
setTimeout(function () {
  try {
    if (localStorage.getItem('freshfind_chat_hint') === 'seen') return;
  } catch (e) {}
  if (!chat.open) document.getElementById('chatHint').classList.add('show');
}, 3500);
