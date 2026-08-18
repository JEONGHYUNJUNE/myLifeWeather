"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  Download,
  MapPin,
  Plus,
  RotateCcw,
  Search,
  Share2,
  ShieldCheck,
  Trash2,
  X,
} from "lucide-react";
import { differenceInCalendarDays, format } from "date-fns";
import { ko } from "date-fns/locale";
import { analyzeWeather, validatePeriods } from "../lib/weather";
import { track } from "../lib/analytics";
import type {
  DailyWeather,
  Residence,
  Result,
  WeatherCategory,
} from "../lib/types";
import { WeatherGlyph } from "../components/icons";
import { CityBars, TempLine, WeatherDonut } from "../components/charts";
const today = () => new Date().toISOString().slice(0, 10);
const shiftDate = (date: string, days: number) => {
  const d = new Date(date + "T12:00:00");
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
};
const uid = () => Math.random().toString(36).slice(2);
const labels: Record<WeatherCategory, string> = {
  sunny: "맑음",
  partly_cloudy: "구름 조금",
  cloudy: "흐림",
  rainy: "비",
  snowy: "눈",
  unknown: "미분류",
};

type Geo = {
  id: number;
  name: string;
  country: string;
  admin1?: string;
  latitude: number;
  longitude: number;
};

type Season = "spring" | "summer" | "autumn" | "winter";

const seasonLabels: Record<Season, string> = {
  spring: "봄",
  summer: "여름",
  autumn: "가을",
  winter: "겨울",
};

const seasonEmoji: Record<Season, string> = {
  spring: "🌸",
  summer: "☀️",
  autumn: "🍂",
  winter: "❄️",
};

const chapterOptions = [
  "유년기",
  "초등학생",
  "중·고등학생",
  "대학생",
  "군생활",
  "첫 직장",
  "직장생활",
  "연애",
  "신혼",
] as const;
export default function Home() {
  const [step, setStep] = useState(0);
  const [birthdate, setBirthdate] = useState("");
  const [residences, setResidences] = useState<Residence[]>([]);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  const [activeCity, setActiveCity] = useState("");
  const [birthPlace, setBirthPlace] = useState<Geo | null>(null);
  const [favoriteSeason, setFavoriteSeason] = useState<Season | "">("");
  const [chapters, setChapters] = useState<Record<string, string>>({});
  const [analysisDays, setAnalysisDays] = useState<DailyWeather[]>([]);
  const [birthDayWeather, setBirthDayWeather] = useState<DailyWeather | null>(null);
  useEffect(() => {
    try {
      const d = JSON.parse(localStorage.getItem("life-weather-draft") || "{}");
      if (d.birthdate) setBirthdate(d.birthdate);
      if (d.residences) setResidences(d.residences);
      if (d.birthPlace) setBirthPlace(d.birthPlace);
      if (d.favoriteSeason) setFavoriteSeason(d.favoriteSeason);
      if (d.chapters) setChapters(d.chapters);
    } catch {}
  }, []);
  useEffect(() => {
    if (birthdate || residences.length)
      localStorage.setItem(
          "life-weather-draft",
          JSON.stringify({ birthdate, residences, birthPlace, favoriteSeason, chapters }),
      );
  }, [birthdate, residences, birthPlace, favoriteSeason, chapters]);
  const go = (n: number) => {
    setError("");
    setStep(n);
    scrollTo({ top: 0, behavior: "smooth" });
  };
  const clear = () => {
    localStorage.removeItem("life-weather-draft");
    localStorage.removeItem("life-weather-summary");

    setBirthdate("");
    setResidences([]);
    setBirthPlace(null);
    setFavoriteSeason("");
    setChapters({});
    setAnalysisDays([]);
    setBirthDayWeather(null);
    setResult(null);

    setProgress(0);
    setActiveCity("");
    setError("");
    setStep(0);

    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };
  async function analyze() {
    const v = validatePeriods(residences);
    if (v.overlaps.length) {
      setError("생활 기간이 서로 겹쳐 있어요. 날짜를 다시 확인해주세요.");
      return;
    }
    setStep(4);
    track("analysis_started");
    let all: DailyWeather[] = [];
    try {
      for (let i = 0; i < residences.length; i++) {
        const r = residences[i];
        setActiveCity(r.name);
        setProgress(Math.round((i / residences.length) * 100));
        const request = async (latitude: number, longitude: number) => {
          const response = await fetch("/api/weather", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              latitude,
              longitude,
              startDate: r.startDate,
              endDate: r.isCurrent ? today() : r.endDate,
            }),
          });
          const data = await response.json();
          if (!response.ok) throw new Error(data.error);
          return data.days as DailyWeather[];
        };
        const home = await request(r.latitude, r.longitude);
        let selected: DailyWeather[] = home.map((d) => ({
          ...d,
          city: r.name,
          placeType: "home" as const,
        }));
        if (
            r.useActivity &&
            r.activityName &&
            r.activityLatitude != null &&
            r.activityLongitude != null
        ) {
          setActiveCity(r.activityName);
          const activity = await request(
              r.activityLatitude,
              r.activityLongitude,
          );
          const byDate = new Map(activity.map((d) => [d.date, d]));
          const activeDays = r.activityDays?.length
              ? r.activityDays
              : [1, 2, 3, 4, 5];
          selected = selected.map((d) => {
            const weekday = new Date(d.date + "T12:00:00").getDay();
            const alternate = activeDays.includes(weekday)
                ? byDate.get(d.date)
                : undefined;
            return alternate
                ? {
                  ...alternate,
                  city: r.activityName || r.name,
                  placeType: "activity" as const,
                }
                : d;
          });
        }
        all = all.concat(selected);
        setProgress(Math.round(((i + 1) / residences.length) * 100));
      }
      setAnalysisDays(all);

      if (birthPlace) {
        setActiveCity(`${birthPlace.name} · 태어난 날`);
        try {
          const response = await fetch("/api/weather", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              latitude: birthPlace.latitude,
              longitude: birthPlace.longitude,
              startDate: birthdate,
              endDate: birthdate,
            }),
          });
          const data = await response.json();
          if (response.ok && data.days?.[0]) {
            setBirthDayWeather({ ...data.days[0], city: birthPlace.name } as DailyWeather);
          } else {
            setBirthDayWeather(null);
          }
        } catch {
          setBirthDayWeather(null);
        }
      } else {
        setBirthDayWeather(null);
      }

      const out = analyzeWeather(all, birthdate);
      setResult(out);
      localStorage.setItem(
          "life-weather-summary",
          JSON.stringify({
            totalDays: out.totalDays,
            sunnyPercent: out.percentages.sunny,
          }),
      );
      track("analysis_completed", { dayCount: out.totalDays });
      setTimeout(() => go(5), 350);
    } catch (e) {
      track("analysis_failed");
      setError(e instanceof Error ? e.message : "분석에 실패했어요.");
      setStep(4);
    }
  }
  return (
      <main className="paper min-h-screen">
        {step === 0 && (
            <Landing
                onStart={() => {
                  track("test_started");
                  go(1);
                }}
            />
        )}
        {step > 0 && step < 4 && (
            <WizardShell step={step} onBack={() => go(step - 1)} onClear={clear}>
              {step === 1 && (
                  <BirthStep
                      value={birthdate}
                      onChange={setBirthdate}
                      birthPlace={birthPlace}
                      onBirthPlaceChange={setBirthPlace}
                      onNext={() => {
                        if (!birthdate || birthdate > today()) {
                          setError("올바른 생년월일을 입력해주세요.");
                          return;
                        }
                        track("birthdate_completed");
                        if (!residences.length)
                          setResidences([
                            {
                              id: uid(),
                              name: "",
                              country: "",
                              latitude: 0,
                              longitude: 0,
                              startDate: birthdate,
                              endDate: "",
                              isCurrent: false,
                              activityDays: [1, 2, 3, 4, 5],
                            },
                            {
                              id: uid(),
                              name: "",
                              country: "",
                              latitude: 0,
                              longitude: 0,
                              startDate: "",
                              endDate: today(),
                              isCurrent: true,
                              activityDays: [1, 2, 3, 4, 5],
                            },
                          ]);
                        go(2);
                      }}
                      error={error}
                  />
              )}{" "}
              {step === 2 && (
                  <ResidenceStep
                      birthdate={birthdate}
                      items={residences}
                      setItems={setResidences}
                      chapters={chapters}
                      setChapters={setChapters}
                      error={error}
                      onNext={() => {
                        const v = validatePeriods(residences);
                        if (!residences.length || residences.some((r) => !r.name)) {
                          setError("모든 거주 도시를 선택해주세요.");
                          return;
                        }
                        if (v.overlaps.length) {
                          setError("겹치는 거주 기간이 있어요. 날짜를 확인해주세요.");
                          return;
                        }
                        go(3);
                      }}
                  />
              )}
              {step === 3 && (
                  <Confirm
                      birthdate={birthdate}
                      items={residences}
                      birthPlace={birthPlace}
                      favoriteSeason={favoriteSeason}
                      setFavoriteSeason={setFavoriteSeason}
                      chapters={chapters}
                      onAnalyze={analyze}
                      error={error}
                  />
              )}
            </WizardShell>
        )}
        {step === 4 && (
            <Loading
                progress={progress}
                city={activeCity}
                error={error}
                onRetry={analyze}
                onBack={() => go(3)}
            />
        )}{" "}
        {step === 5 && result && (
            <Dashboard
                result={result}
                birthdate={birthdate}
                onReset={clear}
                days={analysisDays}
                birthDayWeather={birthDayWeather}
                birthPlace={birthPlace}
                favoriteSeason={favoriteSeason}
                residences={residences}
                chapters={chapters}
            />
        )}
      </main>
  );
}

