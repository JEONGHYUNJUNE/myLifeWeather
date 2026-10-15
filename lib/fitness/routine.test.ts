import { describe, expect, it } from "vitest";
import { programs, legacyPrograms } from "../../data/fitness";
import { emptyStore, isComplete, overallSummary, parseStore, setCount, updateRecord, visibleWorkouts, weeks, weekSummary } from "./model";

describe("revised Hyunjun routine", () => {
  it("completes required exercises without the optional machine and preserves timed checks", () => {
    const week = weeks[2];
    const workout = programs.hyunjun[1];
    const sets = Object.fromEntries(workout.exercises.filter(ex => !ex.optional).map(ex => [ex.id, Array(setCount(ex, week)).fill(true)]));
    let store = updateRecord(emptyStore(), "hyunjun", week, workout.id, { date: "2026-10-15", sets });
    expect(isComplete(workout, store.records.hyunjun[week.id][workout.id], week)).toBe(true);
    expect(isComplete(workout, parseStore(JSON.stringify(store)).records.hyunjun[week.id][workout.id], week)).toBe(true);
    store = updateRecord(store, "hyunjun", week, workout.id, { sets: { ...sets, walk: [false] } });
    expect(isComplete(workout, store.records.hyunjun[week.id][workout.id], week)).toBe(false);
    expect(setCount(workout.exercises[0], weeks[0])).toBe(1);
    expect(setCount(workout.exercises[1], weeks[0])).toBe(3);
  });
  it("retains old detailed records, counts mixed transition sessions and keeps people separate", () => {
    const week = weeks[2];
    const old = legacyPrograms.hyunjun[0];
    let store = updateRecord(emptyStore(), "hyunjun", week, old.id, {
      date: "2026-10-12", sets: Object.fromEntries(old.exercises.map(ex => [ex.id, Array(ex.sets).fill(true)])),
    });
    store = updateRecord(store, "hyunjun", week, "b-v2", { date: "2026-10-15", completionMode: "simple", completed: true });
    const restored = parseStore(JSON.stringify(store));
    expect(restored.records.hyunjun[week.id].a).toEqual(store.records.hyunjun[week.id].a);
    expect(restored.records.hyunjun[week.id]["b-v2"]).toMatchObject({ date: "2026-10-15", completed: true, completionMode: "simple" });
    expect(weekSummary(restored, "hyunjun", week)).toMatchObject({ count: 2, achieved: true });
    expect(overallSummary(restored, "hyunjun").total).toBe(2);
    expect(overallSummary(restored, "yujin").total).toBe(0);
    expect(visibleWorkouts(restored, "hyunjun", week).map(w => w.id)).toEqual(["a-v2", "b-v2", "a"]);
    expect(visibleWorkouts(restored, "hyunjun", weeks[3]).map(w => w.id)).toEqual(["a-v2", "b-v2"]);
    expect(visibleWorkouts(restored, "hyunjun", weeks[0])).toEqual(legacyPrograms.hyunjun);
  });
});
