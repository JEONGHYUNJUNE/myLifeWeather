export type Transport = "도보" | "트램" | "기차" | "차량" | "항공" | "페리";

export type TripActivity = {
  id: string;
  time: string;
  place: string;
  description: string;
  duration: string;
  travelTime: string;
  transport: Transport;
  cost: number;
  rating: 1 | 2 | 3 | 4 | 5;
  coordinates: [number, number];
  image: string;
};

export type TripDay = {
  day: number;
  date: string;
  city: string;
  title: string;
  summary: string;
  activities: TripActivity[];
};

export const trip = {
  slug: "australia-2027",
  title: "Australia 2027",
  route: "Sydney → Melbourne",
  startDate: "2027-01-22",
  endDate: "2027-01-31",
  departureNote: "1월 22일 저녁 한국 출발",
  returnNote: "1월 31일 오전 호주 출발",
  purpose: "Sydney first · Australian Open finale in Melbourne",
  travelers: 2,
  images: {
    hero: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=2000&q=88",
    melbourne: "https://images.unsplash.com/photo-1514395462725-fb4566210144?auto=format&fit=crop&w=1400&q=85",
    oceanRoad: "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?auto=format&fit=crop&w=1400&q=85",
    tennis: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&w=1400&q=85",
    sydney: "https://images.unsplash.com/photo-1524820197278-540916411e20?auto=format&fit=crop&w=1400&q=85",
    bondi: "https://images.unsplash.com/photo-1578960432643-69f32e240b1e?auto=format&fit=crop&w=1400&q=85",
    mountains: "https://images.unsplash.com/photo-1598948485421-33a1655d3c18?auto=format&fit=crop&w=1400&q=85",
  },
  mapStops: [
    { number: 1, name: "Sydney", note: "Jan 23–25", coordinates: [-33.8688, 151.2093] as [number, number] },
    { number: 2, name: "Blue Mountains", note: "Jan 24", coordinates: [-33.732, 150.312] as [number, number] },
    { number: 3, name: "Melbourne", note: "Jan 25–31", coordinates: [-37.8136, 144.9631] as [number, number] },
    { number: 4, name: "Great Ocean Road", note: "Jan 28", coordinates: [-38.6659, 143.1045] as [number, number] },
    { number: 5, name: "Melbourne Park", note: "Jan 26·27·29", coordinates: [-37.8216, 144.9785] as [number, number] },
  ],
  australianOpen: {
    schedule: [
      { date: "Jan 26–27", round: "Quarterfinals", selected: true, note: "Jan 26 Night + Jan 27 Day 관람" },
      { date: "Jan 28", round: "Women's Semifinals", selected: false, note: "관람하지 않음" },
      { date: "Jan 29", round: "Men's Semifinals", selected: true, note: "남자 단식 준결승 관람" },
      { date: "Jan 30", round: "Women's Final", selected: false, note: "Sydney 체류" },
      { date: "Jan 31", round: "Men's Final", selected: false, note: "오전 출국" },
    ],
    tickets: [
      { label: "Men's Quarterfinal · Night", date: "Jan 26", min: 430000, max: 500000, selected: true, seat: "13·16구역 중간열 우선 · 없으면 12·17구역" },
      { label: "Men's Quarterfinal · Day", date: "Jan 27", min: 280000, max: 350000, selected: true, seat: "2층 중앙 46~49 또는 28~31구역 앞줄" },
      { label: "Men's Semifinal · Night", date: "Jan 29", min: 550000, max: 650000, selected: true, seat: "가장 많이 투자 · 14·15구역, 초과 시 13·16구역" },
      { label: "Food / merchandise", date: "현장", min: 80000, max: 120000, selected: true, seat: "식음료 위주, 굿즈는 한도 안에서" },
    ],
    targetBudget: 1500000,
    seatGuide: [
      { rank: "1순위", sections: "14 · 15", description: "사이드라인 중앙. 코트 전체와 선수 움직임을 가장 균형 있게 볼 수 있어요." },
      { rank: "2순위", sections: "13 · 16", description: "중앙에서 조금 벗어나지만 시야가 좋고 1순위보다 가격 부담이 낮아요." },
      { rank: "가성비", sections: "12 · 17 · 8", description: "코너 각도. 서브와 랠리 깊이가 잘 보이고 비교적 선택지가 많아요." },
    ],
    notice: "2027 경기 세션과 티켓 가격은 공식 판매 일정 발표 후 다시 확인해야 합니다.",
  },
  budget: [
    { id: "ao", label: "Australian Open · 남자 경기 3세션 2인", amount: 3000000, color: "#f4b942" },
    { id: "stay", label: "Hotels · 호텔 8박 / 객실 1개", amount: 2300000, color: "#f0d6a5" },
    { id: "food", label: "Food · 2인 식비", amount: 800000, color: "#ee8d72" },
    { id: "flight", label: "Domestic flight · 시드니→멜버른 항공 2인", amount: 300000, color: "#5f9fb3" },
    { id: "transport", label: "Public transport · 현지 교통 2인", amount: 240000, color: "#86b6a2" },
    { id: "tour", label: "Tours / Attractions · 투어·관광 2인", amount: 500000, color: "#7294c4" },
    { id: "other", label: "Other · 쇼핑·예비비", amount: 300000, color: "#a99ac4" },
  ],
} as const;

