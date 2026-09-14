"use client";
import { Clock, MapPinned, Star, Wallet, Footprints, TrainFront, Car, Plane, Ship } from "lucide-react";
import Link from "next/link";
import { tripDays, type Transport, type TripActivity } from "@/data/trip";

const won = new Intl.NumberFormat("ko-KR");
const icons:Record<Transport,React.ReactNode>={도보:<Footprints size={14}/>,트램:<TrainFront size={14}/>,기차:<TrainFront size={14}/>,차량:<Car size={14}/>,항공:<Plane size={14}/>,페리:<Ship size={14}/>};

export function DayTimeline() {
  const today = new Date().toISOString().slice(0,10);
  const todayPlan = tripDays.find(day => day.date === today);
  return <section id="itinerary" className="py-20">
    <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-[11px] font-bold uppercase tracking-[.18em] text-[#d06950]">10-day itinerary</p><h2 className="mt-2 font-display text-4xl font-bold tracking-tight">하루씩 펼쳐보는 여행</h2><Link href="/australia-2027/schedule" className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#0b5360] px-4 py-2.5 text-xs font-bold text-white"><Clock size={14}/> 시간별 일정표 열기</Link></div><p className="max-w-sm text-sm leading-6 text-black/50">시드니를 먼저 여행하고 준준결승 전날 멜버른에 들어와, 경기일에는 도시 간 이동을 하지 않는 일정이에요.</p></div>
    {todayPlan && <div className="mb-8 rounded-3xl bg-[#f2b84b] p-6 text-[#173b40]"><b className="text-xs uppercase tracking-widest">Today&apos;s Plan</b><p className="mt-2 text-2xl font-bold">DAY {todayPlan.day} · {todayPlan.title}</p><p className="mt-2 text-sm">{todayPlan.summary}</p></div>}
    <div className="space-y-5">{tripDays.map(day => <article key={day.date} className="overflow-hidden rounded-[28px] border border-black/10 bg-white/70 shadow-sm">
      <header className="grid gap-2 border-b border-black/10 px-5 py-5 sm:grid-cols-[110px_1fr_auto] sm:items-center sm:px-7">
        <div><span className="rounded-full bg-[#0b5360] px-3 py-1.5 text-[10px] font-black tracking-wider text-white">DAY {day.day}</span><p className="mt-2 text-xs text-black/45">{new Date(`${day.date}T12:00:00`).toLocaleDateString("ko-KR",{month:"short",day:"numeric",weekday:"short"})}</p></div>
        <div><h3 className="text-xl font-bold">{day.title}</h3><p className="mt-1 text-sm text-black/50">{day.summary}</p></div><span className="text-xs font-bold text-[#d06950]">{day.city}</span>
      </header>
      <div className="grid gap-4 p-4 sm:p-6 lg:grid-cols-2">{day.activities.map(activity => <ActivityCard key={activity.id} activity={activity}/>)}</div>
    </article>)}</div>
  </section>;
}

export function ActivityCard({activity}:{activity:TripActivity}) {
  return <div className="group grid min-h-[180px] overflow-hidden rounded-2xl bg-[#f6f1e7] sm:grid-cols-[145px_1fr]">
    <img src={activity.image} alt={activity.place} className="h-40 w-full object-cover transition duration-500 group-hover:scale-[1.03] sm:h-full"/>
    <div className="p-4"><div className="flex items-center justify-between gap-2"><span className="flex items-center gap-1 text-xs font-black text-[#d06950]"><Clock size={13}/>{activity.time}</span><span className="flex text-[#e6a72d]">{Array.from({length:activity.rating},(_,i)=><Star key={i} size={11} fill="currentColor"/>)}</span></div>
      <h4 className="mt-2 font-bold">{activity.place}</h4><p className="mt-2 text-xs leading-5 text-black/55">{activity.description}</p>
      <div className="mt-3 flex flex-wrap gap-2 text-[10px] font-semibold text-black/55"><span className="flex items-center gap-1 rounded-full bg-white px-2 py-1">{icons[activity.transport]} {activity.transport} · {activity.travelTime}</span><span className="flex items-center gap-1 rounded-full bg-white px-2 py-1"><Wallet size={12}/> {activity.cost ? `₩${won.format(activity.cost)}` : "무료/별도"}</span><a href={`https://www.google.com/maps/search/?api=1&query=${activity.coordinates[0]},${activity.coordinates[1]}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 rounded-full bg-white px-2 py-1"><MapPinned size={12}/> Google 지도</a></div>
    </div>
  </div>;
}
