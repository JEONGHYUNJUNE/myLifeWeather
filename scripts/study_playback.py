"""Inline playback controls for online and downloaded study HTML."""
import html
import json
import re


def add_playback(page, episode, video_id, root):
    config_path = root / 'data/hey-tablo/playback.json'
    config = json.loads(config_path.read_text()) if config_path.exists() else {}
    audio = config.get(str(episode))
    if not audio:
        return page
    episode_id = audio['episodeId']
    if not re.fullmatch(r'[A-Za-z0-9]{22}', episode_id):
        raise ValueError('Invalid Spotify episode ID')
    spotify = 'https://open.spotify.com/episode/' + episode_id
    youtube = 'https://www.youtube.com/watch?v=' + video_id
    bar = f'''<section class="listen-bar" aria-label="에피소드 듣기"><div><a href="{youtube}" target="_blank" rel="noopener noreferrer">YouTube로 보기 ↗</a><a href="{spotify}" target="_blank" rel="noopener noreferrer">Spotify로 듣기 ↗</a></div><p class="note">분·초를 눌러 재생 서비스를 선택하세요. Spotify는 재생 버튼이나 로그인이 필요할 수 있어요. 광고·편집에 따라 실제 발언 시각은 다를 수 있습니다.</p></section>'''
    if not audio.get('timestampVerified'):
        bar = bar.replace('분·초를 눌러 재생 서비스를 선택하세요. ', '')
    style = '''<style>.listen-bar{margin:20px 0}.listen-bar>div{display:flex;flex-wrap:wrap;gap:10px}.listen-bar a,.playback-choices a{display:block;border:1px solid #b8cbbf;border-radius:10px;padding:12px 16px;text-decoration:none;font-weight:650;color:#176b53;font-size:14px}.listen-bar a:hover,.playback-choices a:hover{background:#e9f1ea}.playback-dialog{color:#25332f;background:#fffefb;border:1px solid #b8cbbf;border-radius:20px;padding:24px;max-width:420px;width:calc(100% - 32px);max-height:85vh;overflow:auto}.playback-dialog::backdrop{background:#172f2699}.playback-dialog h2{margin:0 0 8px;font-size:23px}.playback-choices{display:grid;gap:10px;margin:20px 0}.playback-dialog button{font:inherit;background:transparent;border:1px solid #b8cbbf;border-radius:8px;padding:9px 16px;cursor:pointer}.time{padding:4px 0;min-height:24px}.time:focus-visible,.chapter-time:focus-visible{outline:3px solid #aa9856;outline-offset:2px}@media print{.listen-bar,.playback-dialog{display:none}}</style>'''
    dialog = '''<dialog class="playback-dialog" id="playback-choice" aria-labelledby="playback-title" aria-describedby="playback-note"><h2 id="playback-title">어디서 들을까요?</h2><p id="playback-moment"></p><div class="playback-choices"><a id="playback-youtube" target="_blank" rel="noopener noreferrer">YouTube로 보기 ↗</a><a id="playback-spotify" target="_blank" rel="noopener noreferrer">Spotify로 듣기 ↗</a></div><p id="playback-note" class="note">선택한 시간으로 새 창을 엽니다. Spotify 앱·로그인 상태에 따라 재생 버튼을 눌러야 할 수 있어요.</p><form method="dialog"><button>닫기</button></form></dialog>'''
    script = '''<script>(()=>{const dialog=document.getElementById('playback-choice');if(!dialog||typeof dialog.showModal!=='function')return;const spotify=SPOTIFY;document.querySelectorAll('a.time,a.chapter-time').forEach(link=>{const url=new URL(link.href);if(url.hostname!=='www.youtube.com')return;const raw=url.searchParams.get('t');if(!/^\\d+s?$/.test(raw||''))return;const seconds=parseInt(raw,10);link.addEventListener('click',event=>{if(event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;event.preventDefault();document.getElementById('playback-moment').textContent=String(Math.floor(seconds/60)).padStart(2,'0')+':'+String(seconds%60).padStart(2,'0')+'부터 듣기';document.getElementById('playback-youtube').href=url.href;document.getElementById('playback-spotify').href=spotify+'?t='+seconds;dialog.showModal();});});dialog.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>dialog.close()));dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();});})();</script>'''.replace('SPOTIFY', json.dumps(spotify))
    # Regeneration is safe when handed a previously decorated page.
    page = re.sub(r'<!--PLAYBACK-START-->.*?<!--PLAYBACK-END-->', '', page, flags=re.S)
    page = page.replace('<nav class="toolbar"', '<!--PLAYBACK-START-->'+style+bar+'<!--PLAYBACK-END--><nav class="toolbar"', 1)
    if audio.get('timestampVerified'):
        page = page.replace('</body>', '<!--PLAYBACK-START-->'+dialog+script+'<!--PLAYBACK-END--></body>')
    return page
