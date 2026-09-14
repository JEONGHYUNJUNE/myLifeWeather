"use client";
import { ExternalLink, Navigation, Trophy } from "lucide-react";
import { trip } from "@/data/trip";

const points = [
  { x: 80, y: 47 },
  { x: 70, y: 42 },
  { x: 62, y: 72 },
  { x: 45, y: 76 },
  { x: 67, y: 63 },
];

const mapHref = (coordinates: readonly [number,number]) =>
    `https://www.openstreetmap.org/?mlat=${coordinates[0]}&mlon=${coordinates[1]}#map=14/${coordinates[0]}/${coordinates[1]}`;

export function TripMap() {
  return <section id="map" className="rounded-[30px] bg-[#0b5360] p-4 text-white shadow-2xl shadow-[#0b5360]/15 sm:p-7">
    <div className="flex items-end justify-between gap-4 px-2 pb-5"><div><p className="text-[11px] font-bold uppercase tracking-[.18em] text-[#9dd5d0]">Illustrated route map</p><h2 className="mt-2 text-2xl font-bold">Sydney에서 Melbourne Park까지</h2></div><Navigation className="text-[#efbd58]"/></div>
    <div className="relative aspect-[4/5] overflow-hidden rounded-[24px] bg-gradient-to-b from-[#b8d9dc] to-[#dce9df] sm:aspect-[16/9]">
      <div className="absolute inset-0 opacity-25" style={{backgroundImage:"radial-gradient(#286570 1px, transparent 1px)",backgroundSize:"18px 18px"}}/>
      <svg viewBox="0 0 100 100" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
        <defs><filter id="map-shadow" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#134650" floodOpacity=".18"/></filter></defs>
        <path d="M16 35 L22 23 L35 18 L47 11 L61 16 L75 14 L87 25 L91 39 L86 51 L83 61 L73 68 L67 82 L56 88 L45 81 L33 83 L26 70 L17 63 L10 50 Z" fill="#eed7a6" stroke="#fff8e7" strokeWidth="2" filter="url(#map-shadow)"/>
        <path d="M17 41 Q25 34 34 32 M34 73 Q44 67 53 70 M72 24 Q79 30 83 38" fill="none" stroke="#d7bd86" strokeWidth="1" strokeLinecap="round" opacity=".8"/>
        <path d="M80 47 Q74 43 70 42" fill="none" stroke="#e8755e" strokeWidth="1.3" strokeLinecap="round"/>
        <path d="M80 47 Q72 57 62 72" fill="none" stroke="#075968" strokeWidth="1.5" strokeDasharray="3 2" strokeLinecap="round"/>
        <path d="M62 72 Q53 75 45 76 M62 72 Q65 67 67 63" fill="none" stroke="#e8755e" strokeWidth="1.3" strokeLinecap="round"/>
      </svg>
      <span className="absolute left-[68%] top-[53%] -rotate-[35deg] rounded-full bg-white/90 px-3 py-1 text-[10px] font-black text-[#0b5360] shadow">✈ SYD → MEL</span>
      {trip.mapStops.map((stop,index) => <a key={stop.name} href={mapHref(stop.coordinates)} target="_blank" rel="noopener noreferrer" aria-label={`${stop.name} OpenStreetMap에서 열기`} className="group absolute z-20 -translate-x-1/2 -translate-y-1/2 touch-manipulation" style={{left:`${points[index].x}%`,top:`${points[index].y}%`}}>
        <span className={`grid h-10 w-10 place-items-center rounded-full border-[3px] border-white text-xs font-black shadow-xl transition group-active:scale-90 sm:h-11 sm:w-11 ${stop.number===5?"bg-[#efb83f] text-[#153d44]":"bg-[#ed795d] text-white"}`}>{stop.number===5?<Trophy size={17}/>:stop.number}</span>
        <span className={`absolute left-1/2 top-12 hidden w-max -translate-x-1/2 rounded-lg px-2.5 py-1.5 text-center text-[10px] font-bold shadow-lg sm:block ${stop.number===5?"bg-[#153d44] text-white":"bg-white text-[#163e43]"}`}><b className="block">{stop.name}</b><small className="font-normal opacity-55">{stop.note}</small></span>
      </a>)}
      <div className="pointer-events-none absolute bottom-3 left-3 rounded-xl bg-white/75 px-3 py-2 text-[9px] font-bold text-[#32636a] backdrop-blur sm:bottom-5 sm:left-5">ILLUSTRATED MAP · NOT TO SCALE</div>
    </div>
    <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-5">{trip.mapStops.map(stop => <a key={stop.number} href={mapHref(stop.coordinates)} target="_blank" rel="noopener noreferrer" className={`flex min-w-0 touch-manipulation items-center gap-2 rounded-xl border px-3 py-3 transition active:scale-[.98] ${stop.number===5?"border-[#efbd58] bg-[#efbd58]/15":"border-white/10 bg-white/10 hover:bg-white/15"}`}><span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-[10px] font-black ${stop.number===5?"bg-[#efbd58] text-[#163e43]":"bg-[#ed795d]"}`}>{stop.number===5?<Trophy size={13}/>:stop.number}</span><span className="min-w-0 flex-1"><b className="block truncate text-[11px]">{stop.name}</b><small className="text-[10px] text-white/45">{stop.note}</small></span><ExternalLink size={12} className="shrink-0 text-white/45"/></a>)}</div>
    <p className="px-2 pt-4 text-xs leading-5 text-white/55">지도와 목록의 장소를 누르면 새 탭에서 실제 OpenStreetMap 위치가 열립니다. 점선은 Sydney → Melbourne 국내선, 트로피는 Australian Open 경기장입니다.</p>
  </section>;
}
