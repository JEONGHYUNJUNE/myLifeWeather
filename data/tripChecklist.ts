export type ChecklistOwner = "유진" | "현준";
export type ChecklistCategory = "예약·서류" | "의류" | "전자기기" | "건강·생활" | "테니스 관람";

export type ChecklistItem = {
  id: string;
  owner: ChecklistOwner;
  category: ChecklistCategory;
  label: string;
  note?: string;
};

const personal = (owner: ChecklistOwner, prefix: string): ChecklistItem[] => [
  { id: `${prefix}-passport`, owner, category: "예약·서류", label: "여권", note: "귀국일 기준 유효기간 확인" },
  { id: `${prefix}-eta`, owner, category: "예약·서류", label: "호주 ETA 승인 화면", note: "앱과 캡처본 모두 저장" },
  { id: `${prefix}-insurance`, owner, category: "예약·서류", label: "여행자보험 증서" },
  { id: `${prefix}-card`, owner, category: "예약·서류", label: "해외결제 카드 2장", note: "서로 다른 가방에 나눠 보관" },
  { id: `${prefix}-summer`, owner, category: "의류", label: "여름 상·하의 5세트" },
  { id: `${prefix}-layer`, owner, category: "의류", label: "얇은 긴팔·바람막이", note: "멜버른 일교차와 경기장 냉방 대비" },
  { id: `${prefix}-shoes`, owner, category: "의류", label: "많이 걸어도 편한 운동화" },
  { id: `${prefix}-swim`, owner, category: "의류", label: "수영복·샌들", note: "Bondi·St Kilda 일정" },
  { id: `${prefix}-phone`, owner, category: "전자기기", label: "휴대폰·충전 케이블" },
  { id: `${prefix}-battery`, owner, category: "전자기기", label: "보조배터리", note: "반드시 기내 휴대" },
  { id: `${prefix}-adapter`, owner, category: "전자기기", label: "호주형 I 타입 어댑터" },
  { id: `${prefix}-esim`, owner, category: "전자기기", label: "eSIM 설치·개통 확인" },
  { id: `${prefix}-medicine`, owner, category: "건강·생활", label: "개인 상비약·처방약" },
  { id: `${prefix}-sun`, owner, category: "건강·생활", label: "선크림·선글라스·모자", note: "호주 여름 자외선 대비" },
  { id: `${prefix}-bottle`, owner, category: "테니스 관람", label: "빈 물병·작은 가방", note: "AO 반입 규정 최종 확인" },
];

export const tripChecklist: ChecklistItem[] = [
  ...personal("유진", "yujin"),
  ...personal("현준", "hyunjun"),
  { id: "yujin-flight-docs", owner: "유진", category: "예약·서류", label: "국제선 e-ticket 저장", note: "JQ048·OZ602" },
  { id: "yujin-hotel", owner: "유진", category: "예약·서류", label: "호텔 예약서·주소 저장", note: "시드니·멜버른·공항호텔" },
  { id: "yujin-laundry", owner: "유진", category: "건강·생활", label: "세면도구·세탁 파우치" },
  { id: "yujin-tickets", owner: "유진", category: "테니스 관람", label: "Ticketmaster 모바일 티켓 확인", note: "Wallet에도 저장" },
  { id: "hyunjun-domestic", owner: "현준", category: "예약·서류", label: "호주 국내선 2구간 예약", note: "SYD→MEL, MEL→SYD·각 20kg 수하물" },
  { id: "hyunjun-maps", owner: "현준", category: "전자기기", label: "Google 오프라인 지도 저장", note: "Sydney·Melbourne" },
  { id: "hyunjun-money", owner: "현준", category: "예약·서류", label: "카드 해외사용·환전 확인" },
  { id: "hyunjun-ao", owner: "현준", category: "테니스 관람", label: "AO 일정·입장 게이트 캡처", note: "1/26 Night 45구역·1/29 Day 54구역" },
];

export const checklistCategories: ChecklistCategory[] = ["예약·서류", "의류", "전자기기", "건강·생활", "테니스 관람"];
