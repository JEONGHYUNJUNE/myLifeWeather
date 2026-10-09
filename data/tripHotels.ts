export type TripHotel = {
  id: string;
  city: string;
  name: string;
  englishName: string;
  address: string;
  stay: string;
  from: string;
  until: string;
  phone: string;
  officialUrl: string;
  destinations: { name: string; query: string; estimate: string; mode: "walking" | "driving" }[];
};

export const tripHotels: TripHotel[] = [
  {
    id: "sydney", city: "Sydney", name: "하얏트 리젠시 시드니", englishName: "Hyatt Regency Sydney",
    address: "161 Sussex Street, Sydney NSW 2000, Australia",
    stay: "1/23 → 1/25 · 2박", from: "2027-01-23", until: "2027-01-25",
    phone: "+61 2 8099 1234", officialUrl: "https://www.hyatt.com/hyatt-regency/en-US/sydrs-hyatt-regency-sydney/hotel-info",
    destinations: [
      { name: "달링 하버", query: "Darling Harbour Sydney", estimate: "도보 약 3분", mode: "walking" },
      { name: "QVB", query: "Queen Victoria Building Sydney", estimate: "도보 약 10분", mode: "walking" },
      { name: "타운홀", query: "Sydney Town Hall", estimate: "도보 약 12분", mode: "walking" },
      { name: "차이나타운", query: "Chinatown Sydney", estimate: "도보 약 8분", mode: "walking" },
      { name: "서큘러 키", query: "Circular Quay Sydney", estimate: "도보 약 20분", mode: "walking" },
      { name: "오페라 하우스", query: "Sydney Opera House", estimate: "도보 약 25분", mode: "walking" },
      { name: "시드니 하버 브리지", query: "Sydney Harbour Bridge", estimate: "도보 약 25분", mode: "walking" },
      { name: "시드니 공항 (SYD)", query: "Sydney Airport", estimate: "차량 약 20분", mode: "driving" },
    ],
  },
  {
    id: "melbourne", city: "Melbourne", name: "만트라 온 리틀 부르크", englishName: "Mantra on Little Bourke",
    address: "471 Little Bourke Street, Melbourne VIC 3000, Australia",
    stay: "1/25 → 1/30 · 5박", from: "2027-01-25", until: "2027-01-30",
    phone: "+61 3 9607 3000", officialUrl: "https://www.mantraonlittlebourke.com.au/contact-us/",
    destinations: [
      { name: "부르크 스트리트 몰", query: "Bourke Street Mall Melbourne", estimate: "도보 약 5분", mode: "walking" },
      { name: "멜버른 센트럴역", query: "Melbourne Central Station", estimate: "도보 약 8분", mode: "walking" },
      { name: "플린더스 스트리트역", query: "Flinders Street Station Melbourne", estimate: "도보 약 10분", mode: "walking" },
      { name: "페더레이션 스퀘어", query: "Federation Square Melbourne", estimate: "도보 약 15분", mode: "walking" },
      { name: "로드 레이버 아레나", query: "Rod Laver Arena Melbourne", estimate: "도보 약 20~25분", mode: "walking" },
      { name: "MCG", query: "Melbourne Cricket Ground", estimate: "도보 약 25분", mode: "walking" },
      { name: "퀸 빅토리아 마켓", query: "Queen Victoria Market Melbourne", estimate: "도보 약 15분", mode: "walking" },
      { name: "멜버른 공항 (MEL)", query: "Melbourne Airport Tullamarine", estimate: "차량 약 25분", mode: "driving" },
    ],
  },
];

export function hotelMapUrl(hotel: TripHotel) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${hotel.englishName}, ${hotel.address}`)}`;
}

export function hotelDirectionsUrl(hotel: TripHotel, destination: TripHotel["destinations"][number]) {
  const params = new URLSearchParams({ api: "1", origin: `${hotel.englishName}, ${hotel.address}`, destination: destination.query, travelmode: destination.mode });
  return `https://www.google.com/maps/dir/?${params}`;
}
