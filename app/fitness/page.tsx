import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Sparkles } from "lucide-react";
import { people } from "@/data/fitness";
import { FitnessCharacter } from "@/components/fitness/FitnessCharacter";
export const metadata: Metadata = {
  title: "누구의 운동을 기록할까요? · 운동의 계절",
  description:
    "현준의 STRONGER, 유진의 ACTIVE. 나의 운동 여정을 선택해 주세요.",
};
export default function FitnessPage() {
  return (
    <main className="fitness-page fitness-entry">
      <div className="fitness-shell">
        <header className="fitness-header">
          <Link href="/">
            <ArrowLeft size={15} /> 내 인생 날씨
          </Link>
          <span>
            OUR LITTLE ROUTINE <span className="fitness-header-dot" />
          </span>
        </header>
        <div className="fitness-entry-title">
          <p className="fitness-eyebrow">OCT 2026 — JAN 2027</p>
          <Sparkles size={26} />
          <h1>
            함께 쌓는
            <br />
            운동의 계절
          </h1>
          <p>오늘은 누구의 운동을 기록할까요?</p>
        </div>
        <div className="fitness-people">
          {(["hyunjun", "yujin"] as const).map((person) => (
            <Link
              key={person}
              href={`/fitness/${person}`}
              className={`fitness-person-card ${person === "yujin" ? "fitness-active" : ""}`}
              aria-label={`${people[person].name} ${people[person].theme} 대시보드 선택`}
            >
              <div className="fitness-row">
                <span className="fitness-eyebrow">{people[person].theme}</span>
                <ArrowUpRight size={20} />
              </div>
              <FitnessCharacter person={person} progress={0} stage={1} />
              <div className="fitness-person-card-bottom">
                <h2>{people[person].name}</h2>
                <p>
                  {person === "hyunjun"
                    ? "헬스 / 근력운동 중심"
                    : "필라테스 / 러닝 중심"}
                </p>
                <span>나의 운동 시작하기 →</span>
              </div>
            </Link>
          ))}
        </div>
        <footer className="fitness-footer">
          <p>
            각자의 속도로, 1월까지 30회.
            <br />
            기록과 성장은 사용자별로 따로 저장돼요.
          </p>
        </footer>
      </div>
    </main>
  );
}
