import type { Person } from "../../data/fitness";
import { parseStore, STORAGE_KEY, type FitnessStore } from "./model";
type StorageReader = Pick<Storage, "getItem">;
type StorageWriter = Pick<Storage, "setItem">;
export const personStorageKey = (person: Person) =>
  `life-weather-fitness-${person}-v1`;

// Legacy combined records are migrated lazily, without deleting the original.
export function readPersonStore(
  storage: StorageReader,
  person: Person,
): FitnessStore {
  const raw = storage.getItem(personStorageKey(person));
  if (raw === null) {
    const legacy = parseStore(storage.getItem(STORAGE_KEY));
    return {
      version: 1,
      selectedPerson: person,
      records: { hyunjun: {}, yujin: {}, [person]: legacy.records[person] },
    };
  }
  const data = JSON.parse(raw);
  if (
    !data ||
    data.version !== 1 ||
    !data.records ||
    typeof data.records !== "object"
  )
    throw new Error("지원하지 않는 저장 형식");
  return parseStore(
    JSON.stringify({
      version: 1,
      selectedPerson: person,
      records: { [person]: data.records },
    }),
  );
}
export function writePersonStore(
  storage: StorageWriter,
  person: Person,
  store: FitnessStore,
) {
  storage.setItem(
    personStorageKey(person),
    JSON.stringify({ version: 1, records: store.records[person] }),
  );
}
