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
  costNote?: string;
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
  domesticFlights: [
    { direction: "멜버른으로", date: "2027-01-25", status: "예약 확인", airline: "Jetstar", flightNumber: "JQ521", bookingReference: "UMH4WS", aircraft: "Airbus A320-200", departure: { time: "15:15", airport: "SYD", terminal: "T2", city: "시드니" }, arrival: { time: "16:50", airport: "MEL", terminal: "T4", city: "멜버른 · 툴라마린" }, duration: "1시간 35분", note: "공유한 1인 예약 화면 기준 · 위탁수하물 미확인 · 탑승구 미정" },
    { direction: "시드니로", date: "2027-01-30", status: "예약 확인", airline: "Jetstar", flightNumber: "JQ524", bookingReference: "", aircraft: "Airbus A320-200", departure: { time: "16:45", airport: "MEL", terminal: "T4", city: "멜버른 · 툴라마린" }, arrival: { time: "18:10", airport: "SYD", terminal: "T2", city: "시드니" }, duration: "1시간 25분", note: "현준 귀환편 · 좌석 7B (표준) · 기내 수하물 7kg · 위탁수하물 20kg · 탑승구 미정" },
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
  { day:2,date:"2027-01-23",city:"Sydney",title:"공원과 항구, Hubert의 저녁",summary:"현지 시간 기준 제안 · 도착이 늦거나 피곤하면 하이드파크 생략 · 패디스마켓은 이번 동선에서 제외",activities:[
    a("syd-arrive","10:05","Sydney Airport T1","JQ048편 도착. 입국·수하물 수령 후 하얏트 리젠시 시드니로 이동해요. 이후 시간은 도착 상황에 따라 조정해요.","약 2~2시간 30분","호텔까지 이동 포함 예상","기차",20000,4,[-33.9399,151.1753],img.sydney),
    {...a("syd-lunch","12:30","Hyatt Regency Sydney · 짐 보관과 점심","호텔에 짐을 맡기고 근처에서 점심을 먹어요. 이 일정은 오후 호텔 휴식이 없는 안이므로 피곤하면 하이드파크 대신 쉬어요.","약 1시간","이후 하이드파크까지 도보 약 20~25분 예상","도보",0,4,[-33.869,151.2025],img.sydney),costNote:"식사비 별도"},
    a("hyde-park","13:50","Hyde Park · 하이드파크","공원을 30분 정도 가볍게 산책해요. 입국이 늦어지거나 호텔에서 쉬고 싶으면 생략 가능한 일정이에요.","약 30분","항구 이동·카페 휴식에 약 40분 배정","도보",0,4,[-33.8731,151.2113],img.sydney),
    a("harbour","15:00","Sydney Opera House · Circular Quay","오페라하우스 외관과 서큘러키를 여유롭게 구경해요. 내부 투어는 포함하지 않아요.","약 1시간 15분","이후 더록스 경유 언덕까지 약 45분 배정","도보",0,5,[-33.8568,151.2153],img.sydney),
    a("observatory-hill","17:00","Observatory Hill · 옵저버토리힐","천문대 주변 언덕 공원에서 하버브리지와 항구를 감상해요. 천문대 내부 유료 투어가 아닌 외관·공원 산책이에요.","약 40분","Hubert 이동·대기 여유 약 50분","도보",0,5,[-33.8596,151.2047],img.sydney),
    {...a("hubert","18:30","Restaurant Hubert · 예약 예정","18:30~20:30 저녁 식사 제안. 아직 예약하지 않았으며 실제 예약 가능 시간에 맞춰 앞 일정을 조정해요. 식사 후 호텔로 돌아가 쉬어요.","약 2시간","15 Bligh Street · 이후 호텔 이동","도보",0,5,[-33.8654,151.2105],img.sydney),costNote:"식사비 미정 · 예약 필요"}
  ]},
  { day:3,date:"2027-01-24",city:"Blue Mountains",title:"블루마운틴 당일 여행",summary:"아침 출발·저녁 전후 복귀 투어 예정 · 상품과 시간 미확정",activities:[a("blue","07:30","Blue Mountains · 투어 예정","Three Sisters와 전망대·숲길을 즐기는 날. 집결·출발 시간은 예약할 상품 기준으로 확인해요. 페더데일 포함 여부도 상품 선택 시 결정해요. 다음 날 15:15 비행기가 있어 월요일로 옮길 수 없어요.","종일","투어 차량 · 상품별 상이","차량",90000,5,[-33.732,150.312],img.mountains),{...a("blue-return","18:00","시드니 시내 복귀 · 저녁과 휴식","17~18시 전후 복귀 상품을 우선 고려해요. 표시 시간은 예상이며 투어와 교통 상황에 따라 달라져요. 저녁은 호텔 근처에서 편하게 먹고 쉬어요.","저녁 자유 시간","복귀 장소·시간 예약 후 확인","차량",0,4,[-33.869,151.2025],img.sydney),costNote:"식사비 별도"}]},
  { day:4,date:"2027-01-25",city:"Sydney → Melbourne",title:"바다를 걷고 멜버른으로",summary:"본다이 오전 확보 · 11시까지 출발, T2 13:15 도착 목표",activities:[a("bondi","08:00","Bondi Beach · 아침과 해변 산책","07:00 호텔 체크아웃·짐 보관 후 출발해 08:00 도착을 목표로 해요. 아침·해변·아이스버그 쪽 전망을 즐겨요. 수영은 미확정 선택이며 할 경우 산책 대신 짧게 하고 씻고 갈아입을 시간을 확보해요. 11:00까지 해변 출발 → 12:00 전후 호텔에서 짐 찾기 → 12:15~12:30 공항 이동 → T2 13:15 도착 목표예요.","약 3시간","시내에서 환승·대기 포함 약 1시간 예상","차량",25000,5,[-33.8915,151.2767],img.bondi),a("syd-mel",trip.domesticFlights[0].departure.time,"Sydney T2 → Melbourne T4 · JQ521","예약 확인 · 젯스타 Airbus A320-200. 16:50 멜버른 툴라마린 도착 후 만트라 온 리틀 부르크로 이동해요. 위탁수하물과 탑승구는 예약 상세에서 확인하세요.","1시간 35분","SYD T2 13:15 도착 목표","항공",150000,5,[-37.669,144.841],img.melbourne)]},
  { day:5,date:"2027-01-26",city:"Melbourne",title:"Men's Quarterfinal · Night",summary:"45구역에서 만나는 첫 Australian Open",activities:[a("ao-qf","17:00","Rod Laver Arena · Section 45","45구역 앞쪽 좌석에서 코트 전체와 좌우 움직임을 보며 Night Session을 관람해요.","야간 세션","CBD에서 15분","트램",900000,5,[-37.8216,144.9785],img.tennis)]},
  { day:6,date:"2027-01-27",city:"Melbourne",title:"칼튼 가든스에서 쉬어가기",summary:"공원 산책 필수 · 테니스 코트 이용 없음 · 오후 AO는 선택",activities:[a("carlton-gardens","11:00","Carlton Gardens · 칼튼 가든스","전날 AO 야간 경기 후 충분히 쉬고 늦은 아침에 출발해요. 공원과 왕립전시관 외관을 구경하며 천천히 산책해요. 테니스 레슨이나 코트 예약은 포함하지 않아요.","약 1시간 30분","숙소에서 이동 여유 약 30분 배정","도보",0,5,[-37.806,144.971],img.melbourne),{...a("carlton-lunch","12:30","Carlton · 점심과 카페","공원 산책 후 칼튼 일대에서 점심·커피를 즐겨요. 오후에는 숙소에서 쉬어도 좋아요.","약 1시간 30분","인근 도보 이동","도보",0,4,[-37.8039,144.967],img.melbourne),costNote:"식사·음료비 별도"},{...a("ao-ground","15:00","Australian Open Precinct · 선택 일정","컨디션이 좋고 해당 날짜 티켓을 확보하면 연습 코트와 복식·주니어 경기를 구경해요. 경기·연습 일정은 당일 확인하며, 피곤하면 이 일정 대신 휴식해요.","선택 · 자유 일정","공원·식당에서 이동 여유 약 45분 배정","트램",0,4,[-37.8216,144.9785],img.tennis),costNote:"선택 · 티켓 확보 여부 확인"}]},
  { day:7,date:"2027-01-28",city:"Great Ocean Road",title:"절벽과 남극해",summary:"준준결승과 준결승 사이의 대표 당일 여행",activities:[a("gor","07:00","Great Ocean Road","멜버른 CBD 출발 투어. 전날 경기 종료 시간에 따라 출발 시간을 확인해요.","종일","왕복 약 6시간","차량",280000,5,[-38.6806,143.391],img.oceanRoad),a("apostles","15:00","Twelve Apostles · Loch Ard Gorge","오후의 해안 절벽과 남극해를 감상해요.","2시간","차량 15분","차량",0,5,[-38.6659,143.1045],img.oceanRoad)]},
  { day:8,date:"2027-01-29",city:"Melbourne",title:"Men's Semifinal · Day",summary:"54구역 그늘 좌석에서 보는 남자 준결승",activities:[a("ao-sf","11:00","Rod Laver Arena · Section 54","Ground Pass로 먼저 입장한 뒤 오후 2시 30분 Day Session을 관람해요. 54구역에서도 Ticketmaster의 그늘 표시를 확인합니다.","오후 2:30 세션","CBD에서 15분","트램",950000,5,[-37.8216,144.9785],img.tennis)]},
  { day:9,date:"2027-01-30",city:"Melbourne → Sydney",title:"멜버른의 마지막 장면",summary:"St Kilda를 둘러본 뒤 시드니로 돌아가 공항 가까이에서 1박",activities:[a("stkilda","09:00","St Kilda","만트라 체크아웃은 10:00까지. 09:00 관광을 나가기 전에 체크아웃하고 짐을 맡겨요. 관광 후 짐을 찾아 공항으로 이동해요.","3시간","트램 30분","트램",40000,4,[-37.8676,144.974],img.bondi),a("mel-syd",trip.domesticFlights[1].departure.time,"Melbourne T4 → Sydney T2 · JQ524","예약 확인 · 16:45 출발, 18:10 도착. 젯스타 Airbus A320-200. 현준 좌석 7B, 기내 7kg·위탁 20kg. 공항 근처에서 1박 후 다음 날 국제선 T1에서 OZ602편으로 귀국해요.","1시간 25분","MEL 14:45 도착 목표","항공",300000,5,[-33.9399,151.1753],img.sydney),a("airport-hotel","20:30","Sydney Airport 인근 호텔","공항 근처에서 마지막 1박. 다음 날 국제선 T1 이동이 쉬운 숙소를 선택해요.","1박","공항 셔틀 확인","차량",0,5,[-33.9399,151.1753],img.sydney)]},
  { day:10,date:"2027-01-31",city:"Sydney → Seoul",title:"돌아가는 아침",summary:"OZ602편으로 10:20 시드니 출발",activities:[a("return-airport","07:20","Sydney Airport T1","출발 3시간 전 국제선 터미널에 도착해 체크인과 출국 수속을 진행해요.","3시간","호텔 셔틀/택시","차량",25000,5,[-33.9399,151.1753],img.sydney),a("return","10:20","Sydney T1 · OZ602","아시아나항공 A380-800 일반석. 10시간 40분 비행 후 19:00 인천 T2에 도착해요.","10시간 40분","직항","항공",0,5,[-33.9399,151.1753],img.hero)]},
];
