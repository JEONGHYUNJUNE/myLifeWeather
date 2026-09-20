"use client";
import { useEffect, useState } from "react";
import type { Person } from "../../data/fitness";
import {
  emptyStore,
  localDate,
  updateRecord,
  weekIndex,
  weeks,
  type WorkoutRecord,
} from "./model";
import { readPersonStore, writePersonStore } from "./storage";

export function useFitnessController(person: Person) {
  const [store, setStore] = useState(emptyStore);
  const [ready, setReady] = useState(false);
  const [storageError, setStorageError] = useState("");
  const [canSave, setCanSave] = useState(false);
  const [today, setToday] = useState("");
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const date = localDate();
    setToday(date);
    setIndex(weekIndex(date));
    try {
      setStore(readPersonStore(localStorage, person));
      setCanSave(true);
    } catch {
      setStorageError(
        "저장된 기록을 읽을 수 없어 임시 모드로 열었어요. 기존 저장 데이터는 덮어쓰지 않아요.",
      );
    }
    setReady(true);
    const refresh = () => setToday(localDate());
    window.addEventListener("focus", refresh);
    const timer = window.setInterval(refresh, 60000);
    return () => {
      window.removeEventListener("focus", refresh);
      window.clearInterval(timer);
    };
  }, [person]);
  useEffect(() => {
    if (!ready || !canSave) return;
    try {
      writePersonStore(localStorage, person, store);
      setStorageError("");
    } catch {
      setStorageError(
        "브라우저에 저장하지 못했어요. 저장 공간과 브라우저 설정을 확인해 주세요.",
      );
    }
  }, [store, ready, canSave, person]);
  const week = weeks[index];
  return {
    store,
    ready,
    storageError,
    today,
    index,
    person,
    week,
    selectWeek: (next: number) =>
      setIndex(Math.max(0, Math.min(weeks.length - 1, next))),
    saveRecord: (id: string, patch: Partial<WorkoutRecord>) =>
      setStore((s) => updateRecord(s, person, week, id, patch)),
  };
}