function Logo() {
  return (
      <div className="flex items-center gap-2 font-display text-lg tracking-[-.02em]">
      <span className="grid h-8 w-8 place-items-center rounded-full bg-sun">
        ☀
      </span>
        내 인생 날씨
      </div>
  );
}
function Landing({ onStart }: { onStart: () => void }) {
  return (
      <div className="mx-auto max-w-6xl px-5 sm:px-7">
        <header className="flex items-center justify-between py-5 sm:py-6">
          <Logo />
          <span className="label hidden sm:block">Personal climate archive</span>
        </header>
        <section className="grid items-center gap-9 pb-14 pt-8 sm:gap-12 sm:py-14 md:min-h-[78vh] md:grid-cols-[1.12fr_.88fr]">
          <div className="fade">
            <p className="label mb-4 sm:mb-5">당신만의 기후 연감</p>
            <h1 className="whitespace-nowrap font-display text-[40px] font-normal leading-[1.28] tracking-[-.055em] min-[390px]:text-[43px] sm:text-6xl sm:leading-[1.22]">
              나는 어떤 날씨 속에서
              <br />
              <span className="relative">
              살아왔을까?
              <i className="absolute bottom-0 left-0 -z-10 h-3 w-full -rotate-1 rounded-full bg-sun/60 sm:h-4" />
            </span>
            </h1>
            <p className="mt-5 max-w-xl break-keep text-[15px] leading-7 text-ink/60 sm:mt-7 sm:text-base sm:leading-8">
              태어난 날부터 오늘까지 살아온 지역을 입력하면, 인생의 맑은 날과
              비·눈·더위·추위를 분석해드려요.
            </p>
            <div className="mt-5 flex flex-wrap gap-2 text-[11px] font-bold text-ink/60 sm:hidden">
              <span className="rounded-full border border-ink/10 bg-white/60 px-3 py-2">약 3분 소요</span>
              <span className="rounded-full border border-ink/10 bg-white/60 px-3 py-2">인생 날씨 그래프</span>
              <span className="rounded-full border border-ink/10 bg-white/60 px-3 py-2">무료 분석</span>
            </div>
            <button
                onClick={onStart}
                className="focusable mt-7 flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-ink px-7 font-bold text-white shadow-xl transition hover:-translate-y-1 sm:mt-9 sm:w-auto sm:rounded-full"
            >
              내 인생 날씨 확인하기 <ArrowRight size={18} />
            </button>
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-ink/50 sm:mt-6 sm:justify-start sm:text-sm">
              <ShieldCheck size={17} />
              입력 정보는 계정이나 서버에 저장되지 않아요
            </div>
          </div>
          <div className="relative mx-auto w-[94%] max-w-sm rotate-[1deg] sm:w-full sm:rotate-[1.5deg]">
            <div className="card p-6 sm:p-7">
              <div className="mb-8 flex items-start justify-between sm:mb-12">
                <div>
                  <p className="label">My life weather</p>
                  <p className="mt-2 text-sm text-ink/50">1993 — 2026</p>
                </div>
                <WeatherGlyph size={40} />
              </div>
              <p className="font-display text-[22px] leading-relaxed sm:text-2xl">
                “내 인생의 <strong className="text-4xl">56%</strong>는<br />
                맑았습니다.”
              </p>
              <div className="mt-9 grid grid-cols-3 gap-2 border-t border-ink/10 pt-5 text-center">
                <Mini n="6,833" t="맑은 날" />
                <Mini n="2,174" t="비 온 날" />
                <Mini n="412" t="눈 온 날" />
              </div>
            </div>
            <div className="absolute -right-3 -top-3 -z-10 h-full w-full rounded-3xl bg-sun/45" />
          </div>
        </section>
        <footer className="border-t border-ink/10 py-7 text-xs text-ink/45">
          © {new Date().getFullYear()} 내 인생 날씨
        </footer>
      </div>
  );
}
function Mini({ n, t }: { n: string; t: string }) {
  return (
      <div>
        <b className="block text-base">{n}</b>
        <span className="text-xs text-ink/50">{t}</span>
      </div>
  );
}
function WizardShell({
                       step,
                       onBack,
                       onClear,
                       children,
                     }: {
  step: number;
  onBack: () => void;
  onClear: () => void;
  children: React.ReactNode;
}) {
  return (
      <div className="mx-auto min-h-screen max-w-2xl px-5 py-6">
        <header className="flex items-center justify-between">
          <button
              onClick={onBack}
              className="focusable rounded-full p-2 hover:bg-black/5"
              aria-label="이전"
          >
            <ArrowLeft />
          </button>
          <Logo />
          <button
              onClick={onClear}
              className="focusable text-xs text-ink/50 underline"
          >
            입력 삭제
          </button>
        </header>
        <div className="my-10 flex gap-2" aria-label={`3단계 중 ${step}단계`}>
          {[1, 2, 3].map((n) => (
              <i
                  key={n}
                  className={`h-1 flex-1 rounded ${n <= step ? "bg-ink" : "bg-ink/10"}`}
              />
          ))}
        </div>
        <div className="fade">{children}</div>
      </div>
  );
}
const Primary = ({
                   children,
                   onClick,
                   disabled = false,
                 }: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) => (
    <button
        disabled={disabled}
        onClick={onClick}
        className="focusable flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-ink font-bold text-white disabled:opacity-40"
    >
      {children}
      <ChevronRight size={18} />
    </button>
);

function BirthStep({
                     value,
                     onChange,
                     birthPlace,
                     onBirthPlaceChange,
                     onNext,
                     error,
                   }: {
  value: string;
  onChange: (s: string) => void;
  birthPlace: Geo | null;
  onBirthPlaceChange: (place: Geo | null) => void;
  onNext: () => void;
  error: string;
}) {
  const [placeQuery, setPlaceQuery] = useState(birthPlace?.name || "");
  const [placeResults, setPlaceResults] = useState<Geo[]>([]);
  const [placeBusy, setPlaceBusy] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numbers = e.target.value.replace(/\D/g, "").slice(0, 8);
    if (numbers.length === 8) {
      onChange(`${numbers.slice(0, 4)}-${numbers.slice(4, 6)}-${numbers.slice(6, 8)}`);
      return;
    }
    let formatted = numbers;
    if (numbers.length > 4) formatted = `${numbers.slice(0, 4)}.${numbers.slice(4)}`;
    if (numbers.length > 6) formatted = `${numbers.slice(0, 4)}.${numbers.slice(4, 6)}.${numbers.slice(6)}`;
    onChange(formatted);
  };

  const searchBirthPlace = async () => {
    if (placeQuery.trim().length < 2) return;
    setPlaceBusy(true);
    try {
      const response = await fetch(`/api/geocode?name=${encodeURIComponent(placeQuery)}`);
      const data = await response.json();
      setPlaceResults(response.ok ? data.results || [] : []);
    } finally {
      setPlaceBusy(false);
    }
  };

  const inputValue = value.includes("-") ? value.replaceAll("-", ".") : value;

  return (
      <section>
        <p className="label">Step 01</p>
        <h1 className="mt-3 font-serif text-4xl font-bold">언제 태어나셨나요?</h1>
        <p className="mt-4 text-ink/55">당신의 첫 번째 날씨부터 여행을 시작할게요.</p>

        <div className="card my-8 min-w-0 overflow-hidden p-6">
          <label className="mb-3 block text-sm font-bold" htmlFor="birthdate">생년월일</label>
          <input
              id="birthdate"
              type="text"
              inputMode="numeric"
              autoComplete="bday"
              placeholder="YYYY.MM.DD"
              value={inputValue}
              onChange={handleChange}
              maxLength={10}
              className="focusable h-14 w-full min-w-0 max-w-full box-border rounded-xl border border-ink/15 bg-white px-4 text-lg tabular-nums"
          />
          <p className="mt-3 text-xs leading-5 text-ink/45">예: 1993.05.21 · 숫자만 입력해도 날짜 형식이 적용돼요.</p>

          <div className="mt-6 border-t border-ink/10 pt-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-bold">태어난 지역 <span className="font-normal text-ink/40">(선택)</span></p>
                <p className="mt-1 text-xs leading-5 text-ink/45">입력하면 당신이 세상에 온 날의 날씨도 찾아드려요.</p>
              </div>
              {birthPlace && (
                  <button type="button" onClick={() => { onBirthPlaceChange(null); setPlaceQuery(""); }} className="shrink-0 text-xs font-bold text-ink/45 underline">지우기</button>
              )}
            </div>

            <div className="relative mt-3 flex min-w-0 gap-2">
              <MapPin className="absolute left-3 top-3.5 text-ink/35" size={18} />
              <input
                  value={placeQuery}
                  onChange={(e) => { setPlaceQuery(e.target.value); if (birthPlace) onBirthPlaceChange(null); }}
                  onKeyDown={(e) => e.key === "Enter" && searchBirthPlace()}
                  placeholder="예: 서울, 부산, Jeju"
                  className="focusable h-12 min-w-0 flex-1 rounded-xl border border-ink/15 bg-white pl-10 pr-3"
              />
              <button type="button" onClick={searchBirthPlace} className="focusable grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-ink text-white" aria-label="출생지역 검색"><Search size={18} /></button>
            </div>
            {placeBusy && <p className="mt-2 text-xs text-ink/45">지역을 찾고 있어요…</p>}
            {placeResults.length > 0 && (
                <div className="mt-2 overflow-hidden rounded-xl border border-ink/10 bg-white">
                  <p className="border-b border-ink/10 bg-cream px-4 py-2 text-[11px] font-bold text-ink/50">아래 도시를 눌러 선택하세요</p>
                  {placeResults.map((x) => (
                      <button type="button" key={x.id} onClick={() => { onBirthPlaceChange(x); setPlaceQuery(x.name); setPlaceResults([]); }} className="focusable flex w-full items-center justify-between border-b border-ink/5 px-4 py-3 text-left text-sm hover:bg-cream">
                        <span><b>{x.name}</b><span className="ml-2 text-ink/45">{[x.admin1, x.country].filter(Boolean).join(", ")}</span></span>
                        <span className="rounded-full bg-ink/5 px-2 py-1 text-[10px] font-bold">선택</span>
                      </button>
                  ))}
                </div>
            )}
            {birthPlace && (
                <div className="mt-3 rounded-xl border border-moss/20 bg-moss/10 p-4">
                  <p className="text-[11px] font-bold text-moss"><Check className="mr-1 inline" size={14} />출생지역 선택 완료</p>
                  <p className="mt-1 text-lg font-bold">{birthPlace.name}</p>
                  <p className="mt-1 text-xs text-ink/45">{birthPlace.admin1 ? `${birthPlace.admin1} · ` : ""}{birthPlace.country}</p>
                </div>
            )}
          </div>

          <p className="mt-5 text-xs leading-5 text-ink/40">현재 분석 가능한 과거 자료 범위를 고려해 최근 100년 이내로 입력해주세요.</p>
        </div>

        {error && <ErrorText text={error} />}
        <Primary onClick={onNext} disabled={!/^\d{4}-\d{2}-\d{2}$/.test(value)}>다음으로</Primary>
      </section>
  );
}
function ErrorText({ text }: { text: string }) {
  return (
      <p
          role="alert"
          className="mb-4 rounded-xl bg-red-50 p-4 text-sm text-red-700"
      >
        {text}
      </p>
  );
}
function ResidenceStep({
                         birthdate,
                         items,
                         setItems,
                         chapters,
                         setChapters,
                         error,
                         onNext,
                       }: {
  birthdate: string;
  items: Residence[];
  setItems: (x: Residence[]) => void;
  chapters: Record<string, string>;
  setChapters: (x: Record<string, string>) => void;
  error: string;
  onNext: () => void;
}) {
  const warnings = validatePeriods(items);
  const normalizeCurrent = (list: Residence[]) =>
      list.map((item, index) => ({ ...item, isCurrent: index === list.length - 1, endDate: index === list.length - 1 ? today() : item.endDate }));

  const update = (id: string, p: Partial<Residence>) => {
    const index = items.findIndex((x) => x.id === id);
    if (index === -1) return;
    const next = items.map((x) => ({ ...x }));
    next[index] = { ...next[index], ...p };
    if (Object.prototype.hasOwnProperty.call(p, "endDate") && index < next.length - 1) {
      next[index + 1].startDate = p.endDate ? shiftDate(p.endDate, 1) : "";
    }
    setItems(normalizeCurrent(next));
  };

  const add = () => {
    const next = items.map((x) => ({ ...x }));
    if (next.length) { next[next.length - 1].isCurrent = false; next[next.length - 1].endDate = ""; }
    next.push({ id: uid(), name: "", country: "", latitude: 0, longitude: 0, startDate: "", endDate: today(), isCurrent: true, activityDays: [1,2,3,4,5] });
    setItems(normalizeCurrent(next));
    track("residence_added");
  };

  const remove = (id: string) => {
    const removedIndex = items.findIndex((x) => x.id === id);
    if (removedIndex < 0 || items.length <= 1) return;
    let next = items.filter((x) => x.id !== id).map((x) => ({ ...x }));
    if (removedIndex > 0 && removedIndex < items.length - 1) {
      const prev = next[removedIndex - 1];
      if (prev?.endDate && next[removedIndex]) next[removedIndex].startDate = shiftDate(prev.endDate, 1);
    }
    const nextChapters = { ...chapters };
    delete nextChapters[id];
    setChapters(nextChapters);
    setItems(normalizeCurrent(next));
  };

  return (
      <section>
        <p className="label">Step 02</p>
        <h1 className="mt-3 font-serif text-4xl font-bold">당신의 생활 이력을 알려주세요</h1>
        <p className="mt-4 text-ink/55">도시가 크게 바뀌지 않았어도 괜찮아요. 각 시기에 이름을 붙이면 나중에 ‘대학생 시절의 날씨’처럼 돌아볼 수 있어요.</p>
        <div className="my-8 space-y-4">
          {items.map((r, i) => (
              <ResidenceCard
                  key={r.id}
                  item={r}
                  index={i}
                  min={birthdate}
                  isLast={i === items.length - 1}
                  chapter={chapters[r.id] || ""}
                  setChapter={(chapter) => setChapters({ ...chapters, [r.id]: chapter })}
                  update={(p) => update(r.id, p)}
                  remove={() => remove(r.id)}
              />
          ))}
        </div>
        <button type="button" onClick={add} className="focusable mb-8 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-ink/30 py-4 text-sm font-bold"><Plus size={18} />생활 기간 추가</button>
        {warnings.gaps.length > 0 && <p className="mb-4 rounded-xl bg-amber-50 p-4 text-sm text-amber-800">기간 사이에 비어 있는 구간이 있어요. 이 기간은 분석 일수에서 제외하고 계속할 수 있습니다.</p>}
        {error && <ErrorText text={error} />}
        <Primary onClick={onNext}>입력 내용 확인하기</Primary>
      </section>
  );
}

