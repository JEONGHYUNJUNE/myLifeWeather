import type { Metadata } from "next";
import { PackingChecklist } from "@/components/trip/PackingChecklist";

export const metadata: Metadata = { title: "호주 여행 준비 체크리스트 · Australia 2027", description: "유진과 현준의 2027 호주 여행 준비물 및 예약 체크리스트" };

export default function ChecklistPage() { return <PackingChecklist/>; }
