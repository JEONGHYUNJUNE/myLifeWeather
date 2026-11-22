(() => {
  const auth = window.EnglishNotesAuth;
  if (!auth) return;
  const page = document.getElementById('notes-page');
  const config = window.EnglishNotesConfig || {};
  const $ = id => document.getElementById('notes-' + id);
  const el = (tag, text, cls) => {const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;};
  const button = (text, action) => {const n=el('button',text);n.type='button';n.onclick=action;return n;};
  let user = auth.getUser(), generation = 0, entries = [], saved = new Set(), filter = 'all', studying = false, cursor = 0, undo = null, loading = false;
  const controls = [];
  const status = el('p','','notes-status');status.setAttribute('role','status');
  if (page) $('status').replaceWith(status);else document.querySelector('#vocab')?.prepend(status);
  const say = text => {status.textContent=text;};
  function requireUser() {
    if (user) return true;
    const login=document.getElementById('reader-cloud');login.open=true;login.scrollIntoView({behavior:'smooth',block:'center'});
    document.getElementById('reader-login-id').focus({preventScroll:true});
    say('로그인한 뒤 저장 버튼을 눌러 주세요. 내 계정에만 저장됩니다.');return false;
  }
  function refreshButtons() {
    for (const {node,key} of controls) {node.textContent=saved.has(key)?'✓ 내 노트에 저장됨':'+ 내 노트에 저장';node.disabled=saved.has(key);}
  }
  async function load() {
    const token=++generation; entries=[];saved=new Set();undo=null;refreshButtons();
    if (!user) {loading=false;render();say(page?'로그인하면 저장한 단어와 표현이 여기에 보여요.':'단어와 표현을 내 노트에 모아 복습하세요.');return;}
    loading=true;render();say('내 노트를 불러오는 중…');
    try {
      let all=[];
      for(let start=0;;start+=300){
        const {data,error}=await auth.client.from('english_notes_items').select('item_key,payload,created_at').eq('user_id',user.id).order('created_at',{ascending:false}).order('item_key').range(start,start+299);
        if(error)throw error;if(token!==generation)return;all.push(...data);if(data.length<300)break;
      }
      entries=all;saved=new Set(all.map(x=>x.item_key));say('');
    } catch {if(token===generation)say('내 노트를 불러오지 못했어요. 새로고침으로 다시 시도해 주세요.');}
    finally {if(token===generation){loading=false;refreshButtons();render();}}
  }
  async function save(item,node) {
    if(!requireUser())return;
    const token=generation, uid=user.id;node.disabled=true;
    try{
      const {error}=await auth.client.from('english_notes_items').upsert({user_id:uid,item_key:item.key,payload:item},{onConflict:'user_id,item_key',ignoreDuplicates:true});
      if(error)throw error;if(token!==generation)return;
      saved.add(item.key);refreshButtons();say('내 노트에 저장했어요. 마이페이지에서 복습할 수 있어요.');
    }catch{if(token===generation){node.disabled=false;say('저장하지 못했어요. 연결을 확인하고 다시 눌러 주세요.');}}
  }
  function visibleEntries(){const q=($('search')?.value||'').trim().toLowerCase();return entries.filter(x=>(filter==='all'||x.payload.kind===filter)&&(!q||[x.payload.term,x.payload.meaning,x.payload.example,x.payload.translation].join(' ').toLowerCase().includes(q)));}
  function details(item) {
    const box=el('div',undefined,'notes-answer');box.append(el('p',item.meaning,'notes-meaning'));
    if(item.nuance)box.append(el('p',item.nuance,'notes-nuance'));
    if(item.example){box.append(el('p','창작 예문','notes-label'),el('p',item.example,'notes-example'),el('p',item.translation,'notes-translation'));}
    return box;
  }
  function source(item) {
    const line=el('div',undefined,'notes-source');
    if(/^https:\/\/www.youtube.com\/watch\?/.test(item.youtube||'')){const a=el('a','영상에서 듣기 ↗');a.href=item.youtube;a.target='_blank';a.rel='noopener noreferrer';line.append(a);}
    if(/^\/hey-tablo\/(?:minasue-way\/)?\d+$/.test(item.episodePath||'')){const a=el('a',item.source||'회차 보기');a.href=item.episodePath+'#vocab';line.append(a);}
    return line;
  }
  async function remove(row,node) {
    if(!user)return;const token=generation, uid=user.id;node.disabled=true;
    try {
      const {error}=await auth.client.from('english_notes_items').delete().eq('user_id',uid).eq('item_key',row.item_key);
      if(error)throw error;if(token!==generation)return;
      undo=row;entries=entries.filter(x=>x.item_key!==row.item_key);saved.delete(row.item_key);render();say('목록에서 지웠어요. 실수했다면 되돌릴 수 있어요.');
    }catch{if(token===generation){node.disabled=false;say('삭제하지 못했어요. 잠시 후 다시 시도해 주세요.');}}
  }
  async function restore() {
    if(!undo||!user)return;const row=undo,token=generation; $('undo').disabled=true;
    try{const {error}=await auth.client.from('english_notes_items').upsert({...row,user_id:user.id},{onConflict:'user_id,item_key',ignoreDuplicates:true});if(error)throw error;if(token!==generation)return;entries.unshift(row);saved.add(row.item_key);undo=null;render();say('다시 내 노트에 넣었어요.');}
    catch{if(token===generation)say('되돌리지 못했어요. 다시 시도해 주세요.');}
    finally{if(token===generation)$('undo').disabled=false;}
  }
  function render() {
    if(!page)return;
    $('list').replaceChildren();$('review').replaceChildren();
    $('undo').hidden=!undo;$('study').disabled=!user||loading||!entries.length;$('refresh').disabled=loading;
    $('count').textContent=user?`단어 ${entries.filter(x=>x.payload.kind==='word').length}개 · 표현 ${entries.filter(x=>x.payload.kind==='expression').length}개`:'';
    for(const b of document.querySelectorAll('[data-notes-filter]'))b.setAttribute('aria-pressed',String(b.dataset.notesFilter===filter));
    const rows=visibleEntries();$('empty').hidden=loading||rows.length>0;
    $('empty').textContent=!user?'먼저 로그인해 주세요.':entries.length?'검색 조건에 맞는 항목이 없어요.':'아직 저장한 항목이 없어요. 회차의 단어·표현에서 “내 노트에 저장”을 눌러 보세요.';
    $('study').textContent=studying?'목록으로 보기':'뜻 가리고 복습';$('list').hidden=studying;$('review').hidden=!studying;
    if(studying&&rows.length){
      cursor=Math.min(cursor,rows.length-1);const row=rows[cursor],item=row.payload,card=el('article',undefined,'notes-card notes-flash');
      card.append(el('p',`${cursor+1} / ${rows.length} · ${item.kind==='word'?'단어':'표현'}`,'notes-label'),el('h2',item.term));
      const answer=details(item);answer.hidden=true;
      const reveal=button('뜻 · 예문 보기',()=>{answer.hidden=!answer.hidden;reveal.textContent=answer.hidden?'뜻 · 예문 보기':'뜻 가리기';reveal.setAttribute('aria-expanded',String(!answer.hidden));});reveal.setAttribute('aria-expanded','false');
      card.append(reveal,answer,source(item));const actions=el('div',undefined,'notes-actions');
      const prev=button('← 이전',()=>{cursor--;render();});prev.disabled=cursor===0;
      const next=button('다음 →',()=>{cursor=(cursor+1)%rows.length;render();});
      const done=button('다 외웠어요 · 삭제',()=>remove(row,done));actions.append(prev,next,done);card.append(actions);$('review').append(card);
    } else if(!studying){
      for(const row of rows){const item=row.payload,card=el('article',undefined,'notes-card');card.append(el('p',item.kind==='word'?'단어':'표현','notes-label'),el('h2',item.term));
        const d=el('details');d.append(el('summary','뜻 · 예문 보기'),details(item));card.append(el('p',item.meaning,'notes-meaning'),d,source(item));
        const del=button('삭제',()=>remove(row,del));del.setAttribute('aria-label',item.term+' 삭제');del.className='notes-delete';card.append(del);$('list').append(card);
      }
    }
  }
  if(page){
    for(const b of document.querySelectorAll('[data-notes-filter]'))b.onclick=()=>{filter=b.dataset.notesFilter;cursor=0;render();};
    $('search').oninput=()=>{cursor=0;render();};$('study').onclick=()=>{studying=!studying;cursor=0;render();if(studying)$('review').querySelector('article')?.scrollIntoView({behavior:'smooth',block:'start'});};$('refresh').onclick=load;$('undo').onclick=restore;
  } else {
    // Legacy episodes keep examples outside the table; newer episodes use inline details.
    const extra=new Map([...document.querySelectorAll('article.example')].map(n=>[n.querySelector('h4')?.textContent.trim(),n]));
    document.querySelectorAll('#vocab table').forEach((table,tableIndex)=>{
      const kind=tableIndex===0?'expression':'word';
      table.querySelectorAll('tbody tr').forEach(row=>{
        const cells=row.querySelectorAll('td');if(cells.length<2)return;
        const title=cells[0].cloneNode(true);title.querySelectorAll('a,button').forEach(n=>n.remove());const term=title.textContent.trim();
        const meaning=cells[1].cloneNode(true);meaning.querySelectorAll('small,details,button').forEach(n=>n.remove());
        const ps=row.querySelectorAll('details p'),legacy=extra.get(term),fallback=(window.EnglishNotesExamples||{})[term];
        const item={key:config.youtube+':'+kind+':'+term.toLowerCase(),kind,term,meaning:meaning.textContent.trim(),nuance:ps[0]?.textContent.trim()||legacy?.querySelector('.note')?.textContent.trim()||'',example:ps[1]?.textContent.trim()||legacy?.querySelector('.en')?.textContent.trim()||fallback?.[0]||'',translation:ps[2]?.textContent.trim()||legacy?.querySelector('.ko')?.textContent.trim()||fallback?.[1]||'',youtube:row.querySelector('a.time')?.href||'',source:config.source,episodePath:config.episodePath};
        const node=button('+ 내 노트에 저장',()=>save(item,node));node.className='notes-save';node.setAttribute('aria-label',term+' 내 노트에 저장');cells[0].append(node);controls.push({node,key:item.key});
      });
    });
  }
  auth.subscribe(next=>{user=next;cursor=0;studying=false;load();});load();
  window.addEventListener('focus',()=>{if(!loading)load();});
})();
