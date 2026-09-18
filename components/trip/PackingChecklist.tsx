"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, ClipboardCheck, RotateCcw, Save, Users } from "lucide-react";
import { checklistCategories, tripChecklist, type ChecklistOwner } from "@/data/tripChecklist";

const STORAGE_KEY = "australia-2027-checklist-v1";
const owners: ChecklistOwner[] = ["유진", "현준"];

export function PackingChecklist() {
  const [owner, setOwner] = useState<ChecklistOwner>("유진");
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) setChecked(JSON.parse(saved));
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(checked));
  }, [checked, loaded]);

  const items = useMemo(() => tripChecklist.filter(item => item.owner === owner), [owner]);
  const done = items.filter(item => checked[item.id]).length;
  const allDone = tripChecklist.filter(item => checked[item.id]).length;
  const percent = Math.round((done / items.length) * 100);

  const toggle = (id: string) => setChecked(current => ({ ...current, [id]: !current[id] }));
  const reset = () => {
    if (window.confirm("두 사람의 체크 상태를 모두 초기화할까요?")) setChecked({});
  };

  return <main className="min-h-screen bg-[#f7f2e8] pb-24 text-[#163b41]">
    <header className="relative overflow-hidden bg-[#0b5360] px-5 pb-20 pt-6 text-white sm:px-8 sm:pt-10">
      <div className="absolute -right-16 -top-24 h-72 w-72 rounded-full bg-[#efbd58]/30"/>
      <div className="relative mx-auto max-w-5xl"><Link href="/australia-2027" className="inline-flex items-center gap-2 text-xs font-bold text-white/65 hover:text-white"><ArrowLeft size={16}/> 여행 대시보드</Link><p className="mt-12 text-[11px] font-black uppercase tracking-[.2em] text-[#9dd5d0]">Packing together</p><h1 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-6xl">유진 &amp; 현준<br/>호주 준비 체크리스트</h1><p className="mt-4 text-sm text-white/60">2027. 1. 22—31 · 체크한 내용은 이 브라우저에 자동 저장돼요.</p></div>
    </header>

    <div className="mx-auto max-w-5xl px-4 sm:px-8">
      <section className="-mt-10 rounded-[28px] bg-white p-5 shadow-xl sm:p-7">
        <div className="flex items-center justify-between gap-4"><div><p className="text-xs font-bold text-black/45">전체 준비 현황</p><p className="mt-1 text-2xl font-black">{allDone} / {tripChecklist.length}</p></div><div className="flex items-center gap-2 text-xs font-bold text-[#0b5360]"><Save size={16}/>{loaded ? "자동 저장 중" : "불러오는 중"}</div></div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#edf0ea]"><div className="h-full rounded-full bg-[#efbd58] transition-all" style={{width:`${allDone / tripChecklist.length * 100}%`}}/></div>
      </section>

      <div className="sticky top-3 z-30 mt-5 grid grid-cols-2 rounded-2xl border border-black/10 bg-white/90 p-1.5 shadow-lg backdrop-blur">{owners.map(person => {
        const personItems = tripChecklist.filter(item => item.owner === person);
        const personDone = personItems.filter(item => checked[item.id]).length;
        return <button key={person} onClick={() => setOwner(person)} className={`rounded-xl px-4 py-3 text-sm font-black transition ${owner === person ? "bg-[#0b5360] text-white" : "text-black/45"}`}><span className="flex items-center justify-center gap-2"><Users size={15}/>{person}<small className="font-medium opacity-60">{personDone}/{personItems.length}</small></span></button>;
      })}</div>

      <div className="py-9"><div className="mb-7 flex items-end justify-between"><div><p className="text-[11px] font-bold uppercase tracking-[.18em] text-[#d06950]">{owner}&apos;s list</p><h2 className="mt-2 text-3xl font-black">{percent}% 준비 완료</h2></div><ClipboardCheck size={32} className="text-[#d06950]"/></div>
        <div className="space-y-6">{checklistCategories.map(category => {
          const categoryItems = items.filter(item => item.category === category);
          return <section key={category} className="overflow-hidden rounded-[24px] border border-black/10 bg-white/70"><header className="flex items-center justify-between border-b border-black/10 px-5 py-4"><h3 className="font-black">{category}</h3><span className="text-xs font-bold text-black/35">{categoryItems.filter(item => checked[item.id]).length}/{categoryItems.length}</span></header><div className="divide-y divide-black/5">{categoryItems.map(item => <label key={item.id} className="flex cursor-pointer items-start gap-3 px-5 py-4 transition hover:bg-white"><input type="checkbox" checked={Boolean(checked[item.id])} onChange={() => toggle(item.id)} className="sr-only"/><span className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-lg border transition ${checked[item.id] ? "border-[#0b5360] bg-[#0b5360] text-white" : "border-black/20 bg-white"}`}>{checked[item.id] && <Check size={15} strokeWidth={3}/>}</span><span><b className={`block text-sm ${checked[item.id] ? "text-black/35 line-through" : ""}`}>{item.label}</b>{item.note && <small className="mt-1 block text-xs leading-5 text-black/40">{item.note}</small>}</span></label>)}</div></section>;
        })}</div>
      </div>

      <section className="rounded-[26px] bg-[#efbd58] p-6"><b>저장 방식 안내</b><p className="mt-2 text-xs leading-5 text-black/55">현재는 이 기기의 브라우저에 저장됩니다. 같은 휴대폰에서는 새로고침하거나 다시 접속해도 유지되지만, 유진·현준의 서로 다른 휴대폰 사이에는 자동 동기화되지 않아요.</p><button onClick={reset} className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2.5 text-xs font-bold"><RotateCcw size={14}/> 전체 체크 초기화</button></section>
    </div>
  </main>;
}