const img = trip.images;
const a = (id:string,time:string,place:string,description:string,duration:string,travelTime:string,transport:Transport,cost:number,rating:1|2|3|4|5,coordinates:[number,number],image:string):TripActivity => ({id,time,place,description,duration,travelTime,transport,cost,rating,coordinates,image});

export const tripDays: TripDay[] = [
  { day:1,date:"2027-01-22",city:"Seoul → Sydney",title:"여행의 시작",summary:"저녁 비행으로 시드니의 여름을 향해 출발",activities:[a("flight-out","19:00","인천국제공항","인천→시드니 입국, 멜버른→인천 출국의 다구간 항공권을 기준으로 해요.","야간 비행","—","항공",0,5,[37.4602,126.4407],img.hero)]},
  { day:2,date:"2027-01-23",city:"Sydney",title:"하버에서 시작",summary:"오페라하우스와 항구의 밤",activities:[a("syd-arrive","09:00","Sydney Airport","공항철도로 CBD 이동 후 호텔에 짐을 맡겨요.","1시간 30분","20분","기차",20000,4,[-33.9399,151.1753],img.sydney),a("harbour","14:00","Circular Quay · The Rocks","오페라하우스, 하버브리지와 오래된 골목을 한 동선으로 걸어요.","4시간","도보","도보",30000,5,[-33.861,151.2127],img.sydney)]},
  { day:3,date:"2027-01-24",city:"Blue Mountains",title:"산의 푸른 안개",summary:"시드니 체류 중 가장 긴 당일 여행",activities:[a("blue","07:30","Blue Mountains","Three Sisters와 숲길. 시야가 나쁘면 다음 날 Bondi 일정과 교체해요.","종일","기차 약 2시간","기차",90000,5,[-33.732,150.312],img.mountains)]},
  { day:4,date:"2027-01-25",city:"Sydney → Melbourne",title:"바다를 걷고 멜버른으로",summary:"Bondi 산책 후 오후 국내선 이동",activities:[a("bondi","08:00","Bondi to Coogee Walk","이른 시간 해안 산책 후 호텔에서 짐을 찾아 공항으로 이동해요.","3시간","버스 35분","차량",25000,5,[-33.8915,151.2767],img.bondi),a("syd-mel","15:30","Sydney → Melbourne","준준결승 전날 멜버른에 도착해 이동 변수를 없애요.","1시간 35분","공항 이동 20분","항공",150000,5,[-37.669,144.841],img.melbourne)]},
  { day:5,date:"2027-01-26",city:"Melbourne",title:"Men's Quarterfinal · Night",summary:"분위기와 시야를 함께 잡는 첫 Australian Open",activities:[a("ao-qf","17:00","Rod Laver Arena","13·16구역 중간열을 우선으로 보고, 예산을 넘으면 12·17구역으로 조정해요.","야간 세션","CBD에서 15분","트램",900000,5,[-37.8216,144.9785],img.tennis)]},
  { day:6,date:"2027-01-27",city:"Melbourne",title:"Men's Quarterfinal · Day",summary:"2층 중앙 앞줄로 예산을 아끼는 두 번째 경기",activities:[a("ao-qf-day","10:30","Rod Laver Arena","46~49 또는 28~31구역의 앞쪽 열을 선택하면 높은 시점에서 코트 전체가 잘 보여요.","주간 세션","CBD에서 15분","트램",650000,5,[-37.8216,144.9785],img.tennis)]},
  { day:7,date:"2027-01-28",city:"Great Ocean Road",title:"절벽과 남극해",summary:"준준결승과 준결승 사이의 대표 당일 여행",activities:[a("gor","07:00","Great Ocean Road","멜버른 CBD 출발 투어. 전날 경기 종료 시간에 따라 출발 시간을 확인해요.","종일","왕복 약 6시간","차량",280000,5,[-38.6806,143.391],img.oceanRoad),a("apostles","15:00","Twelve Apostles · Loch Ard Gorge","오후의 해안 절벽과 남극해를 감상해요.","2시간","차량 15분","차량",0,5,[-38.6659,143.1045],img.oceanRoad)]},
  { day:8,date:"2027-01-29",city:"Melbourne",title:"Men's Semifinal · Night",summary:"세 경기 중 좌석에 가장 많이 투자",activities:[a("ao-sf","17:00","Rod Laver Arena","14·15구역을 먼저 찾고, 65만 원을 넘으면 13·16구역으로 내려 예산을 지켜요.","야간 세션","CBD에서 15분","트램",1200000,5,[-37.8216,144.9785],img.tennis)]},
  { day:9,date:"2027-01-30",city:"Melbourne",title:"여행의 여백",summary:"St Kilda와 멜버른 도심에서 느긋한 마지막 날",activities:[a("stkilda","10:30","St Kilda","해변과 피어, 카페를 여유롭게 즐기고 일찍 짐을 정리해요.","반나절","트램 30분","트램",40000,4,[-37.8676,144.974],img.bondi),a("flinders","16:00","Flinders Street · Southbank","야라강을 따라 마지막 저녁을 보내요.","3시간","트램 25분","트램",50000,5,[-37.8183,144.9671],img.melbourne)]},
  { day:10,date:"2027-01-31",city:"Melbourne → Seoul",title:"돌아가는 아침",summary:"AO의 도시에서 여행을 마무리",activities:[a("return","06:30","Melbourne Airport","국제선은 출발 3시간 전 도착을 기준으로 역산해요.","출국","CBD에서 35분","차량",25000,5,[-37.669,144.841],img.melbourne)]},
];
