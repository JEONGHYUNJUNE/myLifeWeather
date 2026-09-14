import type { Metadata } from "next";
import { ScheduleBoard } from "@/components/trip/ScheduleBoard";

export const metadata: Metadata = {title:"호주 여행 시간표 · Australia 2027",description:"Sydney와 Melbourne 10일 여행의 시간별 일정표"};
export default function SchedulePage(){return <ScheduleBoard/>}
