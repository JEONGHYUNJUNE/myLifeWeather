import {Lunar,Solar} from 'lunar-typescript';

export type BirthMeta={calendar:'solar'|'lunar';time:string;timeKnown:boolean;isLeapMonth:boolean};
export type ElementName='목'|'화'|'토'|'금'|'수';
export type FiveElementProfile={solarDate:string;dominant:ElementName;dayMaster:ElementName;dayStem:string;counts:Record<ElementName,number>;pillars:string[];sentence:string};
const names:ElementName[]=['목','화','토','금','수'];
const hanjaToName:Record<string,ElementName>={木:'목',火:'화',土:'토',金:'금',水:'수'};
const stemToName:Record<string,ElementName>={甲:'목',乙:'목',丙:'화',丁:'화',戊:'토',己:'토',庚:'금',辛:'금',壬:'수',癸:'수'};
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
    const dayStem=eight.getDayGan();
    const dayMaster=stemToName[dayStem];
    return{solarDate:`${solar.getYear()}-${pad(solar.getMonth())}-${pad(solar.getDay())}`,dominant,dayMaster,dayStem,counts,pillars,sentence:`태어난 날의 중심 글자인 일간은 ${dayStem}, 오행으로는 ${dayMaster}(${({목:'木',화:'火',토:'土',금:'金',수:'水'} as const)[dayMaster]})에 해당해요. 여덟 글자를 단순 집계하면 ${dominant}이 ${counts[dominant]}개로 가장 많습니다.`};
  }catch{return null}
}
