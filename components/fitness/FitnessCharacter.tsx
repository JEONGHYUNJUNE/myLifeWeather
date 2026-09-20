import type { Person } from "@/data/fitness";
export function FitnessCharacter({
  person,
  progress,
  stage,
}: {
  person: Person;
  progress: number;
  stage: number;
}) {
  const active = person === "yujin";
  const shirt = active ? "#ce795e" : "#32695d";
  return (
    <svg
      viewBox="0 0 420 245"
      role="img"
      aria-label={`${active ? "유진의 러닝" : "현준의 덤벨 운동"} 캐릭터, 성장 ${stage}단계, 운동 달성률 ${progress}%`}
      className="fitness-character"
    >
      <circle cx="210" cy="125" r="102" fill={active ? "#f5e3d6" : "#e0e9d9"} />
      <circle cx="292" cy="51" r="21" fill="#edc36b" />
      <path
        d="M71 192 Q195 150 350 193"
        fill="none"
        stroke="#d7ddc9"
        strokeWidth="2"
      />
      <path
        d="M64 214 Q210 190 357 214"
        fill="none"
        stroke="#c3cbb6"
        strokeWidth="2"
        strokeDasharray="5 7"
      />
      <ellipse cx="209" cy="219" rx="65" ry="9" fill="#244b3f" opacity=".09" />
      {active && (
        <path
          d="M189 59 Q156 28 151 70 Q143 88 126 79 Q151 107 173 83"
          fill="#343a30"
        />
      )}
      <g
        stroke="#273d34"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path
          d={
            active
              ? "M198 149 L182 178 L158 203 M219 148 L239 180 L218 206"
              : "M198 150 L190 207 M221 150 L234 207"
          }
          fill="none"
          stroke="#354e43"
          strokeWidth="19"
        />
        <path
          d={
            active
              ? "M153 204 l-9 8 q10 10 30 0 l-6-9 M216 205 l-3 10 h27 q-1-10-16-13"
              : "M182 204 l-8 12 h29 l-5-12 M227 204 l-1 12 h30 q-2-11-18-12"
          }
          fill="#fffaf0"
        />
        <path
          d="M188 94 Q210 84 230 95 L239 148 Q212 162 183 148 Z"
          fill={shirt}
          stroke={shirt}
        />
        <path
          d={
            active
              ? "M190 101 L170 122 L156 108 M231 103 L248 122 L264 106"
              : "M187 103 L163 125 L145 102 M234 103 L255 125 L275 102"
          }
          fill="none"
          stroke="#e6b68b"
          strokeWidth="13"
        />
        <path d="M204 86 v9 q7 6 14 0 v-9" fill="#e6b68b" stroke="#e6b68b" />
        <ellipse
          cx="210"
          cy="65"
          rx="26"
          ry="30"
          fill="#efc59f"
          stroke="none"
        />
        <path
          d="M184 61 Q177 29 210 30 Q239 30 237 60 L228 49 Q207 56 193 46 Z"
          fill="#343a30"
          stroke="none"
        />
        <path d="M199 65 v2 M219 65 v2" />
        <path
          d={stage >= 3 ? "M202 76 Q210 87 219 76 Z" : "M204 77 Q210 82 217 76"}
          fill={stage >= 3 ? "#fffaf0" : "none"}
          strokeWidth="2"
        />
        {!active && (
          <g stroke="#354e43" strokeWidth="7">
            <path d="M128 96 h34 M258 96 h34" />
            <path
              d="M131 85 v23 M158 85 v23 M261 85 v23 M288 85 v23"
              strokeWidth="10"
            />
          </g>
        )}
      </g>
      <g className="fitness-prop" style={{ opacity: stage >= 2 ? 1 : 0 }}>
        <rect x="302" y="172" width="18" height="35" rx="6" fill="#91aea2" />
        <rect x="306" y="164" width="10" height="10" rx="3" fill="#32695d" />
        <path d="M306 187 h10" stroke="#fffaf0" strokeWidth="3" />
      </g>
      <g className="fitness-prop" style={{ opacity: stage >= 3 ? 1 : 0 }}>
        {active ? (
          <>
            <rect x="80" y="205" width="60" height="11" rx="5" fill="#ce795e" />
            <circle cx="85" cy="210" r="5" fill="#f5ccba" />
          </>
        ) : (
          <>
            <rect x="79" y="176" width="62" height="11" rx="5" fill="#ce795e" />
            <path
              d="M87 187 v28 M133 187 v28"
              stroke="#354e43"
              strokeWidth="5"
            />
          </>
        )}
      </g>
      <g
        className="fitness-prop"
        style={{ opacity: stage >= 4 ? 1 : 0 }}
        fill="#dfa944"
      >
        <path d="m102 102 4 10 10 4-10 4-4 10-4-10-10-4 10-4Z" />
        <path d="m314 109 3 8 8 3-8 3-3 8-3-8-8-3 8-3Z" />
      </g>
      <g className="fitness-prop" style={{ opacity: stage >= 5 ? 1 : 0 }}>
        <path d="M333 153 h25 v16 q-12 22-25 0Z" fill="#e4b54e" />
        <path
          d="M345 181 v15 m-10 0 h20 M334 158 q-17-5-9 12 l12 5 M357 158 q17-5 9 12 l-12 5"
          fill="none"
          stroke="#d3a040"
          strokeWidth="4"
        />
      </g>
      <path
        d="M71 168 q-12-18-19-4 q-2 9 19 18 q20-11 17-20 q-7-10-17 6"
        fill="#94a880"
      />
    </svg>
  );
}
