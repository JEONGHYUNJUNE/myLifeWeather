import {
  END,
  START,
  programs,
  type Exercise,
  type Person,
  type Workout,
} from "../../data/fitness";
export type Week = {
  id: string;
  number: number;
  start: string;
  end: string;
  dates: string[];
};
export type WorkoutRecord = {
  date: string;
  completed: boolean;
  completionMode?: "simple" | "sets";
  sets: Record<string, boolean[]>;
  minutes?: number;
  distance?: number;
};
export type FitnessStore = {
  version: 1;
  selectedPerson: Person;
  records: Record<Person, Record<string, Record<string, WorkoutRecord>>>;
};
export const STORAGE_KEY = "life-weather-fitness-v1";
export const emptyStore = (): FitnessStore => ({
  version: 1,
  selectedPerson: "hyunjun",
  records: { hyunjun: {}, yujin: {} },
});
export const emptyRecord = (): WorkoutRecord => ({
  date: "",
  completed: false,
  sets: {},
});
export const localDate = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const utc = (date: string) => new Date(`${date}T00:00:00Z`);
export const dayDifference = (a: string, b: string) =>
  Math.round((+utc(a) - +utc(b)) / 86400000);
export const addDays = (date: string, n: number) =>
  new Date(+utc(date) + n * 86400000).toISOString().slice(0, 10);
export function buildWeeks(): Week[] {
  const result: Week[] = [];
  let start = START;
  while (start <= END) {
    const sunday = addDays(start, (7 - utc(start).getUTCDay()) % 7);
    const end = sunday < END ? sunday : END;
    const dates = Array.from(
      { length: dayDifference(end, start) + 1 },
      (_, i) => addDays(start, i),
    );
    result.push({ id: start, number: result.length + 1, start, end, dates });
    start = addDays(end, 1);
  }
  return result;
}
export const weeks = buildWeeks();
export function weekIndex(date: string) {
  if (date < START) return 0;
  const index = weeks.findIndex((w) => w.start <= date && date <= w.end);
  return index === -1 ? weeks.length - 1 : index;
}
export const shortDate = (date: string) =>
  `${Number(date.slice(5, 7))}/${Number(date.slice(8))}`;
export const dateLabel = (date: string) =>
  `${Number(date.slice(5, 7))}월 ${Number(date.slice(8))}일 ${"일월화수목금토"[utc(date).getUTCDay()]}요일`;
export const setCount = (exercise: Exercise, week: Week) =>
  week.number <= 2 ? 2 : exercise.sets;
export function isComplete(
  workout: Workout,
  record: WorkoutRecord | undefined,
  week: Week,
) {
  if (!record || !week.dates.includes(record.date)) return false;
  if (record.completionMode === "simple") return record.completed;
  return workout.kind === "weights"
    ? workout.exercises.every((ex) =>
        Array.from(
          { length: setCount(ex, week) },
          (_, i) => record.sets[ex.id]?.[i] === true,
        ).every(Boolean),
      )
    : record.completed;
}
export function weekSummary(store: FitnessStore, person: Person, week: Week) {
  const records = store.records[person][week.id] || {};
  const done = programs[person].filter((w) =>
    isComplete(w, records[w.id], week),
  );
  // A/B cover the required muscle groups; C never replaces either required session.
  const achieved =
    person === "hyunjun"
      ? ["a", "b"].every((id) => done.some((w) => w.id === id))
      : done.length >= 2;
  return {
    count: done.length,
    achieved,
    bonus: achieved && done.length >= 3,
    done,
  };
}
export function overallSummary(store: FitnessStore, person: Person) {
  const summaries = weeks.map((week) => weekSummary(store, person, week));
  const total = summaries.reduce((n, w) => n + w.count, 0);
  const target = 30;
  const progress = Math.min((total / target) * 100, 100);
  return {
    total,
    target,
    progress,
    completedWeeks: summaries.filter((w) => w.achieved).length,
    stage: progress >= 100 ? 5 : Math.floor(progress / 25) + 1,
  };
}
export function updateRecord(
  store: FitnessStore,
  person: Person,
  week: Week,
  workoutId: string,
  patch: Partial<WorkoutRecord>,
): FitnessStore {
  if (!programs[person].some((w) => w.id === workoutId)) return store;
  if (
    patch.date !== undefined &&
    patch.date !== "" &&
    !week.dates.includes(patch.date)
  )
    return store;
  const current = store.records[person][week.id] || {};
  return {
    ...store,
    records: {
      ...store.records,
      [person]: {
        ...store.records[person],
        [week.id]: {
          ...current,
          [workoutId]: { ...emptyRecord(), ...current[workoutId], ...patch },
        },
      },
    },
  };
}
export function parseStore(raw: string | null): FitnessStore {
  const store = emptyStore();
  if (!raw) return store;
  const data = JSON.parse(raw);
  if (
    !data ||
    data.version !== 1 ||
    !data.records ||
    typeof data.records !== "object"
  )
    throw new Error("지원하지 않는 저장 형식");
  if (data.selectedPerson === "yujin") store.selectedPerson = "yujin";
  for (const person of ["hyunjun", "yujin"] as const)
    for (const week of weeks)
      for (const workout of programs[person]) {
        const record = data.records?.[person]?.[week.id]?.[workout.id];
        if (!record || typeof record !== "object") continue;
        const clean = emptyRecord();
        clean.date = week.dates.includes(record.date) ? record.date : "";
        clean.completed = record.completed === true;
        if (
          record.completionMode === "simple" ||
          record.completionMode === "sets"
        )
          clean.completionMode = record.completionMode;
        for (const ex of workout.exercises)
          clean.sets[ex.id] = Array.from(
            { length: setCount(ex, week) },
            (_, i) => record.sets?.[ex.id]?.[i] === true,
          );
        for (const field of ["minutes", "distance"] as const)
          if (
            typeof record[field] === "number" &&
            Number.isFinite(record[field]) &&
            record[field] >= 0
          )
            clean[field] = record[field];
        store.records[person][week.id] ??= {};
        store.records[person][week.id][workout.id] = clean;
      }
  return store;
}
