export type Person = "hyunjun" | "yujin";
export type Exercise = {
  id: string;
  name: string;
  sets: number;
  reps?: string;
  guides: { label: string; url: string }[];
};
export type Workout = {
  id: string;
  name: string;
  subtitle: string;
  optional: boolean;
  kind: "weights" | "pilates" | "running";
  exercises: Exercise[];
};
export const START = "2026-10-01";
export const END = "2027-01-15";
export const people = {
  hyunjun: {
    name: "현준",
    theme: "STRONGER",
    tagline: "조금씩, 더 단단한 나로.",
    focus: "어깨 / 등 / 가슴 근육 증가",
    metrics: [
      { name: "체중", now: "59.9kg", goal: "62~64kg" },
      { name: "골격근량", now: "29.4kg", goal: "31kg 이상" },
      { name: "체지방률", now: "13.6%", goal: "15% 이하" },
    ],
  },
  yujin: {
    name: "유진",
    theme: "ACTIVE",
    tagline: "가볍게 움직이고, 활기를 채우고.",
    focus: "체지방 감소 + 근육 유지/증가 + 체력 향상",
    metrics: [
      { name: "골격근량", now: "21kg", goal: "22kg 이상" },
      { name: "체지방률", now: "28%", goal: "25~27%" },
    ],
  },
} as const;
const exerciseAlternatives: Record<string, string[]> = {
  squat: ["스쿼트", "레그프레스"],
  rear: ["리어델트 플라이", "페이스풀"],
};
export const youtubeExerciseSearch = (name: string) =>
  `https://www.youtube.com/results?search_query=${encodeURIComponent(`${name} 초보자 올바른 자세 운동 방법`)}`;
const ex = (id: string, name: string, sets = 3, reps = "8~12회"): Exercise => ({
  id,
  name,
  sets,
  reps,
  guides: (exerciseAlternatives[id] ?? [name]).map((label) => ({
    label,
    url: youtubeExerciseSearch(label),
  })),
});
export const programs: Record<Person, Workout[]> = {
  hyunjun: [
    {
      id: "a",
      name: "Workout A",
      subtitle: "상체 중심 · 어깨 / 등 / 가슴",
      optional: false,
      kind: "weights",
      exercises: [
        ex("lat", "랫풀다운"),
        ex("row", "시티드 케이블 로우"),
        ex("incline", "인클라인 체스트프레스"),
        ex("shoulder", "숄더프레스"),
        ex("lateral", "사이드 레터럴 레이즈", 4, "12~20회"),
        ex("rear", "리어델트 플라이 또는 페이스풀", 3, "12~20회"),
      ],
    },
    {
      id: "b",
      name: "Workout B",
      subtitle: "하체 + 상체 · 균형 있게",
      optional: false,
      kind: "weights",
      exercises: [
        ex("squat", "스쿼트 또는 레그프레스"),
        ex("rdl", "루마니안 데드리프트"),
        ex("curl", "레그컬", 3, "10~15회"),
        ex("chest", "체스트프레스"),
        ex("lat", "랫풀다운"),
        ex("lateral", "사이드 레터럴 레이즈", 3, "12~20회"),
        ex("core", "코어 운동", 3, ""),
      ],
    },
    {
      id: "c",
      name: "Workout C",
      subtitle: "상체 보강 · 여유 있으면",
      optional: true,
      kind: "weights",
      exercises: [
        ex("incline", "인클라인 체스트프레스"),
        ex("row", "시티드 로우"),
        ex("shoulder", "숄더프레스"),
        ex("lateral", "사이드 레터럴 레이즈", 4, "12~20회"),
        ex("rear", "리어델트 / 페이스풀", 3, "12~20회"),
        ex("biceps", "이두컬", 2, "10~15회"),
        ex("triceps", "삼두 운동", 2, "10~15회"),
      ],
    },
  ],
  yujin: [
    {
      id: "pilates-1",
      name: "필라테스 ①",
      subtitle: "호흡부터 차근차근 · 수업 1회",
      kind: "pilates",
      optional: false,
      exercises: [],
    },
    {
      id: "running-1",
      name: "러닝 ①",
      subtitle: "나만의 편안한 페이스",
      kind: "running",
      optional: false,
      exercises: [],
    },
    {
      id: "pilates-2",
      name: "필라테스 ②",
      subtitle: "한 번 더, 몸을 깨우는 시간",
      kind: "pilates",
      optional: true,
      exercises: [],
    },
    {
      id: "running-2",
      name: "러닝 ②",
      subtitle: "한 번 더, 가볍게 밖으로",
      kind: "running",
      optional: true,
      exercises: [],
    },
  ],
};
export const runningPlans: Record<string, string> = {
  "10": "20~30분 · 걷기 + 가벼운 러닝",
  "11": "25~35분 · 편안한 페이스의 러닝",
  "12": "30~40분 · 지속적인 러닝",
  "01": "30~40분 · 편안한 페이스 유지",
};
export const stageMessages = [
  "운동 시작!",
  "운동 습관 만드는 중",
  "절반 왔다!",
  "확실히 쌓이고 있어",
  "목표 도착!",
];