function LifeChapterField({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const selected = value ? value.split("|").filter(Boolean) : [];
  const customValues = selected.filter((item) => !chapterOptions.includes(item as (typeof chapterOptions)[number]));
  const [custom, setCustom] = useState(customValues[0] || "");
  const toggle = (option: string) => {
    const next = selected.includes(option)
        ? selected.filter((item) => item !== option)
        : [...selected, option];
    onChange(next.join("|"));
  };
  return (
      <div className="mt-5 border-t border-ink/10 pt-5">
        <p className="text-sm font-bold">이 시기는 어떤 때였나요? <span className="font-normal text-ink/40">(복수 선택 가능)</span></p>
        <p className="mt-1 text-xs leading-5 text-ink/45">한 기간에 해당하는 시기를 여러 개 골라도 돼요. 결과에서 시기별 날씨를 따로 보여드릴게요.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {chapterOptions.map((option) => (
              <button key={option} type="button" aria-pressed={selected.includes(option)} onClick={() => toggle(option)} className={`rounded-full border px-3 py-2 text-xs font-bold ${selected.includes(option) ? "border-ink bg-ink text-white" : "border-ink/15 bg-white text-ink/65"}`}>{selected.includes(option) && <Check className="mr-1 inline" size={12}/>} {option}</button>
          ))}
        </div>
        <input
            value={custom}
            onChange={(e) => {
              const nextCustom = e.target.value.replaceAll("|", "");
              setCustom(nextCustom);
              onChange([...selected.filter((item) => chapterOptions.includes(item as (typeof chapterOptions)[number])), ...(nextCustom ? [nextCustom] : [])].join("|"));
            }}
            placeholder="직접 입력 · 예: 취준 시절, 워킹홀리데이"
            className="focusable mt-3 h-11 w-full rounded-lg border border-ink/15 bg-white px-3 text-sm"
        />
        {selected.length > 0 && <p className="mt-2 text-xs font-bold text-moss"><Check className="mr-1 inline" size={14} />{selected.map((item) => `‘${item}’`).join(", ")} 시기로 기록할게요.</p>}
      </div>
  );
}
function DateField({
                     value,
                     onChange,
                     min,
                     max,
                     disabled = false,
                     placeholder = "YYYY.MM.DD",
                   }: {
  value: string;
  onChange: (value: string) => void;
  min?: string;
  max?: string;
  disabled?: boolean;
  placeholder?: string;
}) {
  const formatDisplay = (date: string) => (date ? date.replaceAll("-", ".") : "");
  const [text, setText] = useState(formatDisplay(value));
  useEffect(() => setText(formatDisplay(value)), [value]);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numbers = e.target.value.replace(/\D/g, "").slice(0, 8);
    let formatted = numbers;
    if (numbers.length > 4) formatted = `${numbers.slice(0,4)}.${numbers.slice(4)}`;
    if (numbers.length > 6) formatted = `${numbers.slice(0,4)}.${numbers.slice(4,6)}.${numbers.slice(6)}`;
    setText(formatted);
    if (numbers.length === 8) {
      const iso = `${numbers.slice(0,4)}-${numbers.slice(4,6)}-${numbers.slice(6,8)}`;
      const d = new Date(`${iso}T12:00:00`);
      const valid = !Number.isNaN(d.getTime()) && (!min || iso >= min) && (!max || iso <= max);
      if (valid) onChange(iso);
    } else if (value) onChange("");
  };

  return (
      <div className="relative mt-2 min-w-0">
        <input type="text" inputMode="numeric" placeholder={placeholder} value={disabled && value === today() ? "현재" : text} disabled={disabled} onChange={handleTextChange} maxLength={10} className="focusable h-11 w-full min-w-0 max-w-full box-border rounded-lg border border-ink/15 bg-white pl-3 pr-14 text-[13px] tabular-nums disabled:bg-ink/5 disabled:text-ink/50" />
        {!disabled && (
            <div className="absolute right-1 top-1/2 h-9 w-12 -translate-y-1/2 overflow-hidden rounded-md">
              <span className="pointer-events-none absolute inset-0 grid place-items-center text-[11px] font-bold text-ink/55">달력</span>
              <input
                  type="date"
                  min={min}
                  max={max}
                  value={value}
                  onChange={(e) => { setText(formatDisplay(e.target.value)); onChange(e.target.value); }}
                  aria-label="달력에서 날짜 선택"
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              />
            </div>
        )}
      </div>
  );
}
function ResidenceCard({
                         item,
                         index,
                         min,
                         isLast,
                         chapter,
                         setChapter,
                         update,
                         remove,
                       }: {
  item: Residence;
  index: number;
  min: string;
  isLast: boolean;
  chapter: string;
  setChapter: (chapter: string) => void;
  update: (p: Partial<Residence>) => void;
  remove: () => void;
}) {
  const [q, setQ] = useState(item.name);
  const [found, setFound] = useState<Geo[]>([]);
  const [busy, setBusy] = useState(false);
  const [searchError, setSearchError] = useState("");

  async function search() {
    if (q.trim().length < 2) return;
    setBusy(true);
    setSearchError("");

    try {
      const r = await fetch(`/api/geocode?name=${encodeURIComponent(q)}`);
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);

      const results = d.results || [];
      setFound(results);

      if (!results.length) {
        setSearchError(
            "검색 결과가 없어요. 시·군 이름이나 영문 도시명으로 다시 검색해주세요.",
        );
      }
    } catch (e) {
      setSearchError(e instanceof Error ? e.message : "검색에 실패했어요.");
    } finally {
      setBusy(false);
    }
  }

  return (
      <article className="card min-w-0 overflow-hidden p-5">
        <div className="mb-5 flex items-center justify-between">
        <span className="label">
          Residence {String(index + 1).padStart(2, "0")}
        </span>

          {index > 0 && !isLast && (
              <button
                  type="button"
                  onClick={remove}
                  className="focusable rounded-full p-2 text-ink/40 hover:bg-red-50 hover:text-red-600"
                  aria-label="거주지 삭제"
              >
                <Trash2 size={17} />
              </button>
          )}
        </div>

        <label className="mb-2 block text-sm font-bold">도시 검색</label>
        <div className="relative flex min-w-0 gap-2">
          <MapPin className="absolute left-3 top-3.5 text-ink/35" size={19} />
          <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && search()}
              placeholder="예: 서울, 부산, Jeju"
              className="focusable h-12 min-w-0 flex-1 rounded-xl border border-ink/15 bg-white pl-10 pr-3"
          />
          <button
              type="button"
              onClick={search}
              className="focusable grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-ink text-white"
              aria-label="검색"
          >
            <Search size={18} />
          </button>
        </div>

        {busy && <p className="mt-2 text-xs text-ink/45">도시를 찾고 있어요…</p>}

        {searchError && (
            <p className="mt-2 text-xs text-red-600">
              {searchError}{" "}
              <button type="button" onClick={search} className="underline">
                재시도
              </button>
            </p>
        )}

        {found.length > 0 && (
            <div className="mt-2 overflow-hidden rounded-xl border border-ink/10 bg-white">
              <p className="border-b border-ink/10 bg-cream px-4 py-2 text-[11px] font-bold text-ink/50">검색 결과 · 아래 도시를 눌러 확정하세요</p>
              {found.map((x) => (
                  <button
                      type="button"
                      key={x.id}
                      onClick={() => {
                        update({ name: x.name, country: x.country, latitude: x.latitude, longitude: x.longitude });
                        setQ(x.name);
                        setFound([]);
                      }}
                      className="focusable flex w-full items-center justify-between gap-3 border-b border-ink/5 px-4 py-3 text-left text-sm hover:bg-cream"
                  >
                    <span><b>{x.name}</b><span className="ml-2 text-ink/45">{[x.admin1, x.country].filter(Boolean).join(", ")}</span></span>
                    <span className="shrink-0 rounded-full bg-ink/5 px-2 py-1 text-[10px] font-bold">선택</span>
                  </button>
              ))}
            </div>
        )}

        {item.name && (
            <div className="mt-3 rounded-xl border border-moss/20 bg-moss/10 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[11px] font-bold text-moss"><Check className="mr-1 inline" size={14} />생활지역 선택 완료</p>
                <button type="button" onClick={() => { setQ(""); update({ name: "", country: "", latitude: 0, longitude: 0 }); }} className="text-[11px] font-bold text-ink/40 underline">변경</button>
              </div>
              <p className="mt-1 text-lg font-bold">{item.name}</p>
              <p className="mt-1 text-xs text-ink/45">{item.country}</p>
            </div>
        )}

        <div className="mt-5 grid min-w-0 grid-cols-1 gap-3 min-[390px]:grid-cols-2">
          <label className="min-w-0 text-xs font-bold text-ink/60">
            시작일
            <DateField
                value={item.startDate}
                min={min}
                max={today()}
                onChange={(startDate) => update({ startDate })}
            />
          </label>

          <label className="min-w-0 text-xs font-bold text-ink/60">
            종료일
            <DateField
                value={isLast ? today() : item.endDate}
                min={item.startDate || min}
                max={today()}
                disabled={isLast}
                onChange={(endDate) => update({ endDate })}
            />
          </label>
        </div>

        {isLast && (
            <div className="mt-4 flex items-center gap-2 text-sm">
              <input
                  type="checkbox"
                  checked
                  disabled
                  readOnly
                  className="h-4 w-4 accent-ink"
              />
              <span>현재 거주 중이에요</span>
              <span className="text-xs text-ink/40">· 마지막 생활기간에 자동 적용</span>
            </div>
        )}

        <LifeChapterField value={chapter} onChange={setChapter} />
        <ActivityArea item={item} update={update} />
      </article>
  );
}

