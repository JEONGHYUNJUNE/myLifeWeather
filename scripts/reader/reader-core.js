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
  root.TabloReaderCore = { parseTime, formatTime, cueIndex, advance };
})(typeof window !== 'undefined' ? window : globalThis);
