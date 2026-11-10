import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const sandbox: Record<string, any> = {};
runInNewContext(readFileSync('scripts/reader/reader-core.js', 'utf8'), sandbox);
const { parseTime, formatTime, cueIndex, advance } = sandbox.TabloReaderCore;

describe('timed transcript clock', () => {
  it('accepts seconds and valid colon timestamps without silently accepting malformed times', () => {
    expect(parseTime('07:25')).toBe(445);
    expect(parseTime('1:02:03')).toBe(3723);
    expect(parseTime('445')).toBe(445);
    for (const value of ['7:99', '-5', '1.5', '', 'seven', '01:60:00']) expect(parseTime(value)).toBeNull();
  });
  it('tracks cue boundaries, reverse seeks, offsets and duplicate starts', () => {
    const cues = [{time: 0}, {time: 9}, {time: 13}, {time: 13}, {time: 20}];
    expect(cueIndex(cues, 8.99)).toBe(0);
    expect(cueIndex(cues, 9)).toBe(1);
    expect(cueIndex(cues, 13)).toBe(3);
    expect(cueIndex(cues, 1000)).toBe(4);
    expect(cueIndex(cues, 9 - 5)).toBe(0);
    expect(cueIndex(cues, -1)).toBe(-1);
    expect(cueIndex([], 5)).toBe(-1);
  });
  it('uses elapsed time instead of counting delayed timer callbacks and preserves position on rate changes', () => {
    const atPause = advance(60, 4000, 1.5);
    expect(atPause).toBe(66);
    expect(advance(atPause, 0, 2)).toBe(66);
    expect(advance(atPause, 5000, 2)).toBe(76);
    expect(advance(0, 90000, 0.5)).toBe(45);
    expect(formatTime(3723.7)).toBe('62:03');
  });
});
