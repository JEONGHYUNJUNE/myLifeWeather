"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import {
  BookOpen,
  CalendarDays,
  Check,
  Sparkles,
  Users,
  X,
} from "lucide-react";

const GUIDE_KEY = "life-weather-fitness-hide-guide-v1";
const GuideContext = createContext({ show: () => {}, ready: false });
const steps = [
  {
    icon: Users,
    title: "내 이름을 선택해요",
    text: "현준은 헬스·근력운동, 유진은 필라테스·러닝. 두 사람의 기록은 따로 저장돼요.",
  },
  {
    icon: CalendarDays,
    title: "주차와 실제 운동 날짜를 골라요",
    text: "이전·다음 주로 이동하고 운동 카드를 펼쳐요. 해당 주 안에서 실제 운동한 날짜를 선택해 주세요.",
  },
  {
    icon: Check,
    title: "한 세트씩, 한 번씩 체크해요",
    text: "현준은 세트를 모두 체크하면 운동 완료! 첫 2주는 종목별 2세트예요. 유진은 수업·러닝 완료 버튼을 눌러요. 러닝 시간과 거리는 선택이에요.",
  },
  {
    icon: Sparkles,
    title: "운동이 쌓이면 캐릭터도 자라요",
    text: "현준은 A+B, 유진은 주 2회가 기본 목표예요. 누적 목표는 각자 30회! 선택 운동도 성장률에 포함되고, 체크를 취소하면 기록도 되돌아가요.",
  },
];

export function FitnessGuideProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [error, setError] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    let hide = false;
    try {
      hide = localStorage.getItem(GUIDE_KEY) === "true";
    } catch {}
    setHidden(hide);
    setOpen(!hide);
    setReady(true);
  }, []);
  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (!open) {
      if (element.open) element.close();
      return;
    }
    if (!element.open) element.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);
  function changePreference(value: boolean) {
    setHidden(value);
    try {
      localStorage.setItem(GUIDE_KEY, String(value));
      setError("");
    } catch {
      setError(
        "설정을 저장하지 못했어요. 다음 방문에 안내가 다시 나올 수 있어요.",
      );
    }
  }
  return (
    <GuideContext.Provider value={{ show: () => setOpen(true), ready }}>
      {children}
      <dialog
        ref={dialog}
        className="fitness-guide"
        aria-labelledby="fitness-guide-title"
        aria-describedby="fitness-guide-intro"
        onCancel={(event) => {
          event.preventDefault();
          setOpen(false);
        }}
      >
        <div className="fitness-guide-heading">
          <span>OUR LITTLE ROUTINE</span>
          <button
            type="button"
            aria-label="사용법 닫기"
            onClick={() => setOpen(false)}
          >
            <X size={20} />
          </button>
        </div>
        <h2 id="fitness-guide-title">운동 기록, 이렇게 시작해요</h2>
        <p id="fitness-guide-intro">
          날짜를 고르고, 체크하면 끝. 작은 운동을 함께 쌓아요.
        </p>
        <ol className="fitness-guide-steps">
          {steps.map(({ icon: Icon, title, text }, i) => (
            <li key={title}>
              <span className="fitness-guide-icon">
                <Icon size={19} />
              </span>
              <div>
                <h3>
                  {i + 1}. {title}
                </h3>
                <p>{text}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="fitness-guide-note">
          기록은 이 브라우저에 자동 저장돼요. 사용자 변경을 해도 유지되지만,
          다른 기기와 자동으로 공유되지는 않아요.
        </p>
        <div className="fitness-guide-actions">
          <label>
            <input
              type="checkbox"
              checked={hidden}
              onChange={(event) => changePreference(event.target.checked)}
            />{" "}
            앞으로 보지 않기 <small>이 브라우저에서</small>
          </label>
          {error && (
            <p role="alert" className="fitness-guide-error">
              {error}
            </p>
          )}
          <button
            type="button"
            className="fitness-guide-start"
            onClick={() => setOpen(false)}
          >
            알겠어요, 시작하기 <Check size={17} />
          </button>
          <p>상단 ‘사용법’에서 언제든 다시 볼 수 있어요.</p>
        </div>
      </dialog>
    </GuideContext.Provider>
  );
}
export function FitnessGuideButton() {
  const { show, ready } = useContext(GuideContext);
  return (
    <button
      type="button"
      className="fitness-guide-trigger"
      onClick={show}
      disabled={!ready}
    >
      <BookOpen size={14} /> 사용법
    </button>
  );
}
