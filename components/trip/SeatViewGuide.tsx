import { Moon, SunMedium } from "lucide-react";
import { trip } from "@/data/trip";

export function SeatViewGuide() {
  return <div className="mt-8">
    <div className="flex items-end justify-between gap-3"><div><p className="text-[10px] font-black uppercase tracking-[.16em] text-[#f2bb4d]">Selected seat views</p><h3 className="mt-1 text-lg font-bold">선택 좌석 예상 시야</h3></div><p className="text-[10px] text-white/35">ILLUSTRATION · NOT ACTUAL VIEW</p></div>
    <div className="mt-4 grid gap-3 sm:grid-cols-2">{trip.australianOpen.selectedSeats.map(seat=><article key={seat.date} className="overflow-hidden rounded-2xl border border-white/10 bg-[#082f38]">
      <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-b from-[#173e4d] to-[#092c34]">
        <div className="absolute inset-x-0 top-0 flex justify-between px-4 pt-3 text-[9px] font-bold text-white/55"><span>{seat.date} · {seat.session}</span><span className="flex items-center gap-1">{seat.view==="sideline"?<Moon size={11}/>:<SunMedium size={11}/>} {seat.shade}</span></div>
        <div className="absolute inset-x-[8%] bottom-[8%] top-[24%] [perspective:420px]">
          {seat.view==="sideline"?<SidelineCourt/>:<BaselineCourt/>}
        </div>
        <span className="absolute bottom-3 right-3 rounded-full bg-[#f2bb4d] px-3 py-1 text-[10px] font-black text-[#153d44]">SECTION {seat.section}</span>
      </div>
      <div className="p-4"><b className="text-sm">{seat.view==="sideline"?"사이드라인 시야":"베이스라인 시야"}</b><p className="mt-1.5 text-[11px] leading-5 text-white/50">{seat.note}</p></div>
    </article>)}</div>
    <p className="mt-3 text-[10px] leading-5 text-white/35">코트 방향을 이해하기 위한 예상도입니다. 실제 높이와 시야는 열 번호, 난간, 카메라 장비 및 지붕 상태에 따라 달라집니다.</p>
  </div>;
}

function SidelineCourt(){return <svg viewBox="0 0 320 150" className="h-full w-full drop-shadow-2xl"><path d="M28 35 L292 35 L315 128 L5 128 Z" fill="#14788a" stroke="#dff8ef" strokeWidth="2"/><path d="M160 35 V128 M17 80 H303 M72 35 L65 128 M248 35 L255 128" stroke="#dff8ef" strokeWidth="1.5" fill="none"/><path d="M9 79 H307" stroke="#152c32" strokeWidth="4"/><circle cx="94" cy="102" r="4" fill="#f2bb4d"/><circle cx="226" cy="55" r="3" fill="#f2bb4d"/></svg>}
function BaselineCourt(){return <svg viewBox="0 0 320 150" className="h-full w-full drop-shadow-2xl"><path d="M64 128 L256 128 L218 28 L102 28 Z" fill="#14788a" stroke="#dff8ef" strokeWidth="2"/><path d="M160 28 V128 M83 78 H237 M123 28 L112 128 M197 28 L208 128" stroke="#dff8ef" strokeWidth="1.5" fill="none"/><path d="M82 77 H238" stroke="#152c32" strokeWidth="4"/><circle cx="160" cy="107" r="4" fill="#f2bb4d"/><circle cx="160" cy="43" r="3" fill="#f2bb4d"/></svg>}
