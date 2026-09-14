"use client";
import { useEffect, useMemo, useState } from "react";
import { Check, Pencil, RotateCcw, WalletCards } from "lucide-react";
import { trip } from "@/data/trip";
const won = new Intl.NumberFormat("ko-KR");

export function BudgetSummary() {
  const [budget,setBudget]=useState<Array<{id:string;label:string;amount:number;color:string}>>(()=>trip.budget.map(item=>({...item})));
  const [ready,setReady]=useState(false);
  const [saved,setSaved]=useState(false);
  useEffect(()=>{
    try {
      const stored=JSON.parse(localStorage.getItem("australia-2027-budget-v2")||"null") as Record<string,number>|null;
      if(stored) setBudget(current=>current.map(item=>({...item,amount:Number.isFinite(stored[item.id])?Math.max(0,stored[item.id]):item.amount})));
    } catch {}
    setReady(true);
  },[]);
  useEffect(()=>{
    if(!ready)return;
    localStorage.setItem("australia-2027-budget-v2",JSON.stringify(Object.fromEntries(budget.map(item=>[item.id,item.amount]))));
    setSaved(true);
    const timer=window.setTimeout(()=>setSaved(false),1600);
    return()=>window.clearTimeout(timer);
  },[budget,ready]);
  const total=useMemo(()=>budget.reduce((sum,item)=>sum+item.amount,0),[budget]);
  return <section id="budget" className="py-20"><div className="mb-8"><p className="text-[11px] font-bold uppercase tracking-[.18em] text-[#d06950]">2 travelers · international flights excluded</p><h2 className="mt-2 font-display text-4xl font-bold">여행 예산</h2></div>
    <div className="grid gap-5 lg:grid-cols-[.8fr_1.2fr]"><div className="rounded-[30px] bg-[#efbd58] p-7 text-[#173c43]"><WalletCards size={28}/><p className="mt-12 text-xs font-bold uppercase tracking-widest">Estimated total · 2인</p><p className="mt-2 text-4xl font-black tracking-tight">₩{won.format(total)}</p><p className="mt-2 text-sm font-bold">1인당 약 ₩{won.format(Math.round(total/trip.travelers))}</p><p className="mt-3 text-xs leading-5 text-black/55">국제선 항공권 제외 · 호텔은 객실 1개 기준<br/>수정한 금액은 이 브라우저에 자동 저장돼요.</p><div className="mt-8 flex h-4 overflow-hidden rounded-full">{budget.map(item=><span key={item.id} style={{width:`${total?item.amount/total*100:0}%`,background:item.color}} title={item.label}/>)}</div></div>
      <div className="rounded-[30px] border border-black/10 bg-white/70 p-5 sm:p-7"><div className="mb-4 flex items-center justify-between gap-3 text-xs text-black/45"><span className="flex items-center gap-2">{saved?<><Check size={14} className="text-[#0b7768]"/> 자동 저장됨</>:<><Pencil size={14}/> 2인 전체 금액</>}</span><button type="button" onClick={()=>{localStorage.removeItem("australia-2027-budget-v2");setBudget(trip.budget.map(item=>({...item})));}} className="flex items-center gap-1 font-bold hover:text-black"><RotateCcw size={13}/> 기본값</button></div><div className="divide-y divide-black/10">{budget.map((item,index)=><label key={item.id} className="flex items-center gap-3 py-3"><span className="h-3 w-3 shrink-0 rounded-full" style={{background:item.color}}/><span className="min-w-0 flex-1 text-sm font-semibold">{item.label}</span><span className="text-sm">₩</span><input aria-label={`${item.label} 예산`} type="number" step="10000" min="0" value={item.amount} onChange={e=>setBudget(current=>current.map((value,i)=>i===index?{...value,amount:Math.max(0,Number(e.target.value))}:value))} className="w-28 rounded-lg border border-black/10 bg-[#f8f4eb] px-2 py-2 text-right text-sm font-bold tabular-nums sm:w-36"/></label>)}</div></div>
    </div></section>;
}
