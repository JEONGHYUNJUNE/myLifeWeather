import {NextRequest,NextResponse} from 'next/server';
import {weatherRequestSchema} from '../../../lib/schemas';
const daily=['weather_code','temperature_2m_mean','temperature_2m_max','temperature_2m_min','apparent_temperature_mean','precipitation_sum','rain_sum','snowfall_sum','precipitation_hours','sunshine_duration','daylight_duration','cloud_cover_mean','wind_speed_10m_max','wind_gusts_10m_max'];
const iso=(d:Date)=>d.toISOString().slice(0,10);
const shift=(date:string,n:number)=>{const d=new Date(date+'T12:00:00Z');d.setUTCDate(d.getUTCDate()+n);return iso(d)};
async function load(endpoint:string,latitude:number,longitude:number,startDate:string,endDate:string){
 const u=new URL(endpoint);Object.entries({latitude:String(latitude),longitude:String(longitude),start_date:startDate,end_date:endDate,daily:daily.join(','),timezone:'auto'}).forEach(([k,v])=>u.searchParams.set(k,v));
 const r=await fetch(u,{next:{revalidate:endpoint.includes('archive')?31536000:3600}});if(!r.ok)throw new Error(`weather ${r.status}`);const data=await r.json();if(!data.daily?.time)throw new Error('missing daily');
 return data.daily.time.map((date:string,i:number)=>Object.fromEntries([['date',date],...daily.map(k=>[k,data.daily[k]?.[i]??null])]));
}
export async function POST(req:NextRequest){try{
 const input=weatherRequestSchema.parse(await req.json());const oldest=new Date();oldest.setFullYear(oldest.getFullYear()-100);if(input.startDate<iso(oldest))return NextResponse.json({error:'현재는 최근 100년 이내의 날씨만 분석할 수 있어요.'},{status:400});
 const cutoff=new Date();cutoff.setUTCDate(cutoff.getUTCDate()-6);const archiveEnd=iso(cutoff);let days:Record<string,unknown>[]=[];
 if(input.startDate<=archiveEnd){days=await load('https://archive-api.open-meteo.com/v1/archive',input.latitude,input.longitude,input.startDate,input.endDate<archiveEnd?input.endDate:archiveEnd)}
 if(input.endDate>archiveEnd){const recentStart=input.startDate>archiveEnd?input.startDate:shift(archiveEnd,1);days.push(...await load('https://api.open-meteo.com/v1/forecast',input.latitude,input.longitude,recentStart,input.endDate))}
 return NextResponse.json({days});
 }catch(e){const message=e instanceof Error&&e.name==='ZodError'?'요청한 위치나 기간이 올바르지 않아요.':'날씨 자료를 불러오지 못했어요. 잠시 후 다시 시도해주세요.';return NextResponse.json({error:message},{status:502})}}
