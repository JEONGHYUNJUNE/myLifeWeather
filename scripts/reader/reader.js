(() => {
  const config = READER_CONFIG;
  const {parseTime, formatTime, cueIndex, advance} = window.TabloReaderCore;
  const $ = id => document.getElementById('reader-' + id);
  const secondsFromLink = link => {
    if (!link) return null;
    const raw = new URL(link.href).searchParams.get('t');
    return /^\d+s?$/.test(raw || '') ? parseInt(raw, 10) : null;
  };
  const precise = Array.from(document.querySelectorAll('.pair')).map(el => ({el, time: secondsFromLink(el.querySelector('a.time'))})).filter(c => c.time !== null);
  const cues = (precise.length ? precise : Array.from(document.querySelectorAll('.script-section,.chapter')).map(el => ({el: el.querySelector('.pair') || el, time: secondsFromLink(el.querySelector('a.chapter-time'))})).filter(c => c.time !== null)).sort((a,b) => a.time - b.time);
  if (!cues.length) { $('intro').hidden = true; return; }
  $('precision').textContent = precise.length ? '제공 자막의 문장 시작 시각을 따라갑니다. 재생 시간과 어긋나면 초 단위로 보정하세요.' : '이 회차는 문장별 시각이 없어 구간 시작점 단위로 따라갑니다.';
  if (!config.spotify) $('mode').querySelector('[value="spotify"]').remove();
  let mode = 'manual', position = 0, anchor = 0, anchorAt = performance.now(), rate = 1;
  let playing = false, follow = true, offset = 0, ready = true, player = null, generation = 0;
  let active = -1, lastScroll = -1, youtubeAPI, spotifyAPI, loadTimer;
  const note = message => { $('status').textContent = message; };
  const now = () => mode === 'manual' && playing ? advance(anchor, performance.now() - anchorAt, rate) : position;
  function setPlaying(value) {
    if (mode === 'manual') { position = now(); anchor = position; anchorAt = performance.now(); }
    playing = value;
    $('play').textContent = playing ? '일시정지' : '시작';
    $('play').disabled = !ready;
  }
  function setFollow(value) {
    follow = value;
    $('follow').setAttribute('aria-pressed', String(value));
    $('follow').textContent = value ? '따라가기 켜짐' : '다시 따라가기';
    if (value) {
      const search = document.getElementById('search');
      if (search && search.value) { search.value = ''; search.dispatchEvent(new Event('input')); }
      render(true);
    }
  }
  function render(force = false) {
    if ($('dock').hidden) return;
    const current = now(), scriptTime = Math.max(0, current + offset), index = cueIndex(cues, scriptTime);
    $('clock').textContent = `재생 ${formatTime(current)} · 대본 ${formatTime(scriptTime)}`;
    if (document.activeElement !== $('time')) $('time').value = formatTime(current);
    if (index !== active) {
      if (active >= 0) cues[active].el.classList.remove('reader-active');
      if (index >= 0) cues[index].el.classList.add('reader-active');
      active = index;
    }
    if (!follow || index < 0 || (!playing && !force) || cues[index].el.closest('[hidden]')) return;
    const el = cues[index].el;
    let top = el.getBoundingClientRect().top + window.scrollY;
    const next = cues[index+1];
    if (precise.length && next && next.time > cues[index].time) {
      const fraction = Math.min(1, (scriptTime - cues[index].time) / (next.time - cues[index].time));
      top += (next.el.getBoundingClientRect().top + window.scrollY - top) * fraction;
    }
    const target = Math.max(0, top - 34);
    if (force || (precise.length && Math.abs(target-lastScroll)>3) || (!precise.length && target!==lastScroll)) {
      window.scrollTo({top: target, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
      lastScroll = target;
    }
  }
  function seek(value) {
    if (!Number.isFinite(value) || value < 0) { note('00:00 형식 또는 초 숫자로 입력해 주세요.'); return; }
    position = value; anchor = value; anchorAt = performance.now();
    if (ready && player) {
      try { mode === 'youtube' ? player.seekTo(value, true) : player.seek(Math.floor(value)); }
      catch { note('플레이어에서 직접 시간을 바꾸거나 수동 모드를 사용하세요.'); }
    }
    setFollow(true);
    note(mode === 'manual' ? '타이머를 맞췄어요. 듣는 앱도 같은 시각으로 맞춰 주세요.' : '선택한 재생 시각으로 이동합니다.');
    render(true);
  }
  function stopPlayer() {
    if (player) { try { mode === 'youtube' ? player.pauseVideo() : player.pause(); } catch {} }
    setPlaying(false);
  }
  function loadScript(src, callbackName, existing) {
    if (existing) return Promise.resolve(existing);
    return new Promise((resolve,reject) => {
      const script = document.createElement('script');
      const timer = setTimeout(() => reject(new Error('timeout')), 15000);
      window[callbackName] = api => { clearTimeout(timer); resolve(api || window.YT); };
      script.onerror = () => { clearTimeout(timer); script.remove(); reject(new Error('load')); };
      script.src = src; document.head.appendChild(script);
    });
  }
  async function changeMode() {
    position = now(); stopPlayer();
    const previous = player; player = null;
    try { previous?.destroy(); } catch {}
    const token = ++generation; clearTimeout(loadTimer);
    mode = $('mode').value; ready = mode === 'manual';
    $('player').hidden = ready;
    $('rate-label').hidden = !ready;
    $('player').innerHTML = '<div id="reader-player-target"></div>';
    setPlaying(false);
    if (ready) { anchor = position; anchorAt = performance.now(); note('다른 앱의 현재 시간을 입력하고 시작하세요. 앱의 재생 상태는 자동으로 읽지 않습니다.'); return; }
    note('플레이어를 불러오는 중입니다…');
    loadTimer = setTimeout(() => {
      if (token === generation && !ready) note('플레이어 연결이 늦어지고 있어요. 다른 앱으로 듣기 · 수동 시간을 사용할 수 있습니다.');
    }, 12000);
    try {
      if (mode === 'youtube') {
        youtubeAPI ||= loadScript('https://www.youtube.com/iframe_api', 'onYouTubeIframeAPIReady', window.YT?.Player ? window.YT : null).catch(e => { youtubeAPI = null; throw e; });
        const api = await youtubeAPI;
        if (token !== generation || $('dock').hidden) return;
        player = new api.Player('reader-player-target', {
          width: '100%', height: 200, videoId: config.youtube,
          playerVars: {playsinline: 1, start: Math.floor(position), origin: location.protocol === 'file:' ? undefined : location.origin},
          events: {
            onReady: e => {
              if (token !== generation) return;
              clearTimeout(loadTimer); ready = true; setPlaying(false);
              note('시작 또는 영상의 재생 버튼을 누르세요. 일시정지·탐색·배속을 실제 영상 시간으로 따라갑니다.');
            },
            onStateChange: e => {
              if (token !== generation) return;
              setPlaying(e.data === 1);
              if (e.data === 0) note('재생이 끝났어요. 처음으로 버튼으로 다시 시작할 수 있습니다.');
            },
            onError: () => { if (token === generation) {ready = false; setPlaying(false); note('이 영상은 여기서 재생할 수 없어요. 다른 앱으로 듣기 · 수동 시간을 선택해 주세요.');} }
          }
        });
      } else {
        spotifyAPI ||= loadScript('https://open.spotify.com/embed/iframe-api/v1', 'onSpotifyIframeApiReady').catch(e => { spotifyAPI = null; throw e; });
        const api = await spotifyAPI;
        if (token !== generation || $('dock').hidden) return;
        api.createController($('player-target'), {uri: 'spotify:episode:' + config.spotify, width: '100%', height: 200}, controller => {
          if (token !== generation) { controller.destroy(); return; }
          player = controller;
          controller.addListener('ready', () => {
            if (token !== generation) return;
            clearTimeout(loadTimer); ready = true; setPlaying(false);
            if (position) controller.seek(Math.floor(position));
            note('시작 또는 Spotify 안의 재생 버튼을 누르세요. 로그인·재생 제한이 있으면 수동 모드를 사용하세요.');
          });
          controller.addListener('playback_update', e => {
            if (token !== generation) return;
            if (Number.isFinite(e.data.position)) position = e.data.position / 1000;
            setPlaying(!e.data.isPaused && !e.data.isBuffering);
            render();
          });
        });
      }
    } catch {
      if (token === generation) {ready = false; setPlaying(false); note('플레이어 연결에 실패했어요. 다른 앱으로 듣기 · 수동 시간을 선택해 주세요.');}
    }
  }
  $('open').onclick = () => {
    $('dock').hidden = false; document.body.classList.add('reader-open');
    if (mode !== 'manual' && !player) changeMode();
    $('play').focus(); render();
  };
  $('close').onclick = () => {
    stopPlayer(); ++generation; clearTimeout(loadTimer);
    try { player?.destroy(); } catch {} player = null;
    $('dock').hidden = true; document.body.classList.remove('reader-open');
    if (active >= 0) cues[active].el.classList.remove('reader-active'); active = -1;
    $('open').focus();
  };
  $('mode').onchange = changeMode;
  $('play').onclick = () => {
    if (mode === 'manual') { setPlaying(!playing); if (playing) setFollow(true); note(playing ? '수동 타이머로 대본을 따라가는 중입니다.' : '타이머를 멈췄어요. 다른 앱의 재생도 직접 멈춰 주세요.'); }
    else if (player && ready) {
      if (playing) stopPlayer();
      else { mode === 'youtube' ? player.playVideo() : player.resume(); setFollow(true); note('재생 요청을 보냈어요. 시작되지 않으면 플레이어 안의 재생 버튼을 누르세요.'); }
    }
  };
  $('follow').onclick = () => setFollow(!follow);
  $('seek').onclick = () => { const time = parseTime($('time').value); if (time === null) note('분:초(예: 07:25) 또는 초 숫자를 입력해 주세요.'); else seek(time); };
  $('time').onkeydown = e => { if (e.key === 'Enter') $('seek').click(); };
  $('back').onclick = () => seek(Math.max(0,now()-5));
  $('forward').onclick = () => seek(now()+5);
  $('reset').onclick = () => { stopPlayer(); offset=0; $('offset').value='0'; seek(0); };
  function updateOffset(normalize) {
    const raw=$('offset').value;
    if (raw === '' || raw === '-' || !Number.isFinite(Number(raw))) return;
    offset=Math.max(-600,Math.min(600,Number(raw)));
    if(normalize) $('offset').value=String(offset);
    render(true);
  }
  $('offset').oninput = () => updateOffset(false);
  $('offset').onchange = () => updateOffset(true);
  $('rate').onchange = () => { position=now(); anchor=position; anchorAt=performance.now(); rate=Number($('rate').value); };
  function manualBrowse(e) {
    if ($('dock').hidden || $('dock').contains(e.target) || !follow) return;
    setFollow(false); note('직접 스크롤 중입니다. 다시 따라가기를 누르면 현재 대본으로 돌아갑니다.');
  }
  document.addEventListener('click', e => {
    const link=e.target.closest('a');
    if (!$('dock').hidden && link && !$('dock').contains(link)) {
      setFollow(false);
      if (link.matches('a.time,a.chapter-time')) stopPlayer();
    }
  });
  document.addEventListener('wheel',manualBrowse,{passive:true});
  document.addEventListener('touchmove',manualBrowse,{passive:true});
  document.addEventListener('keydown', e => {if (['PageDown','PageUp','ArrowDown','ArrowUp','Home','End'].includes(e.key) && !/INPUT|SELECT|TEXTAREA/.test(e.target.tagName)) manualBrowse(e);});
  document.getElementById('search')?.addEventListener('input', e => { if(e.target.value && !$('dock').hidden) {setFollow(false); note('검색 중에는 자동 스크롤을 쉬어요. 다시 따라가기를 누르면 검색을 지웁니다.');} });
  document.getElementById('jump')?.addEventListener('change', () => {if (!$('dock').hidden) setFollow(false);});
  new ResizeObserver(() => document.body.style.setProperty('--reader-space', ($('dock').offsetHeight+35)+'px')).observe($('dock'));
  setInterval(() => {
    if ($('dock').hidden) return;
    if (mode === 'youtube' && ready && player?.getCurrentTime) {
      const value=player.getCurrentTime(); if (Number.isFinite(value)) position=value;
    }
    render();
  },200);
})();
