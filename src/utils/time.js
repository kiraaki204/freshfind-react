export const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function toMinutes(t) {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

export function formatTime(t) {
  const [h, m] = t.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hh = h % 12 || 12;
  return `${hh}:${String(m).padStart(2, '0')} ${ampm}`;
}

export function formatClockTime(d) {
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
}

export function todayName(now = new Date()) {
  return DAY_NAMES[now.getDay()];
}

export function getCurrentSeason(now = new Date()) {
  const m = now.getMonth();
  if (m >= 2 && m <= 4) return 'Spring';
  if (m >= 5 && m <= 7) return 'Summer';
  if (m >= 8 && m <= 10) return 'Autumn';
  return 'Winter';
}


export function getNextOpenDay(market, now = new Date()) {
  for (let i = 1; i <= 7; i += 1) {
    const day = DAY_NAMES[(now.getDay() + i) % 7];
    if (market.days.includes(day)) return { day, inDays: i };
  }
  return null;
}





export function getMarketStatus(market, now = new Date()) {
  const mins = now.getHours() * 60 + now.getMinutes();

  if (market.days.includes(todayName(now))) {
    if (mins >= toMinutes(market.openingTime) && mins < toMinutes(market.closingTime)) {
      return { status: 'open', label: 'Open Now' };
    }
    if (mins < toMinutes(market.openingTime)) {
      return { status: 'opens-today', label: `Opens Today at ${formatTime(market.openingTime)}` };
    }
  }

  const next = getNextOpenDay(market, now);
  return next
    ? { status: 'closed', label: `Next: ${next.day}`, nextDay: next.day }
    : { status: 'closed', label: 'Closed' };
}