function ActivityArea({ item, update }: { item: Residence; update: (p: Partial<Residence>) => void }) {
  const [query, setQuery] = useState(item.activityName || "");
  const [found, setFound] = useState<Geo[]>([]);
  const [busy, setBusy] = useState(false);
  const days = [[1,"월"],[2,"화"],[3,"수"],[4,"목"],[5,"금"],[6,"토"],[0,"일"]] as const;

  async function search() {
    if (query.trim().length < 2) return;
    setBusy(true);
    try {
      const r = await fetch(`/api/geocode?name=${encodeURIComponent(query)}`);
      const d = await r.json();
      setFound(r.ok ? d.results || [] : []);
    } finally { setBusy(false); }
  }

  return (
      <div className="mt-5 border-t border-ink/10 pt-5">
        <button type="button" onClick={() => update({ useActivity: !item.useActivity, activityDays: item.activityDays?.length ? item.activityDays : [1,2,3,4,5] })} className="focusable flex w-full items-center justify-between text-left text-sm font-bold">
          <span>이 기간에 학교나 직장이 다른 지역에 있었나요?</span><span>{item.useActivity ? "−" : "+"}</span>
        </button>
        {item.useActivity && (
            <div className="fade mt-4 rounded-xl bg-cream/70 p-4">
              <p className="mb-4 text-xs leading-5 text-ink/50">잠만 집에서 자고 낮 시간 대부분을 다른 지역에서 보냈다면 추가해 주세요. 선택사항이에요.</p>
              <label className="mb-2 block text-xs font-bold">학교·직장 지역</label>
              <div className="flex min-w-0 gap-2">
                <input value={query} onChange={(e) => { setQuery(e.target.value); if (item.activityName) update({ activityName: "", activityCountry: "", activityLatitude: undefined, activityLongitude: undefined }); }} onKeyDown={(e)=>e.key==="Enter"&&search()} placeholder="예: 강남구, 수원" className="focusable h-11 min-w-0 flex-1 rounded-lg border border-ink/15 bg-white px-3"/>
                <button type="button" onClick={search} className="focusable grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-ink text-white" aria-label="활동지역 검색"><Search size={17}/></button>
              </div>
              {busy && <p className="mt-2 text-xs text-ink/45">지역을 찾고 있어요…</p>}
              {found.length > 0 && <div className="mt-2 overflow-hidden rounded-lg border border-ink/10 bg-white"><p className="border-b border-ink/10 bg-white px-3 py-2 text-[10px] font-bold text-ink/45">아래 지역을 눌러 선택하세요</p>{found.map((x)=><button type="button" key={x.id} onClick={()=>{update({activityName:x.name,activityCountry:x.country,activityLatitude:x.latitude,activityLongitude:x.longitude});setQuery(x.name);setFound([]);}} className="flex w-full items-center justify-between border-b border-ink/5 px-3 py-2 text-left text-xs hover:bg-cream"><span><b>{x.name}</b> · {x.admin1||x.country}</span><span className="rounded-full bg-ink/5 px-2 py-1 text-[9px] font-bold">선택</span></button>)}</div>}
              {item.activityName && <div className="mt-3 rounded-lg border border-moss/20 bg-moss/10 p-3"><p className="text-[10px] font-bold text-moss"><Check className="mr-1 inline" size={13}/>활동지역 선택 완료</p><p className="mt-1 text-sm font-bold">{item.activityName}</p></div>}
              <p className="mb-2 mt-4 text-xs font-bold">이 지역에서 생활한 요일</p>
              <div className="flex flex-wrap gap-2">{days.map(([n,label])=><button type="button" key={n} onClick={()=>{const current=item.activityDays?.length?item.activityDays:[1,2,3,4,5];update({activityDays:current.includes(n)?current.filter(x=>x!==n):[...current,n]});}} className={`focusable grid h-9 w-9 place-items-center rounded-full text-xs font-bold ${(item.activityDays?.length?item.activityDays:[1,2,3,4,5]).includes(n)?"bg-ink text-white":"border border-ink/15 bg-white"}`}>{label}</button>)}</div>
            </div>
        )}
      </div>
  );
}
function Confirm({
                   birthdate,
                   items,
                   birthPlace,
                   favoriteSeason,
                   setFavoriteSeason,
                   chapters,
                   onAnalyze,
                   error,
                 }: {
  birthdate: string;
  items: Residence[];
  birthPlace: Geo | null;
  favoriteSeason: Season | "";
  setFavoriteSeason: (season: Season) => void;
  chapters: Record<string, string>;
  onAnalyze: () => void;
  error: string;
}) {
  const total = items.reduce((n, r) => {
    if (!r.startDate || (!r.isCurrent && !r.endDate)) return n;
    return n + differenceInCalendarDays(new Date((r.isCurrent ? today() : r.endDate) + "T00:00:00"), new Date(r.startDate + "T00:00:00")) + 1;
  }, 0);

  return (
      <section>
        <p className="label">Step 03</p>
        <h1 className="mt-3 font-serif text-4xl font-bold">날씨 여행을 시작할까요?</h1>
        <p className="mt-4 text-ink/55">마지막으로 좋아하는 계절을 하나 골라주세요. 실제로 살아온 날씨와 취향이 얼마나 닮았는지도 보여드릴게요.</p>

        <div className="card my-8 overflow-hidden">
          <div className="bg-ink p-6 text-white">
            <p className="text-sm text-white/60">분석할 총 날짜</p>
            <p className="mt-1 font-serif text-4xl font-bold">{total.toLocaleString()}일</p>
            <p className="mt-2 text-xs text-white/45">{birthdate.replaceAll("-", ".")} — 오늘{birthPlace ? ` · 첫 날씨 ${birthPlace.name}` : ""}</p>
          </div>
          <div className="divide-y divide-ink/10 px-6">
            {items.map((r) => (
                <div key={r.id} className="flex items-center justify-between gap-3 py-5">
                  <div className="min-w-0">
                    <b>{r.name || "도시 미선택"}</b>
                    <p className="mt-1 text-xs text-ink/45">{r.country}</p>
                    {chapters[r.id] && <div className="mt-2 flex flex-wrap gap-1">{chapters[r.id].split("|").filter(Boolean).map((chapter)=><span key={chapter} className="inline-block rounded-full bg-sun/25 px-2.5 py-1 text-[11px] font-bold">{chapter}</span>)}</div>}
                  </div>
                  <p className="shrink-0 text-right text-xs leading-5 text-ink/55">{r.startDate || "-"}<br />— {r.isCurrent ? "현재" : r.endDate || "-"}</p>
                </div>
            ))}
          </div>
        </div>

        <div className="card mb-6 p-6">
          <p className="text-sm font-bold">가장 좋아하는 계절은?</p>
          <p className="mt-1 text-xs leading-5 text-ink/45">정답은 없어요. 결과에서 그 계절과 함께한 실제 날씨를 찾아드려요.</p>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {(Object.keys(seasonLabels) as Season[]).map((season) => (
                <button key={season} type="button" onClick={() => setFavoriteSeason(season)} className={`rounded-xl border p-3 text-center text-sm font-bold ${favoriteSeason === season ? "border-ink bg-ink text-white" : "border-ink/15 bg-white"}`}>
                  <span className="mb-1 block text-2xl">{seasonEmoji[season]}</span>{seasonLabels[season]}
                </button>
            ))}
          </div>
        </div>

        <div className="mb-5 flex items-start gap-3 rounded-xl bg-moss/10 p-4 text-sm leading-6 text-moss">
          <ShieldCheck className="mt-0.5 shrink-0" size={18} />
          <p>입력한 생년월일과 생활 이력은 계정이나 서버 데이터베이스에 저장하지 않습니다. 분석 요청에는 날씨 조회에 필요한 좌표와 기간만 사용합니다.</p>
        </div>
        {error && <ErrorText text={error} />}
        <Primary onClick={onAnalyze}>인생 날씨 분석하기</Primary>
      </section>
  );
}
function Loading({
                   progress,
                   city,
                   error,
                   onRetry,
                   onBack,
                 }: {
  progress: number;
  city: string;
  error: string;
  onRetry: () => void;
  onBack: () => void;
}) {
  return (
      <div className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center px-6 text-center">
        <div className="relative grid h-32 w-32 place-items-center rounded-full bg-sun/25">
          <span className="animate-pulse text-6xl">☀</span>
          <div className="absolute inset-0 rounded-full border border-sun" />
        </div>
        {error ? (
            <>
              <h1 className="mt-8 font-serif text-3xl font-bold">잠시 멈췄어요</h1>
              <ErrorText text={error} />
              <button
                  onClick={onRetry}
                  className="focusable mt-2 flex items-center gap-2 rounded-full bg-ink px-6 py-3 font-bold text-white"
              >
                <RotateCcw size={17} />
                다시 시도
              </button>
              <button onClick={onBack} className="mt-4 text-sm underline">
                입력 확인으로 돌아가기
              </button>
            </>
        ) : (
            <>
              <p className="label mt-10">Analyzing archive</p>
              <h1 className="mt-3 font-serif text-3xl font-bold">
                {city}에서 보낸 날들을
                <br />
                확인하고 있어요.
              </h1>
              <div className="mt-9 h-2 w-full overflow-hidden rounded-full bg-ink/10">
                <div
                    className="h-full rounded-full bg-sun transition-all"
                    style={{ width: `${progress}%` }}
                />
              </div>
              <p className="mt-3 text-sm tabular-nums text-ink/50">
                {progress}% · 날씨 기록을 정리하는 중
              </p>
            </>
        )}
      </div>
  );
}
function Section({
                   eyebrow,
                   title,
                   children,
                 }: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
      <section className="py-12">
        <p className="label">{eyebrow}</p>
        <h2 className="mt-2 font-serif text-3xl font-bold">{title}</h2>
        <div className="mt-7">{children}</div>
      </section>
  );
}
function Stat({
                title,
                value,
                sub,
                icon,
              }: {
  title: string;
  value: string;
  sub: string;
  icon: string;
}) {
  return (
      <div className="card p-5">
        <span className="text-2xl">{icon}</span>
        <p className="mt-5 text-xs text-ink/45">{title}</p>
        <b className="mt-1 block text-xl">{value}</b>
        <p className="mt-1 text-xs text-ink/45">{sub}</p>
      </div>
  );
}
function BirthdayRecord({label,day,value}:{label:string;day?:DailyWeather;value?:number|null}) {
  return <div className="rounded-xl bg-cream/70 p-4">
    <p className="text-xs text-ink/45">{label}</p>
    <p className="mt-1 font-serif text-xl font-bold">{day?.date ? `${day.date.slice(0,4)}년` : "기록 없음"}{value != null ? ` · ${value.toFixed(1)}℃` : ""}</p>
    {day?.date && <p className="mt-1 text-xs text-ink/45">{day.date.replaceAll("-", ".")} · {day.city || "지역 미상"}</p>}
  </div>;
}
type WeatherProfile = {
  title: string | null;
  emoji: string;
  comment: string;
  record: string;
  character: number;
};

