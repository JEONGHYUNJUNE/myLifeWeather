import { describe, expect, it } from "vitest";
import {
  emptyStore,
  STORAGE_KEY,
  updateRecord,
  weeks,
  overallSummary,
} from "./model";
import { personStorageKey, readPersonStore, writePersonStore } from "./storage";
function memoryStorage() {
  const data = new Map<string, string>();
  return {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => {
      data.set(key, value);
    },
  };
}
describe("personal fitness storage", () => {
  it("migrates only the route person and preserves the combined legacy records", () => {
    const storage = memoryStorage();
    const legacy = updateRecord(emptyStore(), "yujin", weeks[0], "running-1", {
      date: weeks[0].start,
      completed: true,
      minutes: 20,
      distance: 2,
    });
    // Last selected user must never override the route.
    legacy.selectedPerson = "hyunjun";
    const original = JSON.stringify(legacy);
    storage.setItem(STORAGE_KEY, original);
    const yujin = readPersonStore(storage, "yujin");
    expect(yujin.selectedPerson).toBe("yujin");
    expect(yujin.records.hyunjun).toEqual({});
    expect(overallSummary(yujin, "yujin").total).toBe(1);
    writePersonStore(storage, "yujin", yujin);
    expect(readPersonStore(storage, "yujin")).toEqual(yujin);
    expect(storage.getItem(STORAGE_KEY)).toBe(original);
    expect(storage.getItem(personStorageKey("hyunjun"))).toBeNull();
    expect(
      overallSummary(readPersonStore(storage, "hyunjun"), "hyunjun").total,
    ).toBe(0);
  });
  it("cannot overwrite the other user even when both dashboards were opened before edits", () => {
    const storage = memoryStorage();
    const hyunjun = readPersonStore(storage, "hyunjun");
    let yujin = readPersonStore(storage, "yujin");
    yujin = updateRecord(yujin, "yujin", weeks[1], "pilates-1", {
      date: weeks[1].start,
      completed: true,
    });
    writePersonStore(storage, "yujin", yujin);
    const saved = storage.getItem(personStorageKey("yujin"));
    writePersonStore(storage, "hyunjun", hyunjun);
    expect(storage.getItem(personStorageKey("yujin"))).toBe(saved);
    expect(
      overallSummary(readPersonStore(storage, "yujin"), "yujin").total,
    ).toBe(1);
    expect(readPersonStore(storage, "hyunjun").records.yujin).toEqual({});
  });
  it("prefers personal records and fails closed on corrupt data", () => {
    const storage = memoryStorage();
    const legacy = updateRecord(emptyStore(), "yujin", weeks[0], "running-1", {
      date: weeks[0].start,
      completed: true,
    });
    storage.setItem(STORAGE_KEY, JSON.stringify(legacy));
    writePersonStore(storage, "yujin", emptyStore());
    expect(
      overallSummary(readPersonStore(storage, "yujin"), "yujin").total,
    ).toBe(0);
    storage.setItem(personStorageKey("yujin"), "{");
    expect(() => readPersonStore(storage, "yujin")).toThrow();
    expect(storage.getItem(personStorageKey("yujin"))).toBe("{");
  });
});
