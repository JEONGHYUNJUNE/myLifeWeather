import { CalendarCheck, Map, PlaneTakeoff, TicketCheck } from "lucide-react";
import { trip } from "@/data/trip";

export function TripSummary() {
  return <section className="grid gap-3 py-8 sm:grid-cols-2 lg:grid-cols-4">
    <Item icon={<CalendarCheck/>} label="10 days" value="Jan 22—31"/>
    <Item icon={<Map/>} label="Main route" value={trip.route}/>
    <Item icon={<TicketCheck/>} label="Selected matches" value="Men's QF + SF"/>
    <Item icon={<PlaneTakeoff/>} label="Domestic flights" value="SYD → MEL → SYD"/>
  </section>;
}
function Item({icon,label,value}:{icon:React.ReactNode;label:string;value:string}){return <div className="rounded-2xl border border-black/10 bg-white/65 p-5"><div className="text-[#d06950]">{icon}</div><p className="mt-5 text-[10px] font-bold uppercase tracking-widest text-black/40">{label}</p><b className="mt-1 block text-sm">{value}</b></div>}
