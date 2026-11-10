import type { Metadata } from 'next';
import episodes from '@/data/hey-tablo/episodes.json';
import './study.css';
import playback from '@/data/hey-tablo/playback.json';
const audio: Record<string, { episodeId: string }> = playback;
export const metadata: Metadata = {
  title: 'Hey Tablo 영어 노트',
  description: '한 문장씩 읽는 영한 대본과 단어 표현',
  robots: { index: false, follow: false },
};
export default function HeyTabloPage() {
  const sorted = [...episodes].sort((a,b) => b.number-a.number);
  return <main className="tablo-home">
    <header><p className="tablo-kicker">LISTEN · READ · SPEAK</p><h1>Hey Tablo<br/>영어 노트</h1>
      <p className="tablo-intro">한 문장씩 읽고, 내 이야기로 말해 보세요.<br/>영어 바로 아래 한국어, 필요한 표현은 한곳에.</p>
      <p className="tablo-schedule">매주 화요일 오전 11시 · 새 회차 확인</p>
    </header>
    <section aria-label="에피소드 목록" className="tablo-episodes">{sorted.map((ep,i) => <article key={ep.number}>
      <div className="tablo-card-top"><span>EP. {ep.number}</span>{i===0 && <span className="tablo-badge">최근 학습 노트</span>}</div>
      <h2><a href={`/hey-tablo/${ep.number}`}>{ep.titleKo}</a></h2><p className="tablo-original">{ep.title}</p>
      <p className="tablo-description">{ep.description}</p>
      <p className="tablo-count">{ep.pairs ? `영한 ${ep.pairs}쌍 · ` : ''}표현 {ep.expressions}개 · 단어 {ep.words}개</p>
      <div className="tablo-actions"><a className="tablo-read" href={`/hey-tablo/${ep.number}`}>바로 읽기 →</a><a download href={`/hey-tablo/ep-${ep.number}.html`}>HTML 저장</a>{audio[String(ep.number)] && <a href={`https://open.spotify.com/episode/${audio[String(ep.number)].episodeId}`} target="_blank" rel="noopener noreferrer">Spotify로 듣기 ↗</a>}</div>
      <p className="tablo-date">{ep.updatedAt} 업데이트 · {ep.sourceKind === 'user-provided' ? '제공 자막 기반 교정본' : '확인된 내용 기반 학습 노트'}</p>
    </article>)}</section>
    <footer>전체 대본은 직접 제공된 자막으로 정리합니다. 새 회차에 자막이 없으면 확인된 범위의 요약·학습 자료부터 추가됩니다.<br/>공식 채널과 별개의 개인 학습 노트입니다.</footer>
  </main>;
}
