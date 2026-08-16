import {NextRequest,NextResponse} from 'next/server';
import {geocodeSchema} from '../../../lib/schemas';
import {searchKoreanCities} from '../../../lib/korean-cities';
export async function GET(req:NextRequest){
 const name=req.nextUrl.searchParams.get('name')?.trim();
 if(!name||name.length<2)return NextResponse.json({error:'도시 이름을 두 글자 이상 입력해주세요.'},{status:400});
 try{
  const domestic=searchKoreanCities(name);if(domestic.length)return NextResponse.json({results:domestic});
  const u=new URL('https://geocoding-api.open-meteo.com/v1/search');u.searchParams.set('name',name);u.searchParams.set('count','6');u.searchParams.set('language','ko');u.searchParams.set('format','json');
  const r=await fetch(u,{next:{revalidate:86400}});if(!r.ok)throw new Error();return NextResponse.json(geocodeSchema.parse(await r.json()));
 }catch{return NextResponse.json({error:'도시 검색 서비스에 연결하지 못했어요. 잠시 후 다시 시도해주세요.'},{status:502})}
}
