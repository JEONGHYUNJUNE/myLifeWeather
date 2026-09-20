"use client";
import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { people, type Person } from "@/data/fitness";
import { FitnessCharacter } from "./FitnessCharacter";

export function WorkoutCelebration({
  person,
  progress,
  stage,
  message,
  onDismiss,
}: {
  person: Person;
  progress: number;
  stage: number;
  message: string;
  onDismiss: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    element.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const timer = window.setTimeout(onDismiss, 2600);
    return () => {
      window.clearTimeout(timer);
      element.close();
      document.body.style.overflow = previousOverflow;
    };
  }, [onDismiss]);
  return (
    <dialog
      ref={dialog}
      className={`fitness-reaction ${person === "yujin" ? "fitness-reaction-active" : ""}`}
      aria-labelledby="fitness-reaction-title"
      aria-describedby="fitness-reaction-description"
      onCancel={(event) => {
        event.preventDefault();
        onDismiss();
      }}
    >
      <button
        className="fitness-reaction-close"
        aria-label="운동 완료 리액션 닫기"
        onClick={onDismiss}
      >
        <X size={19} />
      </button>
      <p className="fitness-reaction-eyebrow">
        ONE MORE WORKOUT, ONE PROUD MOMENT
      </p>
      <div className="fitness-reaction-scene">
        <span className="fitness-reaction-spark spark-one" aria-hidden="true">
          ✦
        </span>
        <span className="fitness-reaction-spark spark-two" aria-hidden="true">
          ✧
        </span>
        <span className="fitness-reaction-spark spark-three" aria-hidden="true">
          ✦
        </span>
        <FitnessCharacter
          person={person}
          progress={progress}
          stage={stage}
          celebrating
        />
      </div>
      <h2 id="fitness-reaction-title">{message}</h2>
      <p id="fitness-reaction-description">
        {people[person].name},{" "}
        {person === "hyunjun"
          ? "한 번 더 단단해진 하루예요."
          : "오늘의 활기 충전 완료!"}
        <br />
        운동 완료 체크가 반영됐어요.
      </p>
      <span className="fitness-reaction-hint">잠시 후 자동으로 닫혀요</span>
    </dialog>
  );
}
