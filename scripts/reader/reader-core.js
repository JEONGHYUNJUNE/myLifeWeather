/* Pure timeline helpers, shared by the inline reader and tests. */
(function (root) {
  const parseTime = value => {
    const s = String(value).trim();
    if (/^\d+$/.test(s)) return Number(s);
    if (!/^\d{1,3}:[0-5]\d(?::[0-5]\d)?$/.test(s)) return null;
    return s.split(':').reduce((n, part) => n * 60 + Number(part), 0);
  };
  const formatTime = value => {
    const n = Math.max(0, Math.floor(Number(value) || 0));
    return `${String(Math.floor(n / 60)).padStart(2, '0')}:${String(n % 60).padStart(2, '0')}`;
  };
  const cueIndex = (cues, time) => {
    let low = 0, high = cues.length - 1, found = -1;
    while (low <= high) {
      const mid = (low + high) >> 1;
      if (cues[mid].time <= time) { found = mid; low = mid + 1; }
      else high = mid - 1;
    }
    return found;
  };
  const advance = (anchor, elapsedMs, rate) => Math.max(0, anchor + elapsedMs / 1000 * rate);
  const cleanProgress = value => {
    if (!value || typeof value !== 'object') return null;
    if (!Number.isFinite(value.position) || value.position < 0 || value.position > 86400) return null;
    return {
      position: value.position,
      mode: ['manual', 'youtube', 'spotify'].includes(value.mode) ? value.mode : 'manual',
      offset: Number.isFinite(value.offset) ? Math.max(-600, Math.min(600, value.offset)) : 0,
      rate: [0.5,0.75,1,1.25,1.5,1.75,2].includes(value.rate) ? value.rate : 1,
      bookmarks: Array.isArray(value.bookmarks) ? [...new Set(value.bookmarks.filter(n => Number.isFinite(n) && n >= 0 && n <= 86400).map(Math.floor))].sort((a,b) => a-b).slice(0,100) : []
    };
  };
  root.TabloReaderCore = { parseTime, formatTime, cueIndex, advance, cleanProgress };
})(typeof window !== 'undefined' ? window : globalThis);
