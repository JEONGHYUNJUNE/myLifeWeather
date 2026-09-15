import type { Metadata } from "next";
import { ArrowDown, CalendarDays, CircleDollarSign, MapPinned, Trophy } from "lucide-react";
import { AustralianOpenCard } from "@/components/trip/AustralianOpenCard";
import { BudgetSummary } from "@/components/trip/BudgetSummary";
import { DayTimeline } from "@/components/trip/DayTimeline";
import { TripHero } from "@/components/trip/TripHero";
import { TripMap } from "@/components/trip/TripMap";
import { TripSummary } from "@/components/trip/TripSummary";
import { FlightDetails } from "@/components/trip/FlightDetails";
import { trip } from "@/data/trip";

export const metadata: Metadata = {
  title: "Australia 2027 · Sydney–Melbourne",
  description: "Australian Open과 함께하는 10일간의 Sydney–Melbourne 여행 플랜",
};

export default function Australia2027Page() {
  return <main className="min-h-screen bg-[#f7f2e8] text-[#163b41]">
    <TripHero />
    <div className="relative z-10 mx-auto -mt-14 max-w-6xl px-4 pb-24 sm:px-8">
      <TripSummary />
      <FlightDetails />
      <TripMap />

      <section className="py-20">
        <div className="mb-8"><p className="text-[11px] font-bold uppercase tracking-[.18em] text-[#d06950]">Two moods, one journey</p><h2 className="mt-2 font-display text-4xl font-bold tracking-tight">도시가 바뀌면 여행의 온도도 바뀐다</h2></div>
        <div className="grid gap-4 md:grid-cols-2">
          <City image={trip.images.sydney} city="Sydney" days="Jan 23—25 · Jan 30—31" copy="하버의 밤, Blue Mountains와 Bondi. 귀국 전날 다시 돌아와 공항 가까이에서 1박해요."/>
          <City image={trip.images.melbourne} city="Melbourne" days="Jan 25—30" copy="커피와 골목, Great Ocean Road, 그리고 두 번의 남자 단식 빅매치."/>
        </div>
      </section>

      <AustralianOpenCard />
      <DayTimeline />
      <BudgetSummary />

      <footer className="rounded-[30px] bg-[#0b5360] px-6 py-9 text-white sm:flex sm:items-end sm:justify-between sm:px-9">
        <div><p className="text-xs font-bold uppercase tracking-[.18em] text-[#9dd5d0]">Australia 2027</p><h2 className="mt-3 font-display text-3xl font-bold">Pack light. Book smart.<br/>Watch great tennis.</h2></div>
        <a href="#map" className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#efbd58] px-5 py-3 text-sm font-bold text-[#163b41] sm:mt-0">경로 다시 보기 <ArrowDown size={16}/></a>
      </footer>
    </div>

    <nav className="fixed inset-x-3 bottom-3 z-50 grid grid-cols-4 rounded-2xl border border-white/30 bg-[#123e4a]/95 p-2 text-white shadow-2xl backdrop-blur md:hidden">
      <MobileLink href="#map" icon={<MapPinned size={17}/>} label="지도"/>
      <MobileLink href="#itinerary" icon={<CalendarDays size={17}/>} label="일정"/>
      <MobileLink href="#tennis" icon={<Trophy size={17}/>} label="테니스"/>
      <MobileLink href="#budget" icon={<CircleDollarSign size={17}/>} label="예산"/>
    </nav>
  </main>;
}

function City({image,city,days,copy}:{image:string;city:string;days:string;copy:string}) {
  return <article className="group relative min-h-[380px] overflow-hidden rounded-[30px] text-white"><img src={image} alt={city} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"/><div className="absolute inset-0 bg-gradient-to-t from-[#0a3d46]/95 via-transparent"/><div className="absolute inset-x-0 bottom-0 p-7"><p className="text-xs font-bold text-[#f3c875]">{days}</p><h3 className="mt-2 font-display text-4xl font-bold">{city}</h3><p className="mt-3 max-w-sm text-sm leading-6 text-white/70">{copy}</p></div></article>;
}

function MobileLink({href,icon,label}:{href:string;icon:React.ReactNode;label:string}) {
  return <a href={href} className="flex flex-col items-center gap-1 rounded-xl py-2 text-[10px] font-bold">{icon}{label}</a>;
}
