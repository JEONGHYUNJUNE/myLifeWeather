import Link from "next/link";
import { ArrowUpRight, Plane, Dumbbell, Headphones } from "lucide-react";

const spaces = [
  { href: "/australia-2027", label: "TRAVEL", title: "호주여행 2027", subtitle: "Sydney → Melbourne", description: "여행 일정부터 호텔, 예산과 준비물까지. 함께 떠날 여행을 차근차근 준비해요.", detail: "일정 · 숙소 · 예산 · 체크리스트", icon: Plane, color: "bg-[#e6efed]", ink: "text-[#235c60]" },
  { href: "/fitness", label: "MOVE", title: "운동의 계절", subtitle: "A little stronger, every day.", description: "현준과 유진의 운동 기록. 각자의 속도로 쌓아가는 꾸준한 하루를 만나요.", detail: "운동 루틴 · 기록 · 주간 달성", icon: Dumbbell, color: "bg-[#edeedc]", ink: "text-[#52613a]" },
  { href: "/hey-tablo", label: "LEARN", title: "Hey Tablo 영어 노트", subtitle: "Listen. Read. Make it yours.", description: "영어 한 문장, 한국어 한 문장. 에피소드 속 표현을 읽고 내 이야기로 말해 보세요.", detail: "영한 대본 · 단어와 표현 · GPT 학습", icon: Headphones, color: "bg-[#f1e6dd]", ink: "text-[#85553d]" },
];

export default function HomePage() {
  return <main className="min-h-screen bg-[#f7f5ef] text-[#263d34]">
    <div className="mx-auto max-w-6xl px-5 py-7 sm:px-10 sm:py-10">
      <header className="flex items-center gap-3 border-b border-[#263d34]/15 pb-6">
        <span aria-hidden="true" className="flex h-10 w-10 items-center justify-center rounded-full bg-[#263d34] text-xl text-[#f7f5ef]">C.</span>
        <span className="text-sm font-semibold tracking-wide">Chung-Website</span>
      </header>
      <section className="pb-12 pt-16 sm:pb-16 sm:pt-24">
        <p className="text-xs font-semibold tracking-[.2em] text-[#637b6c]">A PLACE FOR OUR EVERYDAY</p>
        <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">여행도, 운동도,<br />배움도 한곳에서.</h1>
        <p className="mt-6 text-sm leading-7 text-[#67776e] sm:text-base">함께 준비하고, 꾸준히 기록하고, 조금씩 배워가는 공간.<br className="hidden sm:block" /> 오늘 하고 싶은 일부터 시작해 보세요.</p>
      </section>
      <nav aria-label="사이트 모음" className="grid gap-5 md:grid-cols-3">
        {spaces.map(({ href, label, title, subtitle, description, detail, icon: Icon, color, ink }, i) => <Link key={href} href={href} className={`focusable group flex min-h-[340px] flex-col rounded-[26px] p-7 transition hover:-translate-y-1 hover:shadow-lg motion-reduce:transform-none ${color} ${ink}`}>
          <div className="flex items-center justify-between"><span className="text-xs font-bold tracking-[.16em]">0{i + 1} / {label}</span><ArrowUpRight size={22} aria-hidden="true" /></div>
          <Icon className="mb-6 mt-9" size={32} strokeWidth={1.5} aria-hidden="true" />
          <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
          <p className="mt-2 text-xs opacity-75">{subtitle}</p>
          <p className="mb-7 mt-5 text-sm leading-7 opacity-85">{description}</p>
          <p className="mt-auto border-t border-current/20 pt-4 text-xs font-medium">{detail}</p>
        </Link>)}
      </nav>
      <footer className="mt-14 flex flex-wrap justify-between gap-3 border-t border-[#263d34]/15 py-6 text-xs text-[#748279]"><span>Chung-Website</span><span>여행 · 운동 · 배움</span></footer>
    </div>
  </main>;
}
