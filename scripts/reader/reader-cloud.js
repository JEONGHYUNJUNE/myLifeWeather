/* Supabase client stores only reading progress; never touches tennis tables. */
window.attachTabloCloud = function(config, reader) {
  const $ = id => document.getElementById('reader-' + id);
  const say = text => { $('cloud-status').textContent = text; };
  if (!window.supabase || !config.cloud) return;
  const client = window.supabase.createClient(config.cloud.url, config.cloud.anonKey, {
    auth: {storageKey: 'chung-heytablo-auth-v1', flowType: 'pkce', detectSessionInUrl: true}
  });
  const listeners = new Set();
  const notesAuth = {client, getUser: () => user, subscribe: callback => {listeners.add(callback); return () => listeners.delete(callback);}};
  window.EnglishNotesAuth = notesAuth;
  let signup = false;
  const accountEmail = id => id + '@english-notes.chung-website.vercel.app';
  let user = null, revision = 0, baseline = '', busy = false, loaded = false, conflict = false, generation = 0, lastPush = 0, backup = null;
  const signature = state => JSON.stringify(state);
  async function pull() {
    if (!reader || !user || busy) return;
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
    if (!reader || !user || !loaded || busy || conflict) return;
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
    reader?.account(user?.id || null);
    for (const listener of listeners) listener(user);
    $('login-form').hidden = !!user; $('cloud-actions').hidden = !user;
    $('account').textContent = user ? `${user.user_metadata?.display_name || user.email?.split('@')[0] || '내 계정'} 님 · 로그인됨` : '';
    document.querySelector('.reader-auth-tabs').hidden = !!user;
    $('signup-hint').hidden = !!user || !signup;
    if (user && reader) { await pull(); await flush(true); }
    else if (user) say('로그인됐어요. 내 단어와 표현을 모아 복습해 보세요.');
    else say('로그인하면 재생 위치와 책갈피를 폰·PC에서 함께 사용할 수 있어요.');
  }
  function authMode(join) {
    signup = join;
    $('name-label').hidden = $('confirm-label').hidden = $('signup-hint').hidden = !join;
    $('name').required = $('password-confirm').required = join;
    $('password').minLength = join ? 8 : 1;
    $('password').autocomplete = join ? 'new-password' : 'current-password';
    $('password').value = $('password-confirm').value = '';
    $('login').textContent = join ? '가입하고 저장하기' : '로그인';
    $('auth-login').setAttribute('aria-pressed', String(!join));
    $('auth-signup').setAttribute('aria-pressed', String(join));
    say(join ? '이름·아이디·비밀번호로 영어 노트 계정을 만드세요.' : '영어 노트에서 만든 아이디로 로그인하세요.');
  }
  $('auth-login').onclick = () => authMode(false);
  $('auth-signup').onclick = () => authMode(true);
  $('login-form').onsubmit = async e => {
    e.preventDefault();
    const id = $('login-id').value.trim().toLowerCase();
    const password = $('password').value, name = $('name').value.trim();
    if (!/^[a-z0-9_]{3,24}$/.test(id)) { say('아이디는 영문·숫자·밑줄 3~24자로 입력해 주세요.'); return; }
    if (signup && (!name || name.length > 40)) { say('이름을 1~40자로 입력해 주세요.'); return; }
    if (signup && password.length < 8) { say('비밀번호를 8자 이상으로 입력해 주세요.'); return; }
    if (signup && password !== $('password-confirm').value) { say('비밀번호가 서로 달라요. 다시 확인해 주세요.'); return; }
    $('login').disabled = $('auth-login').disabled = $('auth-signup').disabled = true;
    say(signup ? '계정을 만드는 중…' : '로그인 중…');
    try {
      const result = signup
        ? await client.auth.signUp({email:accountEmail(id),password,options:{data:{display_name:name,username:id,app:'english-notes'}}})
        : await client.auth.signInWithPassword({email:accountEmail(id),password});
      if (result.error) throw result.error;
      if (signup && !result.data?.session) { say('가입이 완료되지 않았어요. 인증 설정 확인이 필요합니다.'); return; }
      $('password').value = $('password-confirm').value = '';
      await sessionChanged(result.data.session);
    } catch (error) {
      if (signup && ['user_already_exists','email_exists'].includes(error.code)) say('이미 사용 중인 아이디예요. 다른 아이디를 입력해 주세요.');
      else if (error.status === 429) say('요청이 많아요. 잠시 후 다시 시도해 주세요.');
      else if (signup && error.code === 'weak_password') say('더 안전한 비밀번호를 사용해 주세요.');
      else say(signup ? '가입하지 못했어요. 아이디·비밀번호와 네트워크 연결을 확인해 주세요.' : '로그인하지 못했어요. 영어 노트 아이디·비밀번호를 확인해 주세요.');
    } finally { $('login').disabled = $('auth-login').disabled = $('auth-signup').disabled = false; }
  };
  $('logout').onclick = async () => { await flush(true); const {error} = await client.auth.signOut({scope:'local'}); if(error) say('로그아웃에 실패했어요. 다시 시도해 주세요.'); };
  $('cloud-pull').hidden = $('cloud-push').hidden = !reader;
  $('cloud-pull').onclick = pull;
  $('cloud-push').onclick = async () => {
    if (!reader || !user || busy) return;
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
