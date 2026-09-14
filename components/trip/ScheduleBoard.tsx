"use client";
import { useMemo, useState } from "react";
import { ArrowLeft, CalendarDays, ChevronDown, Clock3, ExternalLink, MapPin, Plane, Route, Wallet } from "lucide-react";
import Link from "next/link";
import { trip, tripDays, type TripActivity } from "@/data/trip";

const won = new Intl.NumberFormat("ko-KR");
const googleMap = (activity: TripActivity) => `https://www.google.com/maps/search/?api=1&query=${activity.coordinates[0]},${activity.coordinates[1]}`;

export function ScheduleBoard() {
  const [selected,setSelected]=useState<string>("all");
  const visible=useMemo(()=>selected==="all"?tripDays:tripDays.filter(day=>day.date===selected),[selected]);
  return <main className="min-h-screen bg-[#f7f2e8] pb-24 text-[#163b41]">
    <header className="relative overflow-hidden bg-[#0b5360] px-5 pb-14 pt-6 text-white sm:px-8 sm:pb-20 sm:pt-10">
      <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#efbd58]/25"/><div className="absolute right-20 top-28 h-20 w-20 rounded-full border border-white/15"/>
      <div className="relative mx-auto max-w-5xl"><Link href="/australia-2027" className="inline-flex items-center gap-2 text-xs font-bold text-white/65 hover:text-white"><ArrowLeft size={16}/> 여행 대시보드</Link><p className="mt-12 text-[11px] font-black uppercase tracking-[.2em] text-[#9dd5d0]">Time-by-time planner</p><h1 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-6xl">호주 여행 시간표</h1><p className="mt-4 max-w-xl text-sm leading-6 text-white/60">Sydney → Melbourne · Jan 22—31 · 각 장소를 누르면 Google Maps에서 위치를 확인할 수 있어요.</p></div>
    </header>
    <div className="mx-auto max-w-5xl px-4 sm:px-8">
      <div className="sticky top-3 z-30 -mt-6 rounded-2xl border border-black/10 bg-white/90 p-3 shadow-xl backdrop-blur sm:mt-[-28px]"><label className="flex items-center gap-3"><CalendarDays size={18} className="ml-1 text-[#d06950]"/><span className="hidden text-xs font-bold sm:block">날짜 선택</span><div className="relative min-w-0 flex-1"><select value={selected} onChange={e=>setSelected(e.target.value)} className="h-11 w-full appearance-none rounded-xl bg-[#f7f2e8] px-4 pr-10 text-sm font-bold outline-none"><option value="all">전체 10일 시간표</option>{tripDays.map(day=><option key={day.date} value={day.date}>DAY {day.day} · {day.date.slice(5).replace("-","/")} · {day.title}</option>)}</select><ChevronDown size={16} className="pointer-events-none absolute right-3 top-3.5"/></div></label></div>
      <div className="space-y-8 py-12">{visible.map(day=><DaySchedule key={day.date} day={day}/>)}</div>
      <div className="rounded-3xl bg-[#efbd58] p-6 sm:flex sm:items-center sm:justify-between"><div><b className="text-lg">지도는 Google Maps로 열립니다</b><p className="mt-1 text-xs text-black/55">해외에서 데이터 연결이 불안할 수 있으니 출국 전에 Melbourne·Sydney 오프라인 지도를 저장해두세요.</p></div><a href="https://www.google.com/maps/dir/Sydney+NSW/Melbourne+VIC" target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#163b41] px-5 py-3 text-xs font-bold text-white sm:mt-0"><Route size={15}/> 전체 경로 열기</a></div>
    </div>
  </main>;
}

function DaySchedule({day}:{day:(typeof tripDays)[number]}) {
  const total=day.activities.reduce((sum,item)=>sum+item.cost,0);
  return <section className="overflow-hidden rounded-[28px] border border-black/10 bg-white/70 shadow-sm">
    <header className="flex items-start justify-between gap-4 border-b border-black/10 p-5 sm:p-6"><div className="flex gap-4"><span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#0b5360] text-xs font-black text-white">D{day.day}</span><div><p className="text-[11px] font-bold text-[#d06950]">{new Date(`${day.date}T12:00:00`).toLocaleDateString("ko-KR",{year:"numeric",month:"long",day:"numeric",weekday:"short"})}</p><h2 className="mt-1 text-xl font-bold">{day.title}</h2><p className="mt-1 text-xs text-black/45">{day.city} · {day.summary}</p></div></div>{total>0&&<span className="hidden rounded-full bg-[#f7f2e8] px-3 py-2 text-xs font-bold sm:block">₩{won.format(total)}</span>}</header>
    <div className="p-4 sm:p-6">{day.activities.map((activity,index)=><div key={activity.id} className="grid grid-cols-[52px_1fr] gap-3 sm:grid-cols-[74px_1fr] sm:gap-5"><div className="relative text-right"><b className="text-xs tabular-nums text-[#0b5360] sm:text-sm">{activity.time}</b>{index<day.activities.length-1&&<span className="absolute right-[5px] top-7 h-[calc(100%-12px)] border-r border-dashed border-[#0b5360]/25"/>}<span className="absolute right-0 top-6 h-2.5 w-2.5 rounded-full border-2 border-white bg-[#d06950] shadow"/></div><div className={`${index<day.activities.length-1?"pb-6":""}`}><a href={googleMap(activity)} target="_blank" rel="noopener noreferrer" className="group grid overflow-hidden rounded-2xl border border-black/10 bg-[#f8f4eb] sm:grid-cols-[1fr_120px]"><div className="p-4"><div className="flex items-start justify-between gap-3"><div><p className="flex items-center gap-1 text-[10px] font-bold text-[#d06950]"><MapPin size={12}/>{activity.place}</p><p className="mt-2 text-sm font-bold leading-5 group-hover:underline">{activity.description}</p></div><ExternalLink size={15} className="shrink-0 text-black/30"/></div><div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-[10px] text-black/50"><span className="flex items-center gap-1"><Clock3 size={12}/>{activity.duration}</span><span className="flex items-center gap-1"><Plane size={12}/>{activity.transport} · {activity.travelTime}</span><span className="flex items-center gap-1"><Wallet size={12}/>{activity.cost?`₩${won.format(activity.cost)}`:"추가 비용 없음"}</span></div></div><img src={activity.image} alt="" className="hidden h-full min-h-[128px] w-full object-cover sm:block"/></a></div></div>)}</div>
  </section>;
}
