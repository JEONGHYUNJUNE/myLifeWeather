"use client";
import { ExternalLink, Navigation } from "lucide-react";
import { trip } from "@/data/trip";

const points = [
  { x: 82, y: 34 }, { x: 73, y: 28 }, { x: 20, y: 68 }, { x: 7, y: 81 }, { x: 23, y: 64 },
];

export function TripMap() {
  return <section id="map" className="rounded-[30px] bg-[#0b5360] p-4 text-white shadow-2xl shadow-[#0b5360]/15 sm:p-7">
    <div className="flex items-end justify-between gap-4 px-2 pb-5"><div><p className="text-[11px] font-bold uppercase tracking-[.18em] text-[#9dd5d0]">Route map</p><h2 className="mt-2 text-2xl font-bold">두 도시와 바다를 잇는 길</h2></div><Navigation className="text-[#efbd58]"/></div>
    <div className="relative aspect-[4/3] min-h-[360px] overflow-hidden rounded-[24px] bg-[#dce7df] sm:aspect-[16/8]">
      <div className="absolute inset-0 opacity-50" style={{backgroundImage:"radial-gradient(#2d6b70 1px, transparent 1px)",backgroundSize:"18px 18px"}} />
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden>
        <path d="M82 34 L73 28" fill="none" stroke="#e49a54" strokeWidth="1.4" strokeLinecap="round"/>
        <path d="M82 34 Q53 46 20 68" fill="none" stroke="#0b5360" strokeWidth="1.2" strokeDasharray="3 3"/>
        <path d="M20 68 Q10 73 7 81 M20 68 L23 64" fill="none" stroke="#e49a54" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
      <span className="absolute left-[46%] top-[47%] rotate-[-12deg] rounded-full bg-white/80 px-3 py-1 text-[10px] font-bold text-[#0b5360]">✈ 1h 35m</span>
      {trip.mapStops.map((stop,index) => <a key={stop.name} href={`https://www.openstreetmap.org/?mlat=${stop.coordinates[0]}&mlon=${stop.coordinates[1]}#map=11/${stop.coordinates[0]}/${stop.coordinates[1]}`} target="_blank" rel="noreferrer" className="group absolute -translate-x-1/2 -translate-y-1/2" style={{left:`${points[index].x}%`,top:`${points[index].y}%`}}>
        <span className="grid h-10 w-10 place-items-center rounded-full border-4 border-white bg-[#ed795d] text-sm font-black shadow-lg transition group-hover:scale-110">{stop.number}</span>
        <span className="absolute left-1/2 top-11 w-max -translate-x-1/2 rounded-lg bg-white px-2.5 py-1.5 text-center text-[10px] font-bold text-[#163e43] shadow"><b className="block">{stop.name}</b><small className="font-normal text-black/45">{stop.note}</small></span>
      </a>)}
      <div className="absolute bottom-4 right-4 flex items-center gap-1 rounded-full bg-white/90 px-3 py-2 text-[10px] font-bold text-[#0b5360]"><ExternalLink size={12}/> OpenStreetMap에서 열기</div>
    </div>
    <p className="px-2 pt-4 text-xs leading-5 text-white/55">실선은 현지 육상 이동, 점선은 Sydney → Melbourne 국내선입니다. 각 번호를 누르면 실제 지도 좌표가 열립니다.</p>
  </section>;
}
