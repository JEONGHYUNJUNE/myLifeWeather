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
  route: "Sydney → Melbourne → Sydney",
  startDate: "2027-01-22",
  endDate: "2027-01-31",
  departureNote: "1월 22일 저녁 한국 출발",
  returnNote: "1월 31일 10:20 시드니 출발",
  purpose: "Sydney first · Australian Open finale in Melbourne",
  travelers: 2,
  internationalFlights: [
    { direction: "가는 편", date: "2027-01-22", airline: "Jetstar", flightNumber: "JQ048", aircraft: "Boeing 787-800", departure: { time: "21:50", airport: "ICN", terminal: "T1", city: "서울" }, arrival: { time: "10:05", airport: "SYD", terminal: "T1", city: "시드니", nextDay: true }, duration: "10시간 15분" },
    { direction: "오는 편", date: "2027-01-31", airline: "Asiana Airlines", flightNumber: "OZ602", aircraft: "Airbus A380-800", departure: { time: "10:20", airport: "SYD", terminal: "T1", city: "시드니" }, arrival: { time: "19:00", airport: "ICN", terminal: "T2", city: "서울", nextDay: false }, duration: "10시간 40분" },
  ],
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
    { number: 1, name: "Sydney", note: "Jan 23–25 · 30–31", coordinates: [-33.8688, 151.2093] as [number, number] },
    { number: 2, name: "Blue Mountains", note: "Jan 24", coordinates: [-33.732, 150.312] as [number, number] },
    { number: 3, name: "Melbourne", note: "Jan 25–30", coordinates: [-37.8136, 144.9631] as [number, number] },
    { number: 4, name: "Great Ocean Road", note: "Jan 28", coordinates: [-38.6659, 143.1045] as [number, number] },
    { number: 5, name: "Melbourne Park", note: "Jan 26·27·29", coordinates: [-37.8216, 144.9785] as [number, number] },
  ],
  australianOpen: {
    schedule: [
      { date: "Jan 26–27", round: "Quarterfinals", selected: true, note: "Jan 26 Night 관람 · Jan 27 지정석 없음" },
      { date: "Jan 28", round: "Women's Semifinals", selected: false, note: "관람하지 않음" },
      { date: "Jan 29", round: "Men's Semifinals", selected: true, note: "Day Session · 54구역" },
      { date: "Jan 30", round: "Women's Final", selected: false, note: "Sydney 체류" },
      { date: "Jan 31", round: "Men's Final", selected: false, note: "오전 출국" },
    ],
    tickets: [
      { label: "Men's Quarterfinal · Night", date: "Jan 26", min: 430000, max: 500000, selected: true, seat: "선택 · 45구역, 가능하면 앞쪽 1~10열" },
      { label: "Men's Semifinal · Day", date: "Jan 29", min: 400000, max: 550000, selected: true, seat: "선택 · 54구역 그늘 좌석, 가능하면 앞쪽 1~10열" },
      { label: "7-Day Ground Pass", date: "Jan 25–31", min: 90000, max: 100000, selected: true, seat: "26·27·29일 낮과 자유 일정에 활용" },
      { label: "Food / merchandise", date: "현장", min: 80000, max: 120000, selected: true, seat: "식음료 위주, 굿즈는 한도 안에서" },
    ],
    targetBudget: 1500000,
    ticketDelivery: "모든 티켓은 모바일 전용이며 2026년 11월 Ticketmaster 계정에 표시될 예정입니다. 바코드가 열리면 Apple Wallet 또는 Google Wallet에 저장하세요.",
    selectedSeats: [
      { date: "Jan 26", session: "Quarterfinal · Night", section: "45", view: "sideline" as const, note: "2층 사이드라인 · 코트 전체와 좌우 움직임이 잘 보임", shade: "Night · 햇빛 걱정 없음" },
      { date: "Jan 29", session: "Men's Semifinal · Day", section: "54", view: "baseline" as const, note: "2층 베이스라인 · 서브 방향과 랠리 깊이가 잘 보임", shade: "Ticketmaster 그늘 좌석 선택" },
    ],
    notice: "2027 경기 세션과 티켓 가격은 공식 판매 일정 발표 후 다시 확인해야 합니다.",
  },
  budget: [
    { id: "ao", label: "Australian Open · 남자 지정석 2회 + Ground Pass 2인", amount: 3000000, color: "#f4b942" },
    { id: "stay", label: "Hotels · 호텔 8박 / 객실 1개", amount: 2300000, color: "#f0d6a5" },
    { id: "food", label: "Food · 2인 식비", amount: 800000, color: "#ee8d72" },
    { id: "flight", label: "Domestic flights · 시드니↔멜버른 항공 2인", amount: 600000, color: "#5f9fb3" },
    { id: "transport", label: "Public transport · 현지 교통 2인", amount: 240000, color: "#86b6a2" },
    { id: "tour", label: "Tours / Attractions · 투어·관광 2인", amount: 500000, color: "#7294c4" },
    { id: "other", label: "Other · 쇼핑·예비비", amount: 300000, color: "#a99ac4" },
  ],
} as const;

