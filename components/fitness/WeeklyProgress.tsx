import { Check, Circle } from "lucide-react";
import type { Workout } from "@/data/fitness";
export function WeeklyProgress({
  count,
  achieved,
  bonus,
  workouts,
  done,
}: {
  count: number;
  achieved: boolean;
  bonus: boolean;
  workouts: Workout[];
  done: Workout[];
}) {
  return (
    <div className="fitness-weekly-progress">
      <div className="fitness-row">
        <div>
          <span className="fitness-eyebrow">WEEKLY ROUTINE</span>
          <h3>
            이번 주{" "}
            <strong>
              {count}
              <small> / 3회</small>
            </strong>
          </h3>
        </div>
        <span className={`fitness-status ${achieved ? "achieved" : ""}`}>
          {bonus
            ? "목표 초과 달성!"
            : achieved
              ? "기본 목표 달성!"
              : "주 2회부터 차근차근"}
        </span>
      </div>
      <div
        className="fitness-meter"
        role="progressbar"
        aria-label="주간 운동 진행률"
        aria-valuenow={Math.min(count, 3)}
        aria-valuemin={0}
        aria-valuemax={3}
      >
        <span style={{ width: `${Math.min(count / 3, 1) * 100}%` }} />
      </div>
      <div className="fitness-weekly-chips">
        {workouts.map((w) => {
          const complete = done.some((d) => d.id === w.id);
          return (
            <a
              href={`#workout-${w.id}`}
              key={w.id}
              className={complete ? "done" : ""}
            >
              {complete ? <Check size={13} /> : <Circle size={12} />} {w.name}
              {w.optional && <small>선택</small>}
            </a>
          );
        })}
      </div>
    </div>
  );
}
