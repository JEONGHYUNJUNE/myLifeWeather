import { describe, expect, it } from "vitest";
import { programs } from "../../data/fitness";
import {
  addDays,
  dayDifference,
  emptyRecord,
  emptyStore,
  isComplete,
  localDate,
  overallSummary,
  parseStore,
  setCount,
  updateRecord,
  weekIndex,
  weeks,
  weekSummary,
  type FitnessStore,
  type Week,
} from "./model";
function completeWeights(store: FitnessStore, week: Week, id: string) {
  const workout = programs.hyunjun.find((w) => w.id === id)!;
  return updateRecord(store, "hyunjun", week, id, {
    date: week.start,
    sets: Object.fromEntries(
      workout.exercises.map((ex) => [
        ex.id,
        Array(setCount(ex, week)).fill(true),
      ]),
    ),
  });
}
describe("fitness calendar", () => {
  it("covers all 107 days exactly once in 16 Monday–Sunday weeks, including partial ends", () => {
    expect(weeks).toHaveLength(16);
    expect(weeks[0].dates).toEqual([
      "2026-10-01",
      "2026-10-02",
      "2026-10-03",
      "2026-10-04",
    ]);
    expect(weeks[1].start).toBe("2026-10-05");
    expect(weeks[4].end).toBe("2026-11-01");
    expect(weeks[15].start).toBe("2027-01-11");
    expect(weeks[15].end).toBe("2027-01-15");
    const dates = weeks.flatMap((w) => w.dates);
    expect(dates).toHaveLength(107);
    expect(new Set(dates).size).toBe(107);
    dates
      .slice(1)
      .forEach((date, i) => expect(date).toBe(addDays(dates[i], 1)));
  });
  it("clamps before/after, handles Sunday/Monday and year boundaries", () => {
    expect(weekIndex("2026-09-20")).toBe(0);
    expect(weekIndex("2026-10-04")).toBe(0);
    expect(weekIndex("2026-10-05")).toBe(1);
    expect(weekIndex("2027-01-01")).toBe(13);
    expect(weekIndex("2027-01-15")).toBe(15);
    expect(weekIndex("2027-02-01")).toBe(15);
    expect(dayDifference("2027-01-15", "2026-10-01")).toBe(106);
    expect(localDate(new Date(2026, 9, 1, 0, 1))).toBe("2026-10-01");
  });
});
describe("fitness records", () => {
  it("applies two sets for first two weeks, prescribed sets from third", () => {
    const exercises = programs.hyunjun.flatMap((w) => w.exercises);
    exercises.forEach((ex) => {
      expect(setCount(ex, weeks[0])).toBe(2);
      expect(setCount(ex, weeks[1])).toBe(2);
      expect(setCount(ex, weeks[2])).toBe(ex.sets);
    });
  });
  it("only completes weights when every set and an in-week date exist; undo removes completion", () => {
    const week = weeks[0];
    let store = completeWeights(emptyStore(), week, "a");
    const workout = programs.hyunjun[0];
    const record = store.records.hyunjun[week.id].a;
    expect(isComplete(workout, record, week)).toBe(true);
    expect(isComplete(workout, { ...record, date: "" }, week)).toBe(false);
    expect(isComplete(workout, { ...record, date: "2026-10-05" }, week)).toBe(
      false,
    );
    store = updateRecord(store, "hyunjun", week, "a", {
      sets: { ...record.sets, lat: [true, false] },
    });
    expect(weekSummary(store, "hyunjun", week).count).toBe(0);
    expect(isComplete(workout, record, weeks[2])).toBe(false);
  });
  it("rejects out-of-week updates and unknown workouts", () => {
    const store = emptyStore();
    expect(
      updateRecord(store, "hyunjun", weeks[0], "a", { date: "2026-10-05" }),
    ).toBe(store);
    expect(
      updateRecord(store, "hyunjun", weeks[0], "bogus", {
        date: weeks[0].start,
      }),
    ).toBe(store);
  });
  it("requires A+B, awards bonus C, and isolates people and weeks", () => {
    let store = completeWeights(emptyStore(), weeks[0], "a");
    store = completeWeights(store, weeks[0], "c");
    expect(weekSummary(store, "hyunjun", weeks[0])).toMatchObject({
      count: 2,
      achieved: false,
    });
    store = completeWeights(store, weeks[0], "b");
    expect(weekSummary(store, "hyunjun", weeks[0])).toMatchObject({
      count: 3,
      achieved: true,
      bonus: true,
    });
    expect(weekSummary(store, "yujin", weeks[0]).count).toBe(0);
    expect(weekSummary(store, "hyunjun", weeks[1]).count).toBe(0);
    expect(overallSummary(store, "hyunjun")).toMatchObject({
      total: 3,
      progress: 10,
      target: 30,
      completedWeeks: 1,
      stage: 1,
    });
  });
  it("supports Pilates and running completion without optional metrics and round-trips persisted data", () => {
    let store = emptyStore();
    store.selectedPerson = "yujin";
    store = updateRecord(store, "yujin", weeks[4], "pilates-1", {
      date: "2026-10-27",
      completed: true,
    });
    store = updateRecord(store, "yujin", weeks[4], "running-1", {
      date: "2026-11-01",
      completed: true,
      minutes: 30,
      distance: 3.2,
    });
    expect(weekSummary(store, "yujin", weeks[4])).toMatchObject({
      count: 2,
      achieved: true,
    });
    store = updateRecord(store, "yujin", weeks[4], "running-2", {
      date: "2026-10-30",
      completed: true,
    });
    expect(weekSummary(store, "yujin", weeks[4]).bonus).toBe(true);
    expect(parseStore(JSON.stringify(store))).toEqual(store);
    store = updateRecord(store, "yujin", weeks[4], "running-1", {
      completed: false,
    });
    expect(weekSummary(store, "yujin", weeks[4]).count).toBe(2);
  });
  it("counts every completed workout towards 30 independently of weekly goals", () => {
    let store = emptyStore();
    store = updateRecord(store, "yujin", weeks[0], "running-1", {
      date: weeks[0].start,
      completed: true,
    });
    store = updateRecord(store, "yujin", weeks[1], "running-1", {
      date: weeks[1].start,
      completed: true,
    });
    for (const workout of programs.yujin)
      store = updateRecord(store, "yujin", weeks[2], workout.id, {
        date: weeks[2].start,
        completed: true,
      });
    expect(overallSummary(store, "yujin")).toMatchObject({
      total: 6,
      progress: 20,
      target: 30,
      completedWeeks: 1,
    });
    expect(overallSummary(store, "hyunjun")).toMatchObject({
      total: 0,
      progress: 0,
      stage: 1,
    });
  });
  it("grows through all five stages from actual totals and caps at 100%", () => {
    let store = emptyStore();
    expect(overallSummary(store, "hyunjun").progress).toBe(0);
    let total = 0;
    for (const week of weeks.slice(0, 11))
      for (const workout of programs.hyunjun) {
        store = completeWeights(store, week, workout.id);
        total++;
        const expectedStage =
          total >= 30
            ? 5
            : total >= 23
              ? 4
              : total >= 15
                ? 3
                : total >= 8
                  ? 2
                  : 1;
        expect(overallSummary(store, "hyunjun").stage).toBe(expectedStage);
        expect(overallSummary(store, "hyunjun").progress).toBe(
          Math.min((total / 30) * 100, 100),
        );
      }
    expect(overallSummary(store, "hyunjun")).toMatchObject({
      total: 33,
      progress: 100,
      stage: 5,
    });
    for (const workout of programs.hyunjun)
      store = updateRecord(
        store,
        "hyunjun",
        weeks[10],
        workout.id,
        emptyRecord(),
      );
    expect(overallSummary(store, "hyunjun").progress).toBe(100);
    store = updateRecord(store, "hyunjun", weeks[9], "c", emptyRecord());
    expect(overallSummary(store, "hyunjun")).toMatchObject({
      total: 29,
      stage: 4,
    });
  });
  it("validates persisted version, dates, flags and numeric metadata", () => {
    expect(parseStore(null)).toEqual(emptyStore());
    expect(() => parseStore("{")).toThrow();
    expect(() => parseStore('{"version":9}')).toThrow();
    const store = emptyStore();
    store.records.yujin[weeks[0].id] = {
      "running-1": {
        ...emptyRecord(),
        date: "2026-11-01",
        completed: true,
        minutes: -3,
      },
    };
    const restored = parseStore(JSON.stringify(store));
    expect(restored.records.yujin[weeks[0].id]["running-1"].date).toBe("");
    expect(
      restored.records.yujin[weeks[0].id]["running-1"].minutes,
    ).toBeUndefined();
    expect(weekSummary(restored, "yujin", weeks[0]).count).toBe(0);
  });
});