const img = trip.images;
const a = (id:string,time:string,place:string,description:string,duration:string,travelTime:string,transport:Transport,cost:number,rating:1|2|3|4|5,coordinates:[number,number],image:string):TripActivity => ({id,time,place,description,duration,travelTime,transport,cost,rating,coordinates,image});

export const tripDays: TripDay[] = [
  { day:1,date:"2027-01-22",city:"Seoul → Sydney",title:"여행의 시작",summary:"JQ048편으로 시드니의 여름을 향해 출발",activities:[a("flight-out","21:50","인천국제공항 T1 · JQ048","젯스타 보잉 787-800 일반석. 10시간 15분 비행 후 다음 날 10:05 시드니 T1에 도착해요.","10시간 15분","출발 3시간 전 도착 권장","항공",0,5,[37.4602,126.4407],img.hero)]},
  { day:2,date:"2027-01-23",city:"Sydney",title:"하버에서 시작",summary:"10:05 도착 후 오페라하우스와 항구의 밤",activities:[a("syd-arrive","10:05","Sydney Airport T1","JQ048편 도착. 입국 수속 후 공항철도로 CBD 호텔에 짐을 맡겨요.","1시간 30분","CBD까지 약 20분","기차",20000,4,[-33.9399,151.1753],img.sydney),a("harbour","14:00","Circular Quay · The Rocks","오페라하우스, 하버브리지와 오래된 골목을 한 동선으로 걸어요.","4시간","도보","도보",30000,5,[-33.861,151.2127],img.sydney)]},
  { day:3,date:"2027-01-24",city:"Blue Mountains",title:"산의 푸른 안개",summary:"시드니 체류 중 가장 긴 당일 여행",activities:[a("blue","07:30","Blue Mountains","Three Sisters와 숲길. 시야가 나쁘면 다음 날 Bondi 일정과 교체해요.","종일","기차 약 2시간","기차",90000,5,[-33.732,150.312],img.mountains)]},
  { day:4,date:"2027-01-25",city:"Sydney → Melbourne",title:"바다를 걷고 멜버른으로",summary:"Bondi 산책 후 오후 국내선 이동",activities:[a("bondi","08:00","Bondi to Coogee Walk","이른 시간 해안 산책 후 호텔에서 짐을 찾아 공항으로 이동해요.","3시간","버스 35분","차량",25000,5,[-33.8915,151.2767],img.bondi),a("syd-mel","15:30","Sydney → Melbourne","준준결승 전날 멜버른에 도착해 이동 변수를 없애요.","1시간 35분","공항 이동 20분","항공",150000,5,[-37.669,144.841],img.melbourne)]},
  { day:5,date:"2027-01-26",city:"Melbourne",title:"Men's Quarterfinal · Night",summary:"45구역에서 만나는 첫 Australian Open",activities:[a("ao-qf","17:00","Rod Laver Arena · Section 45","45구역 앞쪽 좌석에서 코트 전체와 좌우 움직임을 보며 Night Session을 관람해요.","야간 세션","CBD에서 15분","트램",900000,5,[-37.8216,144.9785],img.tennis)]},
  { day:6,date:"2027-01-27",city:"Melbourne",title:"Ground Pass 또는 휴식",summary:"지정석 없이 컨디션에 맞춰 즐기는 날",activities:[a("ao-ground","11:00","Australian Open Precinct","연습 코트와 복식·주니어 경기를 보거나, 전날 Night 경기 피로가 있으면 도심에서 쉬어요.","자유 일정","CBD에서 15분","트램",0,4,[-37.8216,144.9785],img.tennis)]},
  { day:7,date:"2027-01-28",city:"Great Ocean Road",title:"절벽과 남극해",summary:"준준결승과 준결승 사이의 대표 당일 여행",activities:[a("gor","07:00","Great Ocean Road","멜버른 CBD 출발 투어. 전날 경기 종료 시간에 따라 출발 시간을 확인해요.","종일","왕복 약 6시간","차량",280000,5,[-38.6806,143.391],img.oceanRoad),a("apostles","15:00","Twelve Apostles · Loch Ard Gorge","오후의 해안 절벽과 남극해를 감상해요.","2시간","차량 15분","차량",0,5,[-38.6659,143.1045],img.oceanRoad)]},
  { day:8,date:"2027-01-29",city:"Melbourne",title:"Men's Semifinal · Day",summary:"54구역 그늘 좌석에서 보는 남자 준결승",activities:[a("ao-sf","11:00","Rod Laver Arena · Section 54","Ground Pass로 먼저 입장한 뒤 오후 2시 30분 Day Session을 관람해요. 54구역에서도 Ticketmaster의 그늘 표시를 확인합니다.","오후 2:30 세션","CBD에서 15분","트램",950000,5,[-37.8216,144.9785],img.tennis)]},
  { day:9,date:"2027-01-30",city:"Melbourne → Sydney",title:"멜버른의 마지막 장면",summary:"St Kilda를 둘러본 뒤 시드니로 돌아가 공항 가까이에서 1박",activities:[a("stkilda","09:00","St Kilda","해변과 피어, 카페를 즐긴 뒤 호텔에서 짐을 찾아 공항으로 이동해요.","3시간","트램 30분","트램",40000,4,[-37.8676,144.974],img.bondi),a("mel-syd","18:00","Melbourne → Sydney","다음 날 10:20 국제선 출발에 여유가 있도록 저녁 국내선을 권장해요. 실제 항공편 확정 후 시간을 조정하세요.","약 1시간 30분","MEL 16:00 도착 권장","항공",300000,5,[-33.9399,151.1753],img.sydney),a("airport-hotel","20:30","Sydney Airport 인근 호텔","공항 근처에서 마지막 1박. 다음 날 국제선 T1 이동이 쉬운 숙소를 선택해요.","1박","공항 셔틀 확인","차량",0,5,[-33.9399,151.1753],img.sydney)]},
  { day:10,date:"2027-01-31",city:"Sydney → Seoul",title:"돌아가는 아침",summary:"OZ602편으로 10:20 시드니 출발",activities:[a("return-airport","07:20","Sydney Airport T1","출발 3시간 전 국제선 터미널에 도착해 체크인과 출국 수속을 진행해요.","3시간","호텔 셔틀/택시","차량",25000,5,[-33.9399,151.1753],img.sydney),a("return","10:20","Sydney T1 · OZ602","아시아나항공 A380-800 일반석. 10시간 40분 비행 후 19:00 인천 T2에 도착해요.","10시간 40분","직항","항공",0,5,[-33.9399,151.1753],img.hero)]},
];