function getWeatherProfile(result: Result): WeatherProfile {
  const days = Math.max(result.totalDays, 1);
  const ratio = (value: number) => value / days;
  const cap = (value: number, max = 1) => Math.min(value, max);
  const cloudyPercent = (result.percentages.cloudy || 0) + (result.percentages.partly_cloudy || 0);
  const birthdayWetRatio = result.birthdays.total
      ? (result.birthdays.rainy + result.birthdays.snowy) / result.birthdays.total
      : 0;

  const candidates: Array<WeatherProfile & { score: number }> = [
    {
      score: result.percentages.sunny / 65 + cap(result.longestSunny / 55) * 0.55,
      title: "햇살 수집가", emoji: "☀️", character: 0, record: `맑은 날 ${result.counts.sunny.toLocaleString()}일`,
      comment: `살아온 날의 ${result.percentages.sunny}%가 맑았고, 가장 길게는 ${result.longestSunny}일 연속 햇살이 이어졌어요.`,
    },
    {
      score: result.percentages.rainy / 18 + cap(result.longestWet / 14) * 0.5 + cap(result.wettest.value / 150) * 0.25,
      title: "비의 연대기 작가", emoji: "🌧️", character: 1, record: `비 오는 날 ${result.counts.rainy.toLocaleString()}일`,
      comment: `비가 인생 날씨의 ${result.percentages.rainy}%를 차지해요. 젖은 계절의 기억이 비교적 선명한 기록입니다.`,
    },
    {
      score: result.percentages.snowy / 5 + cap(result.snowiest.value / 15) * 0.45 + cap(ratio(result.coldDays) / 0.025) * 0.25,
      title: "설경 보관자", emoji: "❄️", character: 2, record: `눈 오는 날 ${result.counts.snowy.toLocaleString()}일`,
      comment: `눈 내린 날과 차가운 계절의 흔적이 다른 날씨보다 또렷하게 남아 있어요.`,
    },
    {
      score: cap(ratio(result.hotDays) / 0.025) * 0.8 + cap(ratio(result.tropicalNights) / 0.018) * 0.65 + cap((result.max.value - 32) / 8) * 0.25,
      title: "한여름 베테랑", emoji: "🔥", character: 3, record: `폭염성 날 ${result.hotDays.toLocaleString()}일`,
      comment: `뜨거운 낮과 쉽게 식지 않던 밤을 제법 많이 지나온 인생 날씨예요.`,
    },
    {
      score: cap(ratio(result.coldDays) / 0.018) * 0.9 + cap((-10 - result.min.value) / 15) * 0.45,
      title: "겨울 생존자", emoji: "🧣", character: 4, record: `강추위 날 ${result.coldDays.toLocaleString()}일`,
      comment: `매서운 겨울을 견딘 기록의 비중이 높아요. 가장 낮은 기온은 ${result.min.value.toFixed(1)}℃였습니다.`,
    },
    {
      score: cap(Math.max(result.cities.length - 1, 0) / 3) * 0.9 + cap(result.awayPercent / 40) * 0.75,
      title: "기후를 건넌 여행자", emoji: "🧭", character: 5, record: `${result.cities.length}개 생활지역의 날씨`,
      comment: `여러 지역을 오가며 서로 다른 하늘과 계절을 살아온 이동의 기록이 돋보여요.`,
    },
    {
      score: cap(birthdayWetRatio / 0.35) * (result.birthdays.total >= 5 ? 1.35 : 0.45),
      title: "생일날 구름 탐험가", emoji: "🎂", character: 6, record: `비·눈 온 생일 ${result.birthdays.rainy + result.birthdays.snowy}번`,
      comment: `유난히 생일마다 비나 눈과 자주 마주쳤어요. 하늘도 날짜를 기억하고 있었나 봐요.`,
    },
    {
      score: cap(cloudyPercent / 42) * 0.9 + cap((100 - Math.abs(result.percentages.sunny - cloudyPercent)) / 100) * 0.35,
      title: "구름 사이 산책자", emoji: "🌥️", character: 7, record: `구름 낀 날 ${Math.round(cloudyPercent)}%`,
      comment: `쨍한 날만큼 구름이 머문 날도 많았어요. 여러 표정의 하늘이 고르게 섞인 기록입니다.`,
    },
  ];

  const winner = candidates.sort((a, b) => b.score - a.score)[0];
  return { title: winner.title, emoji: winner.emoji, character: winner.character, record: winner.record, comment: winner.comment };
}

function ProfileCharacter({index,className=""}:{index:number;className?:string}) {
  const column=index%4;const row=Math.floor(index/4);
  return <div role="img" aria-label="결과 유형 캐릭터" className={`aspect-[3/4] bg-no-repeat ${className}`} style={{backgroundImage:'url(/assets/weather-profile-characters.png)',backgroundSize:'400% 200%',backgroundPosition:`${column*100/3}% ${row*100}%`}}/>;
}

function compositionSentence(result: Result) {
  const cloudy = (result.percentages.cloudy || 0) + (result.percentages.partly_cloudy || 0);
  const rain = result.percentages.rainy || 0;
  const snow = result.percentages.snowy || 0;
  return `살아온 날의 ${result.percentages.sunny}%는 맑았고, ${cloudy}%는 구름이 머물렀으며, ${rain}%에는 비가 내렸습니다${snow ? ` · 눈은 ${snow}%였어요` : ""}.`;
}

