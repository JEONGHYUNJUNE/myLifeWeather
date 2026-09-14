"use client";
import { CalendarDays, MapPin, Trophy } from "lucide-react";
import { trip } from "@/data/trip";

const won = new Intl.NumberFormat("ko-KR");

export function TripHero() {
  const now = new Date();
  const start = new Date(`${trip.startDate}T00:00:00+09:00`);
  const dday = Math.ceil((start.getTime() - now.getTime()) / 86400000);
  const total = trip.budget.reduce((sum, item) => sum + item.amount, 0);
  const ddayLabel = dday > 0 ? `D-${dday}` : dday === 0 ? "D-DAY" : "여행 완료";
  return <section className="relative min-h-[620px] overflow-hidden bg-[#063f4d] text-white sm:min-h-[680px]">
    <img src={trip.images.hero} alt="Sydney harbour" className="absolute inset-0 h-full w-full object-cover opacity-55" />
    <div className="absolute inset-0 bg-gradient-to-r from-[#073e49]/95 via-[#073e49]/65 to-transparent" />
    <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#f7f2e8] to-transparent" />
    <div className="relative mx-auto flex min-h-[620px] max-w-6xl flex-col justify-between px-5 pb-24 pt-7 sm:min-h-[680px] sm:px-8 sm:pt-10">
      <nav className="flex items-center justify-between"><span className="text-sm font-bold tracking-[.18em]">TRIP / 2027</span><span className="rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs font-bold backdrop-blur">{ddayLabel}</span></nav>
      <div className="max-w-3xl pb-8">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-[#f3b83f] px-4 py-2 text-xs font-extrabold text-[#18363c]"><Trophy size={15}/> AUSTRALIAN OPEN 2027</div>
        <h1 className="font-display text-5xl leading-[.98] tracking-[-.05em] sm:text-7xl">Australia<br/>2027</h1>
        <p className="mt-5 text-2xl font-semibold sm:text-3xl">Sydney <span className="text-[#f3c875]">→</span> Melbourne</p>
        <div className="mt-8 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-3">
          <HeroStat icon={<CalendarDays size={18}/>} label="여행 기간" value="Jan 22 → Jan 31" />
          <HeroStat icon={<MapPin size={18}/>} label="도시" value="2 cities · 10 days" />
          <HeroStat icon={<Trophy size={18}/>} label="2인 예상 예산" value={`₩${won.format(total)}`} wide />
        </div>
        <p className="mt-5 text-xs text-white/65">항공권 제외 · {trip.departureNote} · {trip.returnNote}</p>
      </div>
    </div>
  </section>;
}

function HeroStat({icon,label,value,wide}:{icon:React.ReactNode;label:string;value:string;wide?:boolean}) {
  return <div className={`rounded-2xl border border-white/20 bg-black/20 p-4 backdrop-blur-md ${wide ? "col-span-2 sm:col-span-1" : ""}`}>
    <div className="flex items-center gap-2 text-white/65">{icon}<span className="text-[10px] font-bold uppercase tracking-wider">{label}</span></div>
    <p className="mt-3 text-sm font-bold sm:text-base">{value}</p>
  </div>;
}
