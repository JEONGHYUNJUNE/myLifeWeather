import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function TripSubpageHeader({eyebrow,title,description}:{eyebrow:string;title:string;description:string}) {
  return <header className="relative overflow-hidden bg-[#0b5360] px-5 pb-16 pt-6 text-white sm:px-8 sm:pb-20 sm:pt-10"><div className="absolute -right-16 -top-24 h-72 w-72 rounded-full bg-[#efbd58]/25"/><div className="relative mx-auto max-w-6xl"><Link href="/australia-2027" className="inline-flex items-center gap-2 text-xs font-bold text-white/65 hover:text-white"><ArrowLeft size={16}/> 여행 대시보드</Link><p className="mt-12 text-[11px] font-black uppercase tracking-[.2em] text-[#9dd5d0]">{eyebrow}</p><h1 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-6xl">{title}</h1><p className="mt-4 max-w-xl text-sm leading-6 text-white/60">{description}</p></div></header>;
}