function weatherCodeLabel(day: DailyWeather | null) {
  if (!day) return "기록 없음";
  const code = Number((day as any).weather_code ?? (day as any).weathercode ?? -1);
  if (code === 0) return "맑음";
  if (code >= 1 && code <= 3) return "구름";
  if (code >= 71 && code <= 77) return "눈";
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82) || code >= 95) return "비";
  return "날씨 기록";
}

function subsetResult(days: DailyWeather[], birthdate: string) {
  if (!days.length) return null;
  try { return analyzeWeather(days, birthdate); } catch { return null; }
}

function getAgeOnDate(birthdate: string, date: string) {
  const birth = new Date(`${birthdate}T12:00:00`);
  const target = new Date(`${date}T12:00:00`);
  let age = target.getFullYear() - birth.getFullYear();
  const beforeBirthday = target.getMonth() < birth.getMonth() || (target.getMonth() === birth.getMonth() && target.getDate() < birth.getDate());
  if (beforeBirthday) age -= 1;
  return age;
}

function buildAgeSummaries(days: DailyWeather[], birthdate: string) {
  const bands: { label: string; min: number; max: number }[] = [
    { label: "10대", min: 10, max: 19 },
    { label: "20대", min: 20, max: 29 },
    { label: "30대", min: 30, max: 39 },
    { label: "40대", min: 40, max: 49 },
    { label: "50대", min: 50, max: 59 },
    { label: "60대 이후", min: 60, max: 200 },
  ];
  return bands.map((band) => {
    const subset = days.filter((d) => { const age = getAgeOnDate(birthdate, d.date); return age >= band.min && age <= band.max; });
    return { label: band.label, result: subsetResult(subset, birthdate) };
  }).filter((x) => x.result);
}

function buildChapterSummaries(days: DailyWeather[], birthdate: string, residences: Residence[], chapters: Record<string, string>) {
  return residences.flatMap((r) => {
    const labels = (chapters[r.id] || "").split("|").filter(Boolean);
    if (!labels.length || !r.startDate) return [];
    const end = r.isCurrent ? today() : r.endDate;
    const subset = days.filter((d) => d.date >= r.startDate && d.date <= end);
    const result = subsetResult(subset, birthdate);
    return result ? [{ labels, period: `${r.startDate.slice(0,4)}—${end.slice(0,4)}`, result }] : [];
  });
}

function chapterHighlight(period: Result, overall: Result) {
  const dayRate = (count:number) => period.totalDays ? count / period.totalDays * 100 : 0;
  const cloudy = (period.percentages.cloudy || 0) + (period.percentages.partly_cloudy || 0);
  const tempDiff = period.averageTemp - overall.averageTemp;
  const choices = [
    { score: period.percentages.rainy / 17, title: `비가 머문 날 ${period.percentages.rainy}%`, detail: `가장 많은 비는 ${period.wettest.date}의 ${period.wettest.value.toFixed(1)}mm였어요.`, tone: "bg-rain/10 text-rain" },
    { score: period.percentages.snowy / 4, title: `눈과 함께한 날 ${period.percentages.snowy}%`, detail: `가장 많은 눈은 ${period.snowiest.date}의 ${period.snowiest.value.toFixed(1)}cm였어요.`, tone: "bg-snow text-ink" },
    { score: dayRate(period.hotDays) / 2.3, title: `폭염성 날 ${period.hotDays.toLocaleString()}일`, detail: `이 시기의 최고기온은 ${period.max.value.toFixed(1)}℃였어요.`, tone: "bg-orange-100 text-orange-800" },
    { score: dayRate(period.coldDays) / 1.8, title: `강추위 날 ${period.coldDays.toLocaleString()}일`, detail: `이 시기의 최저기온은 ${period.min.value.toFixed(1)}℃였어요.`, tone: "bg-blue-100 text-blue-800" },
    { score: Math.abs(tempDiff) / 1.8, title: `전체보다 ${Math.abs(tempDiff).toFixed(1)}℃ ${tempDiff >= 0 ? "따뜻했던" : "서늘했던"} 시기`, detail: `사계절 전체 일평균기온은 ${period.averageTemp.toFixed(1)}℃였어요.`, tone: "bg-sun/25 text-ink" },
    { score: period.longestWet / 8, title: `비·눈이 ${period.longestWet}일 이어진 때`, detail: `젖은 날씨가 가장 길게 이어진 기록이에요.`, tone: "bg-rain/10 text-rain" },
    { score: cloudy / 44, title: `구름이 머문 날 ${Math.round(cloudy)}%`, detail: `맑음과 흐림 사이, 여러 표정의 하늘을 지나왔어요.`, tone: "bg-gray-200 text-ink" },
    { score: period.percentages.sunny / 72, title: `햇살이 가장 선명했던 기록`, detail: `맑음 ${period.percentages.sunny}% · 최장 연속 맑음 ${period.longestSunny}일`, tone: "bg-sun/25 text-ink" },
  ];
  return choices.sort((a,b)=>b.score-a.score)[0];
}

