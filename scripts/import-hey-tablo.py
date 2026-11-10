#!/usr/bin/env python3
"""Register a reviewed episode bundle. Run from any directory. No network or deploy."""
import argparse, html, json, re
from study_playback import add_playback
from study_reader import add_reader
from pathlib import Path
parser=argparse.ArgumentParser()
parser.add_argument('--source',required=True,type=Path)
parser.add_argument('--episode',required=True,type=int)
parser.add_argument('--title',required=True)
parser.add_argument('--title-ko',required=True)
parser.add_argument('--description',required=True)
parser.add_argument('--video-id',required=True)
parser.add_argument('--updated-at',required=True)
parser.add_argument('--source-kind',choices=['user-provided','verified-summary'],required=True)
a=parser.parse_args()
if a.episode<1 or not re.fullmatch(r'[A-Za-z0-9_-]{11}',a.video_id):parser.error('Invalid episode or video id')
root=Path(__file__).resolve().parents[1]
s=a.source.resolve()
learning=json.loads((s/'learning.json').read_text())
aligned=json.loads((s/'aligned.json').read_text())
pairs=[r for section in aligned for r in section['pairs']]
if a.source_kind=='verified-summary' and pairs:parser.error('verified-summary bundles must not contain a full transcript')
if any(not r.get('en') or not r.get('ko') for r in pairs):parser.error('Empty EN/KO pair')
page=(s/f'Hey-Tablo-Ep{a.episode}-Study.html').read_text()
if page.count('class="pair"')!=len(pairs):parser.error('HTML pair count mismatch')
text=(s/f'Hey-Tablo-Ep{a.episode}-GPT.txt').read_text()
for r in pairs:
 if r['en'] not in text or r['ko'] not in text:parser.error('Copy text is missing a pair')
prompt='아래 Hey Tablo 자료로 영어 회화를 연습하자. 영어로 질문을 하나씩 하고 내 답변을 기다려 줘. 답변을 자연스럽게 고친 뒤 이유를 한국어로 짧게 설명하고, 자료 속 표현을 활용하도록 도와줘. 실제 발언과 창작 예문은 구분해 줘. 첫 질문부터 시작해 줘.\n\n'
copytext=prompt+text
extra=f'''<div class="delivery-bar"><a href="/hey-tablo">← 회차 목록</a><a download="Hey-Tablo-Ep{a.episode}.html" href="/hey-tablo/ep-{a.episode}.html">HTML 저장</a><a href="#gpt-copy">GPT와 공부하기</a></div>'''
copybox='''<section id="gpt-copy"><h2>GPT와 공부하기</h2><p class="note">아래 버튼으로 학습 요청문과 전체 자료를 복사해 GPT에 붙여넣으세요. 파일 첨부는 필요 없습니다.</p><button id="copy-study" type="button">전체 자료 복사</button><p id="copy-status" role="status" class="note"></p><details><summary>직접 선택해서 복사하기</summary><textarea id="copy-text" readonly aria-label="GPT용 학습 요청문과 전체 자료">'''+html.escape(copytext)+'''</textarea></details></section>'''
copyjs='''<script>document.getElementById('copy-study').onclick=async function(){const t=document.getElementById('copy-text');const status=document.getElementById('copy-status');try{if(!navigator.clipboard)throw Error('unavailable');await navigator.clipboard.writeText(t.value);status.textContent='복사했어요. GPT 대화창에 붙여넣으세요.';}catch(e){t.closest('details').open=true;t.focus();t.select();status.textContent='텍스트를 선택했어요. 복사 메뉴 또는 Ctrl/Cmd+C로 복사하세요.';}};</script>'''
style='''<style>.delivery-bar{display:flex;flex-wrap:wrap;gap:15px;margin-bottom:26px;font-size:13px}.delivery-bar a{color:#176b53}#gpt-copy{scroll-margin-top:140px}#copy-study{background:#24583f;color:white;border:0;border-radius:8px;padding:13px 18px;font:inherit;cursor:pointer}#copy-text{display:block;width:100%;height:240px;margin-top:12px;padding:12px;font:14px/1.6 system-ui;resize:vertical;border:1px solid #b8cbbf;border-radius:6px;white-space:pre-wrap}button:focus-visible,a:focus-visible,select:focus-visible,input:focus-visible{outline:3px solid #aa9856;outline-offset:3px}@media print{.delivery-bar,#gpt-copy{display:none}}</style>'''
page=page.replace('</head>','<meta name="robots" content="noindex,nofollow,noarchive">'+style+'</head>').replace('<main>','<main>'+extra,1).replace('<h2>전체 영한 대본</h2>',copybox+'<h2>전체 영한 대본</h2>',1).replace('</body>',copyjs+'</body>')
page=add_playback(page, a.episode, a.video_id, root)
page=add_reader(page, a.episode, a.video_id, root)
if 'id="gpt-copy"' not in page:parser.error('Copy block not inserted')
entry={'number':a.episode,'title':a.title,'titleKo':a.title_ko,'description':a.description,'videoId':a.video_id,'updatedAt':a.updated_at,'sourceKind':a.source_kind,'pairs':len(pairs),'expressions':len(learning['expressions']),'words':len(learning['words'])}
manifest=root/'data/hey-tablo/episodes.json'
entries=json.loads(manifest.read_text()) if manifest.exists() else []
entries=[e for e in entries if e['number']!=a.episode]
if any(e['videoId']==a.video_id for e in entries):parser.error('Video already registered with another episode number')
entries.append(entry);entries.sort(key=lambda e:e['number'],reverse=True)
out=root/'public/hey-tablo';out.mkdir(parents=True,exist_ok=True)
(out/f'ep-{a.episode}.html').write_text(page)
(out/f'ep-{a.episode}.txt').write_text(copytext)
manifest.parent.mkdir(parents=True,exist_ok=True)
manifest.write_text(json.dumps(entries,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(entry,ensure_ascii=False))
