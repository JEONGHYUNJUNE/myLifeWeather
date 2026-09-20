"use client";
import { FitnessGuideButton } from "@/components/fitness/FitnessGuide";
import Link from "next/link";
import { useCallback, useState } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import {
  END,
  START,
  people,
  programs,
  stageMessages,
  type Person,
} from "@/data/fitness";
import {
  dayDifference,
  isComplete,
  updateRecord,
  type WorkoutRecord,
  overallSummary,
  shortDate,
  weekIndex,
  weeks,
  weekSummary,
} from "@/lib/fitness/model";
import { useFitnessController } from "@/lib/fitness/useFitnessController";
import { FitnessCharacter } from "./FitnessCharacter";
import { JourneyProgress } from "./JourneyProgress";
import { WeeklyProgress } from "./WeeklyProgress";
import { WorkoutCard } from "./WorkoutCard";
import { WorkoutCelebration } from "./WorkoutCelebration";

export function FitnessDashboard({ person }: { person: Person }) {
  const c = useFitnessController(person);
  const user = people[c.person];
  const overall = overallSummary(c.store, c.person);
  const weekly = weekSummary(c.store, c.person, c.week);
  const currentIndex = c.today ? weekIndex(c.today) : 0;
  const currentWeekly = weekSummary(c.store, c.person, weeks[currentIndex]);
  const [celebration, setCelebration] = useState<{ message: string } | null>(
    null,
  );
  const dismissCelebration = useCallback(() => setCelebration(null), []);
  function saveWithReaction(id: string, patch: Partial<WorkoutRecord>) {
    const workout = programs[c.person].find((item) => item.id === id)!;
    const before = c.store.records[c.person][c.week.id]?.[id];
    const next = updateRecord(c.store, c.person, c.week, id, patch);
    c.saveRecord(id, patch);
    if (
      !isComplete(workout, before, c.week) &&
      isComplete(workout, next.records[c.person][c.week.id]?.[id], c.week)
    ) {
      const nextOverall = overallSummary(next, c.person);
      const nextWeekly = weekSummary(next, c.person, c.week);
      setCelebration({
        message:
          nextOverall.progress === 100 && overall.progress < 100
            ? "30회 달성! 여기까지 해냈어요"
            : nextWeekly.bonus
              ? "이번 주 목표 초과 달성!"
              : nextWeekly.achieved
                ? "이번 주 목표 달성!"
                : "오늘도 해냈다!",
      });
    }
  }
  if (!c.ready)
    return (
      <main className="fitness-page">
        <div className="fitness-shell">
          <p role="status">운동 여정을 불러오는 중이에요…</p>
        </div>
      </main>
    );
  const days = dayDifference(END, c.today);
  const message =
    overall.progress === 100
      ? "1월 목표 도착!"
      : c.today < START
        ? "10월, 시작해볼까?"
        : c.today > END
          ? "우리의 운동 여정을 돌아봐요"
          : currentWeekly.bonus
            ? "이번 주 목표 초과 달성!"
            : currentWeekly.achieved
              ? "이번 주 목표 달성!"
              : currentIndex === weeks.length - 1
                ? "마지막 주! 끝까지 함께"
                : currentWeekly.count === 1
                  ? "좋아, 한 번 더!"
                  : "이번 주 첫 운동을 시작해보자";
  return (
    <main
      data-prevent-auto-refresh={c.storageError ? "true" : undefined}
      className={`fitness-page ${c.person === "yujin" ? "fitness-active" : ""}`}
    >
      <div className="fitness-shell">
        <header className="fitness-header">
          <Link href="/fitness">
            <ArrowLeft size={15} /> 사용자 변경
          </Link>
          <FitnessGuideButton />
        </header>
        <div className="fitness-title-row">
          <div>
            <p className="fitness-eyebrow">OCT 2026 — JAN 2027</p>
            <h1>{user.name}의 운동의 계절</h1>
          </div>
          <Sparkles size={23} />
        </div>
        <section className="fitness-hero" aria-label="운동 성장 대시보드">
          <div className="fitness-hero-top">
            <span className="fitness-eyebrow">
              {user.name}의 작은 성장 기록
            </span>
            <span className="fitness-stage">STAGE {overall.stage} / 5</span>
          </div>
          <h2>
            {user.theme}
            <span> everyday.</span>
          </h2>
          <p className="fitness-tagline">{user.tagline}</p>
          <FitnessCharacter
            person={c.person}
            progress={overall.progress}
            stage={overall.stage}
          />
          <div
            className="fitness-stage-message fitness-stage-change"
            key={overall.stage}
            aria-live="polite"
          >
            <Sparkles size={14} />
            {stageMessages[overall.stage - 1]}
          </div>
          <JourneyProgress
            store={c.store}
            person={c.person}
            current={currentIndex}
            selected={c.index}
            onSelect={c.selectWeek}
          />
          <div className="fitness-hero-bottom">
            <div>
              <span className="fitness-eyebrow">운동 달성률</span>
              <p
                className="fitness-percent fitness-progress-change"
                key={overall.total}
              >
                {Number(overall.progress.toFixed(1))}
                <span>%</span>
              </p>
            </div>
            <div className="fitness-hero-copy">
              <span className="fitness-countdown">
                {days > 0
                  ? `목표까지 D-${days}`
                  : days === 0
                    ? "오늘은 목표일!"
                    : "2027. 1. 15 · 여정 종료"}
              </span>
              <p>{message}</p>
              <small>
                누적 운동 {overall.total} / {overall.target}회 · 모든 완료 운동
                포함
              </small>
            </div>
          </div>
          <div className="fitness-overall-progress">
            <div
              className="fitness-meter"
              role="progressbar"
              aria-label="전체 누적 운동 달성률"
              aria-valuenow={overall.progress}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <span style={{ width: `${overall.progress}%` }} />
            </div>
            <p>주간 목표와 별개로, 완료한 운동이 모두 쌓여요.</p>
          </div>
          <div className="fitness-stats">
            <span>
              완료한 주{" "}
              <b>
                {overall.completedWeeks} / {weeks.length}
              </b>
            </span>
            <span>
              총 운동 <b>{overall.total}회</b>
            </span>
            <span>
              기간 진행{" "}
              <b>
                {c.today < START
                  ? "시작 전"
                  : c.today > END
                    ? "종료"
                    : `${currentIndex + 1} / ${weeks.length}주`}
              </b>
            </span>
          </div>
        </section>

        <section className="fitness-week-section" aria-label="주차별 운동 기록">
          <div className="fitness-week-title">
            <div>
              <p className="fitness-eyebrow">ONE WEEK AT A TIME</p>
              <h2>이번 주의 작은 약속</h2>
            </div>
            <button onClick={() => c.selectWeek(currentIndex)}>
              현재 주로
            </button>
          </div>
          <div className="fitness-week-picker">
            <button
              aria-label="이전 주"
              disabled={c.index === 0}
              onClick={() => c.selectWeek(c.index - 1)}
            >
              <ChevronLeft size={20} />
            </button>
            <div>
              <b>{c.week.number}주차</b>
              <span>
                {shortDate(c.week.start)} — {shortDate(c.week.end)}
              </span>
            </div>
            <button
              aria-label="다음 주"
              disabled={c.index === weeks.length - 1}
              onClick={() => c.selectWeek(c.index + 1)}
            >
              <ChevronRight size={20} />
            </button>
          </div>
          <WeeklyProgress
            count={weekly.count}
            achieved={weekly.achieved}
            bonus={weekly.bonus}
            workouts={programs[c.person]}
            done={weekly.done}
          />
          <div className="fitness-week-note">
            {c.person === "hyunjun"
              ? c.week.number <= 2
                ? "🌱 적응 기간 · 모든 종목을 2세트씩. A + B면 기본 목표 달성!"
                : "A + B는 필수, C는 여유 있을 때. 주 2회부터 꾸준히."
              : "필라테스 1~2회 + 러닝 1~2회. 합계 2회면 기본 목표 달성!"}
          </div>
          <div
            className="fitness-workout-list"
            key={`${c.person}-${c.week.id}`}
          >
            {programs[c.person].map((workout) => (
              <WorkoutCard
                key={workout.id}
                workout={workout}
                week={c.week}
                record={c.store.records[c.person][c.week.id]?.[workout.id]}
                save={(patch) => saveWithReaction(workout.id, patch)}
              />
            ))}
          </div>
        </section>
        <section className="fitness-goals">
          <div className="fitness-row">
            <div>
              <p className="fitness-eyebrow">MY JANUARY GOAL</p>
              <h2>1월에 만나고 싶은 나</h2>
            </div>
            <ArrowUpRight size={24} />
          </div>
          <p className="fitness-goal-focus">{user.focus}</p>
          <div className="fitness-metrics">
            {user.metrics.map((metric) => (
              <div key={metric.name}>
                <span>{metric.name}</span>
                <p>
                  {metric.now}
                  <ArrowUpRight size={13} />
                </p>
                <b>{metric.goal}</b>
              </div>
            ))}
          </div>
          <p className="fitness-goal-caption">
            현재 수치 → 2027. 1. 15 목표 · 운동 달성률은 신체 변화와 별개예요.
          </p>
        </section>
        <footer className="fitness-footer">
          <span role="status">
            {c.storageError || "✓ 이 브라우저에 자동 저장됨"}
          </span>
          <p>
            2026. 10. 1 — 2027. 1. 15 · 첫 주와 마지막 주를 포함한{" "}
            {weeks.length}주<br />
            기기 간 동기화 없이, 지금 사용하는 브라우저에 기록이 남아요.
          </p>
        </footer>
      </div>
      {celebration && (
        <WorkoutCelebration
          person={c.person}
          progress={overall.progress}
          stage={overall.stage}
          message={celebration.message}
          onDismiss={dismissCelebration}
        />
      )}
    </main>
  );
}