function seasonForMonth(month: number): Season {
  if ([3,4,5].includes(month)) return "spring";
  if ([6,7,8].includes(month)) return "summer";
  if ([9,10,11].includes(month)) return "autumn";
  return "winter";
}
function favoriteSeasonStory(season:Season,result:Result) {
  const cloudy=(result.percentages.cloudy||0)+(result.percentages.partly_cloudy||0);
  const rate=(count:number)=>result.totalDays?count/result.totalDays*100:0;
  const candidates=[
    {kind:"sun",score:result.percentages.sunny/45+Math.min(result.longestSunny/25,1)*.35},
    {kind:"rain",score:result.percentages.rainy/27+Math.min(result.longestWet/8,1)*.35},
    {kind:"snow",score:result.percentages.snowy/7+Math.min(result.snowiest.value/10,1)*.3},
    {kind:"heat",score:rate(result.hotDays)/7+rate(result.tropicalNights)/6},
    {kind:"cold",score:rate(result.coldDays)/7+Math.min(Math.max(-result.min.value-8,0)/15,1)*.4},
    {kind:"cloud",score:cloudy/48},
  ].sort((a,b)=>b.score-a.score);
  const kind=candidates[0].kind;
  const seasonName=seasonLabels[season];
  const stories:Record<string,{title:string;body:string}>={
    sun:{title:`햇살이 길게 머문 ${seasonName}`,body:`${seasonName}날의 ${result.percentages.sunny}%가 맑았어요. 가장 길게는 ${result.longestSunny}일 연속 햇살이 이어져, 좋아하는 계절다운 밝은 장면을 남겼습니다.`},
    rain:{title:`빗소리까지 기억하는 ${seasonName}`,body:`비가 내린 날이 ${result.percentages.rainy}%였고, 비·눈은 최장 ${result.longestWet}일 이어졌어요. 가장 많은 비는 ${result.wettest.date.replaceAll("-",".")}의 ${result.wettest.value.toFixed(1)}mm였습니다.`},
    snow:{title:`하얀 장면이 남은 ${seasonName}`,body:`눈과 함께한 날은 ${result.percentages.snowy}%였어요. ${result.snowiest.date.replaceAll("-",".")}에는 ${result.snowiest.value.toFixed(1)}cm가 내려 이 계절의 가장 선명한 설경으로 남았습니다.`},
    heat:{title:`뜨거운 기억이 선명한 ${seasonName}`,body:`폭염성 날 ${result.hotDays.toLocaleString()}일, 열대야성 날 ${result.tropicalNights.toLocaleString()}일을 지나왔어요. 가장 뜨거웠던 ${seasonName}날은 ${result.max.date.replaceAll("-",".")}의 ${result.max.value.toFixed(1)}℃였습니다.`},
    cold:{title:`차가운 공기까지 좋아했던 ${seasonName}`,body:`강추위 날을 ${result.coldDays.toLocaleString()}일 지나왔고, 가장 낮은 기온은 ${result.min.date.replaceAll("-",".")}의 ${result.min.value.toFixed(1)}℃였어요. 포근함보다 선명한 추위가 이 계절의 표정이었습니다.`},
    cloud:{title:`구름의 표정이 다양했던 ${seasonName}`,body:`맑기만 한 계절은 아니었어요. 구름이 머문 날이 ${Math.round(cloudy)}%로, 흐리고 옅게 갠 하늘까지 여러 표정의 ${seasonName}을 살아왔습니다.`},
  };
  return stories[kind];
}
function Dashboard({
                     result,
                     birthdate,
                     onReset,
                     days,
                     birthDayWeather,
                     birthPlace,
                     favoriteSeason,
                     residences,
                     chapters,
                   }: {
  result: Result;
  birthdate: string;
  onReset: () => void;
  days: DailyWeather[];
  birthDayWeather: DailyWeather | null;
  birthPlace: Geo | null;
  favoriteSeason: Season | "";
  residences: Residence[];
  chapters: Record<string, string>;
}) {
  const top = (Object.entries(result.counts) as [WeatherCategory, number][]).sort((a,b) => b[1] - a[1])[0][0];
  const yearStart = birthdate.slice(0,4);
  const profile = getWeatherProfile(result);
  const ageSummaries = useMemo(() => buildAgeSummaries(days, birthdate), [days, birthdate]);
  const chapterSummaries = useMemo(() => buildChapterSummaries(days, birthdate, residences, chapters), [days, birthdate, residences, chapters]);
  const favoriteSeasonResult = useMemo(() => {
    if (!favoriteSeason) return null;
    const subset = days.filter((d) => seasonForMonth(Number(d.date.slice(5,7))) === favoriteSeason);
    return subsetResult(subset, birthdate);
  }, [days, birthdate, favoriteSeason]);
  const favoriteStory = favoriteSeason && favoriteSeasonResult ? favoriteSeasonStory(favoriteSeason,favoriteSeasonResult) : null;
  useEffect(() => track("result_viewed"), []);

  return (
      <>
        <header className="mx-auto flex max-w-5xl items-center justify-between px-5 py-6"><Logo /><button onClick={onReset} className="focusable flex items-center gap-2 text-sm text-ink/55"><RotateCcw size={16}/>처음부터</button></header>
        <section className="border-y border-ink/10 bg-[#ece9df]">
          <div className="mx-auto grid max-w-5xl items-center gap-8 px-5 py-16 md:grid-cols-2 md:py-24">
            <div>
              <p className="label">Your life weather · {yearStart}—{new Date().getFullYear()}</p>
              <h1 className="mt-5 font-serif text-4xl font-bold leading-tight sm:text-5xl">당신은 지금까지<br/><span className="text-rain">{result.totalDays.toLocaleString()}일</span>의 날씨를<br/>살아왔습니다.</h1>
              <p className="mt-6 max-w-xl leading-7 text-ink/60">{compositionSentence(result)}</p>
            </div>
            <div className="card relative overflow-hidden p-7 sm:p-8" style={{backgroundColor:"#F5F2E9"}}>
              <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-sun/35"/>
              <div className="relative flex items-start justify-between"><p className="label">Your weather story</p><WeatherGlyph type={top} size={44}/></div>
              <div className="relative mt-7 grid grid-cols-[1fr_112px] items-end gap-2 sm:grid-cols-[1fr_150px]">
                {profile.title ? (<>
                  <div><p className="text-sm font-bold text-ink/45">특별한 날씨 칭호</p>
                  <h2 className="mt-2 font-serif text-2xl font-bold sm:text-3xl">{profile.emoji} {profile.title}</h2>
                  <p className="mt-4 text-sm leading-6 text-ink/60"><b className="text-ink">{profile.record}</b><br/>{profile.comment}</p></div>
                  <ProfileCharacter index={profile.character} className="w-full self-end"/>
                </>) : (<>
                  <p className="font-serif text-2xl leading-relaxed">가장 많이 함께한 하늘은<br/><b className="text-4xl">{labels[top]}</b>이었습니다.</p>
                  <p className="mt-4 text-sm leading-6 text-ink/55">{profile.comment}</p>
                </>)}
              </div>
              <p className="relative mt-5 text-xs text-ink/40">MY LIFE WEATHER</p>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-5xl divide-y divide-ink/10 px-5">
          <Section eyebrow="01 · Composition" title="인생 날씨 구성">
            <div className="grid gap-6 md:grid-cols-2"><div className="card p-4"><WeatherDonut result={result}/></div><div className="grid grid-cols-2 gap-3">{(Object.keys(result.counts) as WeatherCategory[]).filter((k)=>result.counts[k]>0).map((k)=><div className="card flex items-center gap-3 p-4" key={k}><WeatherGlyph type={k}/><div><b>{labels[k]}</b><p className="text-xs text-ink/45">{result.counts[k].toLocaleString()}일 · {result.percentages[k]}%</p></div></div>)}</div></div>
          </Section>

          <Section eyebrow="02 · Temperature" title="인생 기온선"><div className="card p-4"><TempLine result={result}/></div><div className="mt-4 rounded-xl bg-white/50 p-4 text-sm leading-6 text-ink/50"><p>사계절 전체 일평균기온 <b className="text-ink">{result.averageTemp.toFixed(1)}℃</b></p><p className="mt-1 text-xs">여름의 높은 기온과 겨울의 영하 기온을 포함해, 분석된 모든 날짜의 일평균기온을 합산한 값이에요.</p></div></Section>

          <Section eyebrow="03 · Records" title="기억할 만한 날씨 기록">
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              <Stat icon="↑" title="가장 더웠던 날" value={`${result.max.value.toFixed(1)}℃`} sub={`${result.max.date} · ${result.max.city}`}/>
              <Stat icon="↓" title="가장 추웠던 날" value={`${result.min.value.toFixed(1)}℃`} sub={`${result.min.date} · ${result.min.city}`}/>
              <Stat icon="☂" title="비가 가장 많이 온 날" value={`${result.wettest.value.toFixed(1)}mm`} sub={`${result.wettest.date} · ${result.wettest.city}`}/>
              <Stat icon="☀" title="가장 긴 연속 맑음" value={`${result.longestSunny}일`} sub={`비·눈 연속 ${result.longestWet}일`}/>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-center md:grid-cols-4">{[["폭염성 날",result.hotDays],["열대야성 날",result.tropicalNights],["강추위 날",result.coldDays],["폭우 날",result.heavyRainDays]].map(([x,n])=><div key={String(x)} className="rounded-xl border border-ink/10 p-4"><b className="text-xl">{n}일</b><p className="mt-1 text-xs text-ink/45">{x}</p></div>)}</div>
            <p className="mt-3 text-xs text-ink/40">※ 기온·강수 임계값에 따른 서비스 통계이며 공식 기상특보 이력이 아닙니다.</p>
          </Section>

          <Section eyebrow="04 · Places" title="나의 생활지역">
            <div className="card p-4"><CityBars result={result}/></div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">{result.cities.map((c)=><div key={c.name} className="card flex items-center justify-between p-5"><div><b>{c.name}</b><p className="mt-1 text-xs text-ink/45">{c.days.toLocaleString()}일의 기록</p></div><b>{c.temperature.toFixed(1)}℃</b></div>)}</div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3"><div className="card p-5"><p className="text-xs text-ink/45">집이 아닌 지역에서 생활한 날</p><b className="mt-2 block text-2xl">{result.awayPercent}%</b></div><div className="card p-5"><p className="text-xs text-ink/45">평일 날씨</p><b className="mt-2 block">맑음 {result.weekday.days?Math.round(result.weekday.sunny/result.weekday.days*100):0}%</b><p className="mt-1 text-xs text-ink/45">비 {result.weekday.rainy}일 · 눈 {result.weekday.snowy}일</p></div><div className="card p-5"><p className="text-xs text-ink/45">주말 날씨</p><b className="mt-2 block">맑음 {result.weekend.days?Math.round(result.weekend.sunny/result.weekend.days*100):0}%</b><p className="mt-1 text-xs text-ink/45">비 {result.weekend.rainy}일 · 눈 {result.weekend.snowy}일</p></div></div>
            <p className="mt-4 text-xs leading-5 text-ink/40">※ 학교·직장 지역은 실제 이동기록이 아닌 입력한 요일의 생활패턴을 바탕으로 추정합니다.</p>
          </Section>

          <Section eyebrow="05 · Chapters" title="내 인생의 장면들은 어떤 날씨였을까?">
            {birthPlace && (
                <div className="card mb-4 overflow-hidden">
                  <div className="bg-sun/25 p-5"><p className="label">The first weather</p><h3 className="mt-2 font-serif text-2xl font-bold">당신이 세상에 온 날 🌱</h3></div>
                  <div className="grid gap-4 p-5 sm:grid-cols-[1fr_auto] sm:items-center"><div><b>{birthdate.replaceAll("-", ".")} · {birthPlace.name}</b><p className="mt-2 text-sm text-ink/55">당신의 첫 번째 날씨는 <b className="text-ink">{weatherCodeLabel(birthDayWeather)}</b>으로 기록되어 있어요.</p></div>{birthDayWeather && <div className="rounded-xl bg-cream px-4 py-3 text-right text-sm"><b>{Number((birthDayWeather as any).temperature_2m_max ?? 0).toFixed(1)}℃</b><p className="mt-1 text-xs text-ink/45">최고기온</p></div>}</div>
                </div>
            )}

            {chapterSummaries.length > 0 && (<>
              <p className="mb-3 mt-6 text-sm font-bold">내가 이름 붙인 시기</p>
              <div className="grid gap-3 sm:grid-cols-2">{chapterSummaries.map(({labels:chapterLabels,period,result:r}) => {const insight=chapterHighlight(r,result);return <div className="card overflow-hidden" key={`${period}-${chapterLabels.join("-")}`}><div className={`p-5 ${insight.tone}`}><div className="flex flex-wrap gap-1.5">{chapterLabels.map(label=><span className="rounded-full border border-current/15 bg-white/50 px-2.5 py-1 text-[11px] font-bold" key={label}>{label}</span>)}</div><p className="mt-3 text-[11px] font-bold opacity-55">{period}</p><p className="mt-2 font-serif text-2xl font-bold">{insight.title}</p></div><div className="p-5"><p className="text-sm leading-6 text-ink/55">{insight.detail}</p><div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 border-t border-ink/10 pt-4 text-xs text-ink/45"><span>평균 <b className="text-ink">{r.averageTemp.toFixed(1)}℃</b></span><span>비 <b className="text-ink">{r.percentages.rainy}%</b></span><span>눈 <b className="text-ink">{r.percentages.snowy}%</b></span></div></div></div>})}</div>
            </>)}

            {ageSummaries.length > 0 && (<>
              <p className="mb-3 mt-7 text-sm font-bold">나이대별 날씨</p>
              <div className="flex gap-3 overflow-x-auto pb-2">{ageSummaries.map(({label,result:r}) => r && <div key={label} className="card min-w-[190px] p-5"><p className="text-xs font-bold text-ink/45">{label}</p><b className="mt-2 block text-xl">평균 {r.averageTemp.toFixed(1)}℃</b><p className="mt-2 text-xs leading-5 text-ink/50">맑음 {r.percentages.sunny}%<br/>비 {r.percentages.rainy}% · 눈 {r.percentages.snowy}%</p></div>)}</div>
            </>)}

            {favoriteSeason && favoriteSeasonResult && favoriteStory && (
                <div className="mt-7 rounded-2xl border border-ink/10 bg-cream p-6">
                  <p className="label">Your favorite season</p>
                  <h3 className="mt-2 font-serif text-2xl font-bold">{seasonEmoji[favoriteSeason]} {favoriteStory.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-ink/60">{favoriteStory.body}</p>
                  <div className="mt-5 flex flex-wrap gap-2 border-t border-ink/10 pt-4 text-xs text-ink/50"><span className="rounded-full bg-white px-3 py-2">평균 <b className="text-ink">{favoriteSeasonResult.averageTemp.toFixed(1)}℃</b></span><span className="rounded-full bg-white px-3 py-2">맑음 <b className="text-ink">{favoriteSeasonResult.percentages.sunny}%</b></span><span className="rounded-full bg-white px-3 py-2">비 <b className="text-ink">{favoriteSeasonResult.percentages.rainy}%</b></span></div>
                </div>
            )}
          </Section>

          <Section eyebrow="06 · Birthdays" title="나의 생일 날씨">
            <div className="card grid gap-6 p-6 sm:grid-cols-2"><div><p className="text-sm text-ink/45">기록 속 생일</p><p className="mt-2 font-serif text-4xl font-bold">{result.birthdays.total}번</p><p className="mt-4 text-sm leading-7">맑음 {result.birthdays.sunny}번 · 비 {result.birthdays.rainy}번 · 눈 {result.birthdays.snowy}번</p></div><div className="grid gap-3 border-t border-ink/10 pt-5 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0"><BirthdayRecord label="가장 더웠던 생일" day={result.birthdays.hottest} value={result.birthdays.hottest?.temperature_2m_max}/><BirthdayRecord label="가장 추웠던 생일" day={result.birthdays.coldest} value={result.birthdays.coldest?.temperature_2m_min}/><p className="text-xs text-ink/40">2월 29일생은 윤년에만 생일로 집계합니다.</p></div></div>
          </Section>

          <Section eyebrow="07 · Share" title="친구들과 인생 날씨를 공유해보세요">
            <p className="-mt-3 mb-6 max-w-xl text-sm leading-6 text-ink/50">나만의 날씨 기록과 특별한 칭호를 카드로 남겨보세요. 친구의 인생 날씨와 비교해보는 것도 재밌어요.</p>
            <ShareCard result={result} from={yearStart} favoriteSeason={favoriteSeason} />
          </Section>

          <section className="py-12 text-sm leading-7 text-ink/50"><h2 className="font-serif text-xl font-bold text-ink">데이터 기준과 한계</h2><p className="mt-3">Open-Meteo의 도시 좌표 기준 재분석 자료를 사용합니다. 실제 집 앞의 순간적인 날씨와 다를 수 있고, 공식 재난특보 통계가 아닙니다. 생활지역과 인생 챕터는 사용자가 입력한 생활패턴을 기준으로 한 추정입니다.</p></section>
        </div>
      </>
  );
}

function ShareCard({ result, from, favoriteSeason }: { result: Result; from: string; favoriteSeason: Season | "" }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [format, setFormat] = useState<"story" | "link">("story");
  const profile = getWeatherProfile(result);

  useEffect(() => {
    const c = canvas.current;
    if (!c) return;
    const story = format === "story";
    c.width = story ? 1080 : 1200;
    c.height = story ? 1920 : 630;
    const x = c.getContext("2d");
    if (!x) return;
    x.fillStyle = "#F5F2E9"; x.fillRect(0,0,c.width,c.height);
    x.fillStyle = "#F5C84B"; x.beginPath(); x.arc(c.width*.84,c.height*(story ? .15 : .2),story?180:105,0,Math.PI*2); x.fill();
    const character = new Image();
    character.onload = () => {
      const cellWidth = character.naturalWidth / 4;
      const cellHeight = character.naturalHeight / 2;
      const sourceX = (profile.character % 4) * cellWidth;
      const sourceY = Math.floor(profile.character / 4) * cellHeight;
      if (story) x.drawImage(character, sourceX, sourceY, cellWidth, cellHeight, 690, 130, 255, 340);
      else x.drawImage(character, sourceX, sourceY, cellWidth, cellHeight, 950, 25, 180, 240);
    };
    character.src = "/assets/weather-profile-characters.png";
    const left = story ? 90 : 70;
    x.fillStyle = "#18211C"; x.font = `700 ${story?34:24}px sans-serif`; x.fillText("MY LIFE WEATHER",left,story?135:72);
    const titleY = story ? 700 : 220;
    if (profile.title) {
      x.fillStyle="#657068"; x.font=`700 ${story?28:18}px sans-serif`; x.fillText("SPECIAL WEATHER TITLE",left,titleY-90);
      const titleText=`${profile.emoji} ${profile.title}`;
      let titleSize=story?76:48;
      const titleMaxWidth=story?900:800;
      x.fillStyle="#18211C";
      x.font=`700 ${titleSize}px serif`;
      while(x.measureText(titleText).width>titleMaxWidth&&titleSize>(story?52:34)){titleSize-=2;x.font=`700 ${titleSize}px serif`;}
      x.fillText(titleText,left,titleY);
      x.font=`700 ${story?42:26}px sans-serif`; x.fillText(profile.record,left,titleY+(story?80:50));
    } else {
      x.font=`700 ${story?64:42}px serif`; x.fillText("나의 인생 날씨",left,titleY);
    }
    const compY = story ? 1040 : 375;
    x.font=`700 ${story?110:64}px serif`; x.fillText(`${result.percentages.sunny}%`,left,compY);
    x.font=`${story?34:22}px sans-serif`; x.fillStyle="#657068"; x.fillText("맑은 날",left,compY+(story?55:34));
    const cloud=(result.percentages.cloudy||0)+(result.percentages.partly_cloudy||0);
    x.font=`700 ${story?30:18}px sans-serif`; x.fillStyle="#18211C"; x.fillText(`구름 ${cloud}%   ·   비 ${result.percentages.rainy}%   ·   눈 ${result.percentages.snowy}%`,left,compY+(story?135:82));
    x.font=`${story?29:18}px sans-serif`; x.fillStyle="#657068";
    x.fillText(`${result.totalDays.toLocaleString()}일의 날씨 · ${from}—${new Date().getFullYear()}`,left,story?1600:545);
    if (favoriteSeason) x.fillText(`좋아하는 계절 · ${seasonEmoji[favoriteSeason]} ${seasonLabels[favoriteSeason]}`,left,story?1650:575);
    x.font=`700 ${story?24:16}px sans-serif`; x.fillStyle="#18211C"; x.fillText("당신의 인생 날씨는 어떤가요?",left,story?1770:605);
    track("share_card_generated",{format});
  },[format,result,from,favoriteSeason,profile.title,profile.record,profile.emoji,profile.character]);

  const blob=()=>new Promise<Blob|null>((r)=>canvas.current?.toBlob(r,"image/png"));
  async function download(){const b=await blob();if(!b)return;const a=document.createElement("a");a.href=URL.createObjectURL(b);a.download=`my-life-weather-${format}.png`;a.click();URL.revokeObjectURL(a.href);track("image_downloaded",{format});}
  function fallbackCopy(text: string) {
    try {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.left = "-9999px";
      textarea.style.top = "0";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      textarea.setSelectionRange(0, textarea.value.length);
      const copied = document.execCommand("copy");
      document.body.removeChild(textarea);
      if (copied) {
        alert("공유 기능을 사용할 수 없어 시작 링크를 복사했어요. 이미지는 저장 버튼으로 저장할 수 있어요.");
      } else {
        alert(`아래 주소를 직접 복사해주세요.\n${text}`);
      }
    } catch {
      alert(`아래 주소를 직접 복사해주세요.\n${text}`);
    }
  }

  async function share() {
    const b = await blob();
    const text = profile.title
        ? `내 인생 날씨 칭호는 ${profile.title}!`
        : `내 인생의 ${result.percentages.sunny}%는 맑은 날이었어요.`;
    const url = typeof window !== "undefined" ? window.location.origin : "";

    if (b && navigator.share) {
      const file = new File([b], "my-life-weather.png", { type: "image/png" });
      const canShareFiles = navigator.canShare?.({ files: [file] });

      if (canShareFiles) {
        try {
          await navigator.share({
            title: "내 인생 날씨",
            text,
            files: [file],
          });
          track("share_clicked", { format, method: "native" });
          return;
        } catch (e) {
          if (e instanceof DOMException && e.name === "AbortError") return;
        }
      } else {
        try {
          await navigator.share({
            title: "내 인생 날씨",
            text,
            url,
          });
          track("share_clicked", { format, method: "native-link" });
          return;
        } catch (e) {
          if (e instanceof DOMException && e.name === "AbortError") return;
        }
      }
    }

    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(url);
        alert("공유 기능을 사용할 수 없어 시작 링크를 복사했어요. 이미지는 저장 버튼으로 저장할 수 있어요.");
        track("share_clicked", { format, method: "clipboard" });
        return;
      } catch {}
    }

    fallbackCopy(url);
    track("share_clicked", { format, method: "fallback-copy" });
  }

  return <div className="grid gap-5 md:grid-cols-[1fr_280px]"><div className="overflow-hidden rounded-2xl bg-ink/10 p-4"><canvas ref={canvas} className={`mx-auto max-h-[520px] max-w-full rounded-xl shadow-xl ${format==="story"?"aspect-[9/16]":"aspect-[1200/630]"}`} aria-label="공유 이미지 미리보기"/></div><div><div className="mb-5 rounded-2xl bg-sun/20 p-5"><p className="text-xs font-bold text-ink/45">공유 카드에 담기는 기록</p><p className="mt-2 font-serif text-xl font-bold">{profile.title?`${profile.emoji} ${profile.title}`:"나의 인생 날씨"}</p><p className="mt-2 text-xs leading-5 text-ink/50">{profile.title?profile.comment:compositionSentence(result)}</p></div><p className="text-sm font-bold">이미지 비율</p><div className="mt-3 grid grid-cols-2 gap-2">{([["story","스토리 9:16"],["link","링크 1.91:1"]] as const).map(([v,t])=><button key={v} onClick={()=>setFormat(v)} className={`focusable rounded-xl border p-3 text-xs ${format===v?"border-ink bg-ink text-white":"border-ink/15"}`}>{t}</button>)}</div><button onClick={download} className="focusable mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-ink py-4 font-bold text-white"><Download size={18}/>이미지 저장</button><button onClick={share} className="focusable mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-ink/20 py-4 font-bold"><Share2 size={18}/>친구에게 공유하기</button><p className="mt-4 text-xs leading-5 text-ink/40">생년월일과 상세 생활기간은 공유 이미지에 포함하지 않아요.</p></div></div>;
}
