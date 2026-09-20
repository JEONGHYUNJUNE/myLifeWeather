import { Check, ChevronDown, CalendarDays, Timer, Route } from "lucide-react";
import { runningPlans, type Workout } from "@/data/fitness";
import {
  dateLabel,
  emptyRecord,
  isComplete,
  setCount,
  type Week,
  type WorkoutRecord,
} from "@/lib/fitness/model";
export function WorkoutCard({
  workout,
  record = emptyRecord(),
  week,
  save,
}: {
  workout: Workout;
  record?: WorkoutRecord;
  week: Week;
  save: (patch: Partial<WorkoutRecord>) => void;
}) {
  const complete = isComplete(workout, record, week);
  const total = workout.exercises.reduce((n, ex) => n + setCount(ex, week), 0);
  const checked = workout.exercises.reduce(
    (n, ex) =>
      n +
      Array.from(
        { length: setCount(ex, week) },
        (_, i) => record.sets[ex.id]?.[i],
      ).filter(Boolean).length,
    0,
  );
  const running = runningPlans[(record.date || week.start).slice(5, 7)];
  return (
    <details
      id={`workout-${workout.id}`}
      className={`fitness-workout ${complete ? "complete" : ""}`}
      open={undefined}
    >
      <summary>
        <span className="fitness-workout-letter">
          {complete ? (
            <Check size={23} />
          ) : workout.kind === "weights" ? (
            workout.id.toUpperCase()
          ) : workout.kind === "pilates" ? (
            "P"
          ) : (
            "R"
          )}
        </span>
        <span className="fitness-workout-heading">
          <span className="fitness-row">
            <b>{workout.name}</b>
            <span className="fitness-tag">
              {workout.optional
                ? "선택"
                : workout.kind === "weights"
                  ? "필수"
                  : "추천"}
            </span>
          </span>
          <small>{workout.subtitle}</small>
          <span className="fitness-record-caption">
            {record.date ? dateLabel(record.date) : "운동 날짜를 선택해 주세요"}
            {workout.kind === "weights"
              ? record.completionMode === "simple"
                ? complete
                  ? " · 완료 · 간단 기록"
                  : " · 아직 운동 전"
                : ` · ${checked}/${total}세트`
              : complete
                ? " · 완료"
                : ""}
          </span>
        </span>
        <ChevronDown size={17} className="fitness-chevron" />
      </summary>
      <div className="fitness-workout-body">
        <label className="fitness-date-label">
          <span>
            <CalendarDays size={15} /> 운동 날짜
          </span>
          <select
            aria-label={`${workout.name} 운동 날짜`}
            value={record.date}
            onChange={(e) => save({ date: e.target.value })}
          >
            <option value="">날짜 선택</option>
            {week.dates.map((date) => (
              <option key={date} value={date}>
                {dateLabel(date)}
              </option>
            ))}
          </select>
        </label>
        {!record.date && (
          <p className="fitness-hint">
            날짜를 먼저 고르면 운동을 체크할 수 있어요.
          </p>
        )}
        {workout.kind === "weights" ? (
          <>
            <label className="fitness-simple-check">
              <input
                type="checkbox"
                disabled={!record.date}
                checked={complete}
                aria-label={`${workout.name} 이날 운동했어요`}
                onChange={(event) =>
                  save({
                    completionMode: "simple",
                    completed: event.target.checked,
                  })
                }
              />
              <span>
                <b>이날 운동했어요</b>
                <small>이것만 체크해도 운동 1회로 기록돼요.</small>
              </span>
            </label>
            <details className="fitness-set-details">
              <summary>
                세트별로 기록하기 <small>선택</small>
                <ChevronDown size={16} />
              </summary>
              <div className="fitness-exercises">
                {workout.exercises.map((ex) => {
                  const count = setCount(ex, week);
                  const done = Array.from(
                    { length: count },
                    (_, i) => record.sets[ex.id]?.[i],
                  ).filter(Boolean).length;
                  return (
                    <div key={ex.id} className="fitness-exercise">
                      <div className="fitness-row">
                        <b>
                          {done === count && <Check size={14} />} {ex.name}
                        </b>
                        <small>
                          {done}/{count}
                        </small>
                      </div>
                      <p>
                        {ex.reps || "코어 운동"} · {count}세트
                        {week.number <= 2 ? " · 적응 기간" : ""}
                      </p>
                      <div className="fitness-sets">
                        {Array.from({ length: count }, (_, i) => (
                          <button
                            key={i}
                            disabled={!record.date}
                            aria-label={`${workout.name} ${ex.name} ${i + 1}세트`}
                            aria-pressed={record.sets[ex.id]?.[i] === true}
                            onClick={() => {
                              const values = Array.from(
                                { length: count },
                                (_, j) => record.sets[ex.id]?.[j] === true,
                              );
                              values[i] = !values[i];
                              save({
                                completionMode: "sets",
                                completed: false,
                                sets: { ...record.sets, [ex.id]: values },
                              });
                            }}
                          >
                            {record.sets[ex.id]?.[i] ? (
                              <Check size={16} />
                            ) : (
                              <span>{i + 1}</span>
                            )}
                            <small>{i + 1}세트</small>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </details>
          </>
        ) : (
          <>
            <div className="fitness-activity-note">
              <b>
                {workout.kind === "running" ? running : "필라테스 수업 1회"}
              </b>
              <p>
                {workout.kind === "running"
                  ? "속도보다 꾸준함. 무리 없이 움직여요."
                  : "호흡과 움직임에 집중하는 나만의 시간."}
              </p>
            </div>
            {workout.kind === "running" && (
              <div className="fitness-running-inputs">
                <label>
                  <span>
                    <Timer size={14} /> 시간 · 분 <small>선택</small>
                  </span>
                  <input
                    aria-label={`${workout.name} 운동 시간`}
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="any"
                    placeholder="30"
                    value={record.minutes ?? ""}
                    onChange={(e) => save({ minutes: numeric(e.target.value) })}
                  />
                </label>
                <label>
                  <span>
                    <Route size={14} /> 거리 · km <small>선택</small>
                  </span>
                  <input
                    aria-label={`${workout.name} 거리`}
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="any"
                    placeholder="3.0"
                    value={record.distance ?? ""}
                    onChange={(e) =>
                      save({ distance: numeric(e.target.value) })
                    }
                  />
                </label>
              </div>
            )}
            <button
              className="fitness-complete-button"
              disabled={!record.date}
              aria-pressed={record.completed}
              onClick={() => save({ completed: !record.completed })}
            >
              <Check size={17} />
              {record.completed ? "운동 완료 · 누르면 취소" : "이날 운동했어요"}
            </button>
          </>
        )}
      </div>
    </details>
  );
}
function numeric(value: string) {
  const number = Number(value);
  return value === "" || !Number.isFinite(number) || number < 0
    ? undefined
    : number;
}
