from pathlib import Path
import json,re
root=Path(__file__).resolve().parents[1];asset=root/'scripts/reader'
markup=(asset/'reader.html').read_text();auth=markup[markup.index('  <details id="reader-cloud"'):markup.index('</section>')]
cloud=json.loads((root/'data/hey-tablo/supabase-public.json').read_text())
css=(asset/'reader.css').read_text()+(asset/'notes.css').read_text()
js=(asset/'vendor/supabase-2.108.2.js').read_text()+'\n'+(asset/'reader-cloud.js').read_text()+f'\nwindow.attachTabloCloud({json.dumps({"cloud":cloud})},null);\n'+(asset/'notes.js').read_text()
page='''<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>내 노트 · 영어 노트 마이페이지</title><style>body{margin:0;background:#f7f6f0}*{box-sizing:border-box}CSS</style></head><body><main class="notes-shell" id="notes-page"><nav aria-label="에피소드 목록"><a href="/hey-tablo">Hey Tablo</a><a href="/hey-tablo/minasue-way">minasue way</a></nav><h1>내 노트</h1><p class="notes-intro">기억하고 싶은 단어와 표현을 모아,<br>하나씩 내 것으로 만들어 보세요.</p>AUTH<section aria-label="내 단어와 표현"><div class="notes-tools"><div class="notes-filters" role="group" aria-label="노트 종류"><button type="button" data-notes-filter="all" aria-pressed="true">전체</button><button type="button" data-notes-filter="word" aria-pressed="false">단어</button><button type="button" data-notes-filter="expression" aria-pressed="false">표현</button></div><input id="notes-search" type="search" placeholder="단어·표현·뜻 검색" aria-label="내 노트 검색"><div class="notes-actions"><button type="button" id="notes-study">뜻 가리고 복습</button><button type="button" id="notes-refresh">새로고침</button></div></div><p id="notes-count"></p><p id="notes-status" role="status"></p><button type="button" id="notes-undo" hidden>방금 삭제한 항목 되돌리기</button><p id="notes-empty"></p><div id="notes-list"></div><div id="notes-review" hidden></div></section></main><script>JS</script></body></html>'''.replace('CSS',css).replace('AUTH',auth).replace('JS',js)
page=page.replace('Jn=` \t\n','Jn=`\\x20\\t\n')
(root/'public/english-notes/my-notes.html').write_text(page)
print('Built my notes')
