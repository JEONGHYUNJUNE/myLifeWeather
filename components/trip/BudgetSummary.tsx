"use client";
import { useMemo, useState } from "react";
import { Pencil, WalletCards } from "lucide-react";
import { trip } from "@/data/trip";
const won = new Intl.NumberFormat("ko-KR");

export function BudgetSummary() {
  const [budget,setBudget]=useState<Array<{id:string;label:string;amount:number;color:string}>>(()=>trip.budget.map(item=>({...item})));
  const total=useMemo(()=>budget.reduce((sum,item)=>sum+item.amount,0),[budget]);
  return <section id="budget" className="py-20"><div className="mb-8"><p className="text-[11px] font-bold uppercase tracking-[.18em] text-[#d06950]">Per person · flights excluded</p><h2 className="mt-2 font-display text-4xl font-bold">여행 예산</h2></div>
    <div className="grid gap-5 lg:grid-cols-[.8fr_1.2fr]"><div className="rounded-[30px] bg-[#efbd58] p-7 text-[#173c43]"><WalletCards size={28}/><p className="mt-12 text-xs font-bold uppercase tracking-widest">Estimated total</p><p className="mt-2 text-4xl font-black tracking-tight">₩{won.format(total)}</p><p className="mt-3 text-xs leading-5 text-black/55">국제선 항공권 제외 · 1인 기준<br/>입력값을 눌러 현장에서 바로 수정할 수 있어요.</p><div className="mt-8 flex h-4 overflow-hidden rounded-full">{budget.map(item=><span key={item.id} style={{width:`${item.amount/total*100}%`,background:item.color}} title={item.label}/>)}</div></div>
      <div className="rounded-[30px] border border-black/10 bg-white/70 p-5 sm:p-7"><div className="mb-4 flex items-center gap-2 text-xs text-black/45"><Pencil size={14}/> 금액 수정 가능</div><div className="divide-y divide-black/10">{budget.map((item,index)=><label key={item.id} className="flex items-center gap-3 py-3"><span className="h-3 w-3 shrink-0 rounded-full" style={{background:item.color}}/><span className="min-w-0 flex-1 text-sm font-semibold">{item.label}</span><span className="text-sm">₩</span><input aria-label={`${item.label} 예산`} type="number" step="10000" min="0" value={item.amount} onChange={e=>setBudget(current=>current.map((value,i)=>i===index?{...value,amount:Number(e.target.value)}:value))} className="w-28 rounded-lg border border-black/10 bg-[#f8f4eb] px-2 py-2 text-right text-sm font-bold tabular-nums sm:w-36"/></label>)}</div></div>
    </div></section>;
}
