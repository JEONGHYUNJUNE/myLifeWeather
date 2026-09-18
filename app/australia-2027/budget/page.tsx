import type { Metadata } from "next";
import { BudgetSummary } from "@/components/trip/BudgetSummary";
import { TripBottomNav } from "@/components/trip/TripBottomNav";
import { TripSubpageHeader } from "@/components/trip/TripSubpageHeader";

export const metadata: Metadata = { title: "호주 여행 예산 · Australia 2027", description: "유진과 현준의 호주 여행 항목별 수정 가능한 예산" };

export default function BudgetPage() { return <main className="min-h-screen bg-[#f7f2e8] pb-28 text-[#163b41]"><TripSubpageHeader eyebrow="Editable budget" title="2인 여행 예산" description="국제선 항공권을 제외한 숙박·호주 국내선·테니스·식비 예산이며 수정값은 자동 저장돼요."/><div className="relative z-10 mx-auto -mt-5 max-w-6xl px-4 sm:-mt-8 sm:px-8"><BudgetSummary/></div><TripBottomNav/></main>; }
