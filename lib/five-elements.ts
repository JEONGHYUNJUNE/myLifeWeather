import {Lunar,Solar} from 'lunar-typescript';

export type BirthMeta={calendar:'solar'|'lunar';time:string;timeKnown:boolean;isLeapMonth:boolean};
export type ElementName='목'|'화'|'토'|'금'|'수';
export type FiveElementProfile={solarDate:string;dominant:ElementName;counts:Record<ElementName,number>;pillars:string[];sentence:string};
const names:ElementName[]=['목','화','토','금','수'];
const hanjaToName:Record<string,ElementName>={木:'목',火:'화',土:'토',金:'금',水:'수'};
const imagery:Record<ElementName,string>={목:'계절을 따라 자라고 방향을 바꾸는 나무',화:'온도와 빛을 또렷하게 남기는 불',토:'여러 계절을 품고 중심을 잡는 땅',금:'날씨의 경계를 선명하게 가르는 금속',수:'비와 눈처럼 기억 사이를 흐르는 물'};
const pad=(n:number)=>String(n).padStart(2,'0');

export function createFiveElementProfile(inputDate:string,meta:BirthMeta):FiveElementProfile|null{
  const [year,month,day]=inputDate.split('-').map(Number);if(!year||!month||!day)return null;
  const [hour,minute]=meta.timeKnown&&meta.time?meta.time.split(':').map(Number):[12,0];
  try{
    const lunar=meta.calendar==='lunar'
      ? Lunar.fromYmdHms(year,meta.isLeapMonth?-month:month,day,hour||0,minute||0,0)
      : Solar.fromYmdHms(year,month,day,hour||0,minute||0,0).getLunar();
    const solar=lunar.getSolar();const eight=lunar.getEightChar();
    const pillars=[eight.getYear(),eight.getMonth(),eight.getDay(),...(meta.timeKnown?[eight.getTime()]:[])];
    const wuxing=[eight.getYearWuXing(),eight.getMonthWuXing(),eight.getDayWuXing(),...(meta.timeKnown?[eight.getTimeWuXing()]:[])].join('');
    const elements=[...wuxing].map(x=>hanjaToName[x]).filter(Boolean);
    const counts=Object.fromEntries(names.map(name=>[name,elements.filter(x=>x===name).length])) as Record<ElementName,number>;
    const dominant=[...names].sort((a,b)=>counts[b]-counts[a])[0];
    return{solarDate:`${solar.getYear()}-${pad(solar.getMonth())}-${pad(solar.getDay())}`,dominant,counts,pillars,sentence:`전통 오행의 상징으로 보면 ${dominant}(${({목:'木',화:'火',토:'土',금:'金',수:'水'} as const)[dominant]})의 기운이 가장 많이 나타나요. ${imagery[dominant]}의 이미지처럼, 당신의 날씨 기록도 한 가지 표정보다 시간에 따라 변해온 장면에 가깝습니다.`};
  }catch{return null}
}
