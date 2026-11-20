/* Supabase client stores only reading progress; never touches tennis tables. */
window.attachTabloCloud = function(config, reader) {
  const $ = id => document.getElementById('reader-' + id);
  const say = text => { $('cloud-status').textContent = text; };
  if (!window.supabase || !config.cloud) return;
  const client = window.supabase.createClient(config.cloud.url, config.cloud.anonKey, {
    auth: {storageKey: 'chung-heytablo-auth-v1', flowType: 'pkce', detectSessionInUrl: true}
  });
  let user = null, revision = 0, baseline = '', busy = false, loaded = false, conflict = false, generation = 0, lastPush = 0, backup = null;
  const signature = state => JSON.stringify(state);
  async function pull() {
    if (!user || busy) return;
    const token = generation; busy = true; loaded = false;
    try {
      const {data,error} = await client.from('hey_tablo_progress').select('state,revision').eq('user_id',user.id).eq('video_id',config.youtube).maybeSingle();
      if (error) throw error;
      if (token !== generation) return;
      backup = reader.read();
      revision = data?.revision || 0;
      if (data) {
        const clean = window.TabloReaderCore.cleanProgress(data.state);
        if (!clean) throw new Error('invalid-state');
        reader.apply(clean);
      }
      baseline = data ? signature(reader.read()) : '';
      loaded = true; conflict = false;
      say(data ? '클라우드 기록을 불러왔어요. 같은 계정으로 폰·PC에서 이어볼 수 있어요.' : '로그인됐어요. 현재 기록을 클라우드에 저장합니다.');
    } catch { if (token === generation) say('클라우드 기록을 불러오지 못했어요. 기기 저장은 유지됩니다. 불러오기를 눌러 다시 시도하세요.'); }
    finally { if (token === generation) busy = false; }
  }
  async function flush(force = false) {
    if (!user || !loaded || busy || conflict) return;
    const state = reader.read(), serial = signature(state);
    if (serial === baseline || (!force && Date.now()-lastPush < 5000)) return;
    const token = generation; busy = true; lastPush = Date.now();
    try {
      const {data,error} = await client.rpc('hey_tablo_save_progress',{p_video_id:config.youtube,p_state:state,p_revision:revision});
      if (error) throw error;
      if (token !== generation) return;
      if (!data?.saved) { conflict = true; say('다른 기기에서 기록이 바뀌었어요. 클라우드 불러오기 또는 이 기기 기록 올리기를 선택하세요.'); return; }
      revision = data.revision; baseline = serial;
      say('☁ 클라우드 저장됨 · ' + window.TabloReaderCore.formatTime(state.position));
    } catch { if (token === generation) say('클라우드 저장 대기 중 · 기기에는 저장됐어요. 연결되면 다시 시도합니다.'); }
    finally { if (token === generation) busy = false; }
  }
  async function sessionChanged(session) {
    const next = session?.user || null;
    if (next?.id === user?.id) return;
    generation++; busy = false; loaded = false; conflict = false; revision = 0; baseline = '';
    user = next;
    reader.account(user?.id || null);
    $('login-form').hidden = !!user; $('cloud-actions').hidden = !user;
    $('account').textContent = user ? `로그인: ${user.email?.replace('@ot-tennis.app','') || '내 계정'}` : '';
    if (user) { await pull(); await flush(true); }
    else say('로그인하면 재생 위치와 책갈피를 폰·PC에서 함께 사용할 수 있어요.');
  }
  $('login-form').onsubmit = async e => {
    e.preventDefault(); $('login').disabled = true; say('로그인 중…');
    const id = $('login-id').value.trim().toLowerCase();
    try {
      const {error} = await client.auth.signInWithPassword({email:id.includes('@') ? id : id+'@ot-tennis.app',password:$('password').value});
      if (error) throw error;
      $('password').value = '';
    } catch { say('로그인하지 못했어요. 테니스 아이디·비밀번호와 네트워크 연결을 확인해 주세요.'); }
    finally { $('login').disabled = false; }
  };
  $('google').onclick = async () => {
    if (location.origin !== 'https://chung-website.vercel.app') {
      say('Google 로그인은 청 웹사이트에서 이용해 주세요.');
      return;
    }
    const {error} = await client.auth.signInWithOAuth({provider:'google',options:{redirectTo:location.origin+location.pathname}});
    if(error) say('Google 로그인 연결에 실패했어요. 다시 시도해 주세요.');
  };
  $('logout').onclick = async () => { await flush(true); const {error} = await client.auth.signOut({scope:'local'}); if(error) say('로그아웃에 실패했어요. 다시 시도해 주세요.'); };
  $('cloud-pull').onclick = pull;
  $('cloud-push').onclick = async () => {
    if (!user || busy) return;
    // Explicit user choice can replace the server snapshot, including a pre-login local backup.
    const local = backup || reader.read();
    await pull();
    if (!loaded) return;
    reader.apply(local); backup = null; baseline = ''; await flush(true);
  };
  client.auth.onAuthStateChange((_event,session) => { setTimeout(() => sessionChanged(session),0); });
  client.auth.getSession().then(({data,error}) => { if(error) say('로그인 상태 확인에 실패했어요.'); else sessionChanged(data.session); });
  setInterval(() => flush(), 5000);
  window.addEventListener('online', () => loaded ? flush(true) : pull());
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') flush(true); });
  return {changed: () => { backup = null; }, flush};
};
