import type { Metadata } from 'next';
import episodes from '@/data/minasue-way/episodes.json';
import playback from '@/data/minasue-way/playback.json';
const audio: Record<string, { episodeId: string }> = playback;
import '../study.css';
import RefreshButton from '../RefreshButton';
export const metadata: Metadata = { title: 'minasue way 영어 노트', robots: { index: false, follow: false } };
export default function MinaSuePage() {
 return <main className="tablo-home"><header><p className="tablo-kicker">LISTEN · READ · SPEAK</p><h1>minasue way<br/>영어 노트</h1><p className="tablo-intro">최미나수의 일상과 생각을 영어로 만나요.<br/>한 회차씩 듣고, 읽고, 내 이야기로 말해 보세요.</p></header>
 <nav className="show-tabs" aria-label="팟캐스트 선택"><a href="/hey-tablo">Hey Tablo</a><a aria-current="page" href="/hey-tablo/minasue-way">minasue way</a></nav>
 <div className="tablo-list-tools"><RefreshButton /></div><section aria-label="에피소드 목록" className="tablo-episodes">{[...episodes].sort((a,b)=>b.number-a.number).map(ep=><article key={ep.number}><div className="tablo-card-top"><span>EP. {ep.number}</span><span className="tablo-badge">{ep.pairs ? '영한 학습본' : '자막 준비 중'}</span></div><h2><a href={`/hey-tablo/minasue-way/${ep.number}`}>{ep.titleKo}</a></h2><p className="tablo-original">{ep.title}</p><p className="tablo-description">{ep.description}</p>{ep.pairs > 0 && <p className="tablo-count">영한 {ep.pairs}쌍 · 표현 {ep.expressions}개 · 단어 {ep.words}개</p>}<div className="tablo-actions"><a className="tablo-read" href={`/hey-tablo/minasue-way/${ep.number}`}>바로 열기 →</a><a download href={`/minasue-way/ep-${ep.number}.html`}>HTML 저장</a>{audio[String(ep.number)] && <a href={`https://open.spotify.com/episode/${audio[String(ep.number)].episodeId}`} target="_blank" rel="noopener noreferrer">Spotify로 듣기 ↗</a>}</div><p className="tablo-date">{ep.updatedAt} 업데이트</p></article>)}</section><footer>공식 채널과 별개의 개인 학습 노트입니다.</footer></main>;
}
