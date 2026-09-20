import { Check, Footprints } from "lucide-react";
import type { FitnessStore } from "@/lib/fitness/model";
import { weeks, weekSummary } from "@/lib/fitness/model";
import type { Person } from "@/data/fitness";
export function JourneyProgress({
  store,
  person,
  current,
  selected,
  onSelect,
}: {
  store: FitnessStore;
  person: Person;
  current: number;
  selected: number;
  onSelect: (n: number) => void;
}) {
  return (
    <div className="fitness-journey">
      <div className="fitness-months">
        <span>START · 10월</span>
        <span>11월</span>
        <span>12월</span>
        <span>1.15 · GOAL</span>
      </div>
      <div className="fitness-track">
        <div
          className="fitness-traveler"
          style={{ left: `${((current + 0.5) / weeks.length) * 100}%` }}
        >
          <Footprints size={17} />
          <span>지금</span>
        </div>
        {weeks.map((week, i) => {
          const summary = weekSummary(store, person, week);
          return (
            <button
              key={week.id}
              onClick={() => onSelect(i)}
              aria-label={`${week.number}주차 ${summary.bonus ? "추가 달성" : summary.achieved ? "완료" : summary.count ? "부분 완료" : "미완료"}`}
              aria-current={i === selected ? "step" : undefined}
              className={`fitness-checkpoint ${summary.achieved ? "done" : summary.count ? "partial" : ""} ${i === selected ? "selected" : ""}`}
            >
              <span>{summary.achieved ? <Check size={10} /> : ""}</span>
              <small>{week.number}</small>
            </button>
          );
        })}
      </div>
      <p className="fitness-track-caption">
        발자국은 날짜 기준 · 채워진 점은 주간 목표 달성
      </p>
    </div>
  );
}
