import { PlaneLanding, PlaneTakeoff } from "lucide-react";
import { trip } from "@/data/trip";

export function FlightDetails() {
  return <section className="py-16">
    <div className="mb-7"><p className="text-[11px] font-bold uppercase tracking-[.18em] text-[#d06950]">Confirmed international flights</p><h2 className="mt-2 font-display text-4xl font-bold tracking-tight">항공편 한눈에 보기</h2></div>
    <div className="grid gap-4 lg:grid-cols-2">{trip.internationalFlights.map((flight, index) => <article key={flight.flightNumber} className="rounded-[28px] border border-black/10 bg-white/75 p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4"><div><span className="rounded-full bg-[#eaf3f1] px-3 py-1 text-[11px] font-black text-[#0b5360]">{flight.direction}</span><p className="mt-3 text-sm font-bold">{flight.date} · {flight.duration}</p></div>{index === 0 ? <PlaneTakeoff className="text-[#d06950]"/> : <PlaneLanding className="text-[#d06950]"/>}</div>
      <div className="mt-7 grid grid-cols-[1fr_auto_1fr] items-center gap-3"><Airport time={flight.departure.time} code={flight.departure.airport} city={flight.departure.city} terminal={flight.departure.terminal}/><div className="h-px w-full min-w-10 bg-black/20"/><Airport time={flight.arrival.time} code={flight.arrival.airport} city={flight.arrival.city} terminal={flight.arrival.terminal} nextDay={flight.arrival.nextDay}/></div>
      <p className="mt-6 border-t border-black/10 pt-4 text-xs font-semibold text-black/55">{flight.airline} · {flight.flightNumber} · {flight.aircraft} · 일반석</p>
    </article>)}</div>
    <p className="mt-4 text-xs leading-5 text-black/50">왕복 모두 Sydney T1을 이용합니다. 따라서 1월 30일 저녁 Melbourne → Sydney 국내선과 시드니 공항 인근 1박을 일정에 포함했어요.</p>
  </section>;
}

function Airport({time,code,city,terminal,nextDay}:{time:string;code:string;city:string;terminal:string;nextDay?:boolean}) {
  return <div><p className="text-3xl font-black tracking-tight">{time}{nextDay && <sup className="ml-1 text-xs text-[#d06950]">+1</sup>}</p><p className="mt-2 text-sm font-bold">{code} · {city}</p><p className="mt-1 text-[11px] text-black/45">Terminal {terminal.replace("T", "")}</p></div>;
}
