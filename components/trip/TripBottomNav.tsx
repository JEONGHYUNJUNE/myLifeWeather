"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, CircleDollarSign, ClipboardCheck, Home, Trophy } from "lucide-react";

const links = [
  { href: "/australia-2027", label: "홈", icon: Home },
  { href: "/australia-2027/schedule", label: "시간표", icon: CalendarDays },
  { href: "/australia-2027/tennis", label: "테니스", icon: Trophy },
  { href: "/australia-2027/budget", label: "예산", icon: CircleDollarSign },
  { href: "/australia-2027/checklist", label: "체크", icon: ClipboardCheck },
];

export function TripBottomNav() {
  const pathname = usePathname();
  return <nav aria-label="호주 여행 메뉴" className="fixed inset-x-2 bottom-2 z-50 mx-auto grid max-w-xl grid-cols-5 rounded-2xl border border-white/20 bg-[#123e4a]/95 p-1.5 text-white shadow-2xl backdrop-blur-md sm:bottom-4">
    {links.map(({href,label,icon:Icon}) => {
      const active = pathname === href;
      return <Link key={href} href={href} aria-current={active ? "page" : undefined} className={`flex min-w-0 flex-col items-center gap-1 rounded-xl px-1 py-2 text-[10px] font-bold transition ${active ? "bg-[#efbd58] text-[#163b41]" : "text-white/60 hover:bg-white/10 hover:text-white"}`}><Icon size={17}/><span className="truncate">{label}</span></Link>;
    })}
  </nav>;
}
