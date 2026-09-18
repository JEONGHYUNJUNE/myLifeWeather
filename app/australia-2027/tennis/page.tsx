import type { Metadata } from "next";
import { AustralianOpenCard } from "@/components/trip/AustralianOpenCard";
import { TripBottomNav } from "@/components/trip/TripBottomNav";
import { TripSubpageHeader } from "@/components/trip/TripSubpageHeader";

export const metadata: Metadata = { title: "Australian Open 관람 계획 · Australia 2027", description: "Australian Open 경기 일정, 좌석과 티켓 예산" };

export default function TennisPage() { return <main className="min-h-screen bg-[#f7f2e8] pb-28 text-[#163b41]"><TripSubpageHeader eyebrow="Australian Open 2027" title="테니스 관람 계획" description="1월 26일 Night 45구역과 1월 29일 Day 54구역, Ground Pass까지 한 화면에서 확인해요."/><div className="relative z-10 mx-auto -mt-5 max-w-6xl px-4 sm:-mt-8 sm:px-8"><AustralianOpenCard/></div><TripBottomNav/></main>; }
