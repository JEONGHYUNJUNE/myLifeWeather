# Hey Tablo 학습 노트 운영

## 주소와 실행 일정

- 목록: https://chung-website.vercel.app/hey-tablo
- 회차: https://chung-website.vercel.app/hey-tablo/45 (숫자는 회차 번호)
- 내려받기: /hey-tablo/ep-45.html
- 복사용 원문: /hey-tablo/ep-45.txt
- 기존 Codex heartbeat `automation`: 매주 화요일 오전 11시 Asia/Seoul. 이 작업은 Codex 자동화이며 Vercel 자체 cron이 아니다.
- 운영 저장소: JEONGHYUNJUNE/myLifeWeather, main 변경 시 기존 Vercel 연동으로 배포.

## 회차 생성

1. 공식 채널 https://www.youtube.com/@heytablo/videos 와 재생목록 https://www.youtube.com/playlist?list=PLo_1AJJQmu6kutMpJ4qTNTGxPGVHrBnE4 에서 새 정규 회차를 확인한다. `data/hey-tablo/episodes.json`의 videoId와 number로 중복을 막는다. 45회 이후만 자동 추가하며 지난 회차 전체를 소급하지 않는다.
2. 사용자 제공 자막이 있으면 영어 오기·문장 경계를 검수하고 영어 한 문장 바로 아래 한국어로 정리한다. 자료에 없는 발언, 시각, 화자 이름을 추측하지 않는다. 실제 음성 대조 여부를 명시한다.
3. 사용자 제공 자막이 없는 링크 영상은 전체 대본과 전체 번역을 재현하지 않는다. 확인 가능한 원문을 바탕으로 요약, 짧은 표현, 창작 예문, 퀴즈를 작성한다. 원문 접근이 안 되면 제목·설명으로 확인한 범위만 쓰고 검증되지 않은 학습 표현을 실제 발언처럼 제시하지 않는다. 대본이 필요하다는 새 사용자 조치는 한 번만 알리고 기존 문제를 반복 통지하지 않는다.
4. 45회와 같은 모바일 우선 단일 HTML을 만든다. 표현 15개·단어 15개는 간결한 두 열 표, 상세 뉘앙스와 창작 예문은 접기, 대본은 영한 문장 쌍, 검색·번역 숨기기·구간 목차·퀴즈 5개. 390px에서도 가로 스크롤 없이 읽히게 한다. 실제 등장 표현과 추가 학습은 구분한다.
5. 완성 번들에 다음 파일을 넣는다: `aligned.json` (time/title/pairs[{en,ko}] 배열), `learning.json` (expressions/words/quiz), `Hey-Tablo-EpN-Study.html`, `Hey-Tablo-EpN-GPT.txt`. TXT에 모든 EN/KO 쌍이 있어야 한다. 요약만 있는 번들은 aligned를 빈 배열로 만들고 HTML에는 `<main>`과 `<h2>전체 영한 대본</h2>` 위치 표식을 둔다. 표식 바로 뒤에 '전체 대본은 자막 제공 후 추가됩니다'라고 표시한다.
6. 아래 importer로 등록한다. 새로운 회차 데이터와 생성 HTML/TXT만 교체한다. 기존 홈·운동·여행 기능과 사용자 변경을 수정하지 않는다.

```sh
python3 scripts/import-hey-tablo.py --source /absolute/path/to/bundle --episode 46 --title '확인한 영어 제목' --title-ko '한국어 제목' --description '확인된 내용을 요약한 한두 문장' --video-id '확인한11자리ID' --updated-at YYYY-MM-DD --source-kind user-provided
```

자막을 받지 못한 요약은 `--source-kind verified-summary`를 사용한다. importer는 전체 대본을 요약으로 잘못 표시하지 못하도록 pairs가 비어 있는지 검사한다. 사용자가 이후 자막을 주면 같은 회차를 user-provided 번들로 교체한다. importer는 동일 회차를 중복 생성하지 않는다.

## 검수와 배포

- 작업 시작 시 최신 origin/main과 저장소 지침, 작업 트리 변경을 확인한다. 이 채팅의 작업 checkout은 `/Users/hj/.codex/visualizations/2026/10/31/01a1918d-c572-7973-884c-7eb985387275/myLifeWeather-heytablo`이다. 없으면 원본 프로젝트 또는 깨끗한 checkout을 사용한다.
- `npm run build`, `npm test`, `git diff --check`를 실행한다. 모바일 레이아웃, 영어/한국어 순서, 끝 문장, 번역 숨김, 검색, GPT 전체 복사를 확인한다.
- 관련 파일만 commit하고 origin/main에 push한다. 사용자가 이 기능과 회차 추가 배포를 승인했다. 다른 작업자의 변경을 덮거나 force push하지 않는다. 원격 변경이 있으면 먼저 반영하고 영향을 받는 검증을 다시 한다.
- GitHub 커밋 상태의 Vercel 성공과 실제 `/hey-tablo/N`의 HTTP 상태·회차·최종 문장을 확인한 뒤에만 배포 완료로 기록한다. 실패하면 기존 공개 회차를 유지하고 실패 지점만 보고한다.
- 새 학습 노트가 배포됐거나 새 사용자 조치가 있을 때만 알린다. 새 영상이 없으면 조용히 종료한다. 복사 요청에는 첨부만 주지 말고 채팅 안에 복사 가능한 텍스트를 제공한다.

## 45회 기준 자료

- https://www.youtube.com/watch?v=7g6TpUhZQJ0
- 사용자 제공 Tactiq 자막, 480 영한 쌍, 표현 15개, 단어 15개.
- 원본 번들: `/Users/hj/.codex/visualizations/2026/10/31/01a1918d-c572-7973-884c-7eb985387275/Hey-Tablo-Ep45`
- 단체명·프로그램명 불확실성, 장수 연구에 관한 화자 주장, 음성 미대조 안내를 보존한다.

## 듣기 서비스와 시간 이동

- 공식 Spotify 프로그램 `https://open.spotify.com/show/4ZNGEoKCuO3X8a7dHLl13h`에서 제목과 회차가 일치하는 episode ID를 확인한다. 검색 링크나 추측한 ID를 사용하지 않는다.
- `data/hey-tablo/playback.json`에 회차별 episodeId를 기록한다. Spotify 웹 플레이어에서 `?t=초` 링크를 열고 표시된 재생 위치가 일치하는지 확인한 경우에만 timestampVerified를 true로 설정하고 검증 일자·범위를 남긴다. 확인하지 못한 회차는 false로 둔다.
- importer가 Spotify 듣기 버튼과 (검증된 회차만) 분·초 재생 서비스 선택창을 단일 HTML에 포함한다. true가 아니면 기존 YouTube 시간 링크를 그대로 유지한다. 앱 실행·자동 재생·음성 내용 일치를 확인하지 않았다면 보장하지 않는다.
- 표현과 단어의 실제 등장 시각 링크도 포함한다. 다운로드 HTML에서도 선택창이 작동해야 한다.

## 재생 시간에 맞춘 자동 스크롤

- `scripts/study_reader.py`가 `scripts/reader/`의 HTML/CSS/JS를 각 회차 파일 안에 삽입한다. importer에도 연결되어 새 회차에 자동 적용된다. 전체 대본이 없는 회차에는 넣지 않는다. 기존 생성물 갱신은 `python3 scripts/study_reader.py`로 하며 재실행해도 중복되지 않는다.
- 문장별 시각은 `.pair` 안의 `a.time`에서 읽는다. 새 회차에는 제공 자막의 문장 시작 시각을 넣어야 한다. 44·45·46회 모두 문장 단위다. 44·45회는 `data/hey-tablo/ep-N-sentence-cues.json`에 제공 자막의 소수점 시작 시각과 대응 문장을 보관하고, `study_reader.py`가 문장 일치 여부를 검증한 뒤 삽입한다. 같은 자막 시작 시각을 공유하는 문장들은 첫 문장을 기준으로 따라간다. 시간 정보를 추측해서 채우지 않는다.
- YouTube 내장 플레이어는 `getCurrentTime()`과 재생 상태로 따라간다. Spotify는 iframe API의 `playback_update` 위치(ms)를 사용한다. 외부 앱/다른 탭의 재생 상태는 읽지 않는다. 수동 모드는 사용자가 맞춘 재생 시각 + 실제 경과 시간 × 선택 배속을 사용한다.
- 시작/일시정지, 현재 시각 입력, ±5초 이동, 대본 시각 ±600초 보정, 처음으로, 따라가기 해제/재개를 지원한다. 손으로 스크롤하거나 검색하면 따라가기를 풀고 오디오 재생은 유지한다. 닫으면 내장 플레이어나 수동 타이머도 멈춘다.
- YouTube 실제 재생·시간 수신·일시정지를 브라우저에서 확인했다. Spotify는 API 초기화는 되었으나 검수 브라우저에서 재생 오류가 나 실제 진행 동기화는 미확인이다. 재생 제한 안내와 수동 모드를 유지한다. 모바일 실기기의 앱 연동이나 자동 재생을 보장하지 않는다.
- 검수: 390px 가로 넘침 없음, 07:25 입력 시 해당 문장 선택, +5초 보정 시 대본 07:30, 잘못된 07:99 거절, 44회 00:06→00:14 문장 전환 및 45회 11:30 문장 선택 확인. 타임라인 순수 함수 회귀 테스트는 `scripts/reader/reader-core.test.ts`에 있다.
- API 근거: https://developers.google.com/youtube/iframe_api_reference 및 https://developer.spotify.com/documentation/embeds/references/iframe-api

- 스크롤은 현재 문장이 재생되는 동안 고정하고, 다음 시작 시각에만 부드럽게 한 번 이동한다. 문장 사이를 시간 비율로 계속 스크롤하지 않는다.


### 재생 위치와 책갈피 (2026-11-10)
- 공통 reader는 회차의 YouTube videoId별로 브라우저 localStorage에 위치·모드·보정·수동 배속·최대 100개 책갈피를 저장한다.
- 다시 열면 저장한 시각에서 일시정지 상태로 복원하며, 외부 앱 수동 모드는 듣는 앱 시각도 직접 맞춰야 한다.
- 2초 간격, 탐색·일시정지·닫기·페이지 숨김/이탈 시 저장한다. 처음으로는 위치와 보정만 초기화하고 책갈피는 유지한다.
- 비로그인 기록은 브라우저에만 저장된다. 로그인 후에는 기존 onsTennis Supabase 프로젝트의 별도 `hey_tablo_progress` 테이블에 동기화한다. 테니스 테이블은 읽거나 수정하지 않는다.
- Supabase JS 2.108.2 MIT 배포본은 `scripts/reader/vendor`에 보관하고 HTML에 포함한다. 설정은 공개용 publishable key만 담은 `data/hey-tablo/supabase-public.json`이다. 서비스 역할 키를 넣지 않는다.
- 영어 노트 전용 가입: 이름, 영문·숫자·밑줄 아이디 3~24자, 비밀번호 8자 이상 및 확인. Supabase Auth의 별도 `아이디@english-notes.chung-website.vercel.app` 네임스페이스를 쓰며 기존 Supabase 프로젝트와 progress RLS를 재사용한다. 이름은 user_metadata.display_name에 저장한다. 이메일 인증은 기존 mailer_autoconfirm 설정을 사용하며 다른 서비스의 인증 설정은 바꾸지 않는다. 신규 Google/테니스 로그인 버튼은 제거했다. 기존 로그인 세션과 UID별 기록은 보존되며 새 계정으로 자동 병합하지 않는다. 이메일이 없는 계정이므로 이메일 비밀번호 찾기는 제공하지 않는다. 비밀번호는 Supabase Auth로 직접 보내고 앱에서 따로 저장하지 않는다.
- 청 웹사이트의 `/hey-tablo/**`만 Google 복귀 허용 목록에 추가했다. 기존 테니스 site_url은 유지한다. Google 로그인은 청 웹사이트에서 사용한다.
- 로컬 저장 키도 로그인 사용자별로 분리한다. 클라우드를 우선 불러오고 불러오기 전 기기 기록은 명시적인 '이 기기 기록 올리기'로 복원 가능하다. 편집 후에는 현재 기록을 올린다.
- 변경된 기록은 5초 간격으로 동기화한다. 네트워크 오류 시 기기 기록을 유지하고 재시도한다. 페이지 종료 직전 요청은 브라우저가 중단할 수 있으므로 클라우드 저장됨 표시를 확인한다.
- 서버 revision이 다르면 자동 덮어쓰기를 멈추고 불러오기/올리기 선택을 안내한다. `supabase/migrations/20261110_hey_tablo_progress.sql`을 대상 DB에 한 번 적용했다. 일반 테니스 마이그레이션 전체를 실행하지 않는다.
- RLS는 auth.uid()가 자신의 user_id인 레코드만 읽고 쓰도록 제한한다. SQL 검수는 `supabase/tests/hey_tablo_progress.sql`의 롤백 트랜잭션을 사용한다.

## 47회 완성본 (2026-11-18)
- 사용자 제공 Tactiq 자막으로 기존 예비 노트를 교체. 영한 280쌍, 19개 구간, 실제 자막 표현 15개·단어 15개, 퀴즈 5개.
- 번들: 작업 checkout의 형제 디렉터리 `Hey-Tablo-Ep47`. `source.txt`, `pairs.tsv`, `learning.tsv`, `build.py`, `aligned.json`, `learning.json`, HTML/TXT를 보관한다.
- 각 pair의 `data-reader-seconds`에 제공 자막의 소수점 시작 시각을 보존한다. 모든 시각을 원본 자막과 검사했고, 문장 탭으로 재생/따라가기, 접힌 툴바, 번역 토글을 적용했다.
- 01:07 누락 표현과 33:14 불명확 구절은 표시하며 임의 복원하지 않는다. 34분대 반복 숫자는 읽기 좋게 줄인다. 음성 대조를 수행했다고 주장하지 않는다.
- Spotify `5iGeB1VDVQFxBxYclG6tX7` 제목 일치와 `?t=600`의 10:00 표시를 확인했다. 모바일 앱 및 음성 내용 대조는 미실시.

## minasue way (2026-11-20)
- 목록 `/hey-tablo/minasue-way`, 회차 `/hey-tablo/minasue-way/4`. 기존 `/hey-tablo/**` 인증 복귀 범위를 유지한다.
- 사용자 확인으로 최미나수의 공식 채널 `UCSNZMSZ6HHrElyvXhEOPsLw`를 추가했다. 새 프로그램의 주간 자동 확인은 아직 요청되지 않았으므로 기존 자동화는 Hey Tablo만 유지한다.
- 2026-11-19 공개 4회 `l0txIZgJdxk`, 영어 제목 `I Need to Learn to Shut Up`, 한국어 표시 제목 `다들 결혼하는데 나만 그대로일 때`.
- 사용자 제공 Tactiq 자막으로 완성본 교체: 본문 영한 395쌍, 16개 구간, 실제 등장 표현 15개·단어 15개, 창작 예문과 번역, 퀴즈 5개. 공통 reader·번역·검색·복사·저장 기능 적용.
- 번들: 작업 checkout 형제 `Mina-Sue-Ep4`. 공통 importer에 `--show minasue-way --show-title 'minasue way'`를 추가한다. 현재 번들 입력 파일명은 importer 호환을 위해 `Hey-Tablo-Ep4-Study.html`/`Hey-Tablo-Ep4-GPT.txt`지만 출력·목록·복사 프롬프트는 minasue way로 분리된다.
- 데이터 `data/minasue-way/episodes.json`, 출력 `public/minasue-way/ep-N.html`/`.txt`. playback과 sentence-cues도 show별 디렉터리에서 찾는다. 공통 reader와 클라우드 저장은 videoId로 기록을 구분한다.
- 문장별 시각은 제공 자막 시작 시각을 소수점까지 보존하며 395개 모두 원문 시각과 검증했다. 마지막 46:02~46:08 세 문장은 현재 YouTube와 Spotify 길이 40:44를 초과하므로 별도 구간에 보존하고 따라가기에서는 제외했다. 08:41 불명확 구절을 표시하며 비공개 채널 이름은 복원하지 않는다.
- Spotify 공식 show `3KKFvLyq3xUAQXFbkOJwsJ`, 4회 `6Hr7G2pgBBBLQrXXRAzRW7`. 브라우저에서 ?t=600의 10:00 표시와 slider 600000을 확인했다. 실제 Spotify 재생과 모바일 앱 시각 일치는 미확인.
- 390px 가로 넘침 없음, 접힌 툴바에서 문장 탭 후 해당 시각 이동과 따라가기 재개, 새로고침 후 20:10 이어보기, 하단 번역 토글을 확인했다. 복사 텍스트와 TXT가 동일하며 별도 세 문장도 포함한다.

## 개인 단어·표현 노트 (2026-11-22)
- `/hey-tablo/my-notes`: 기존 영어 노트 인증을 공유하는 마이페이지. 별도의 `english_notes_items` 테이블에 UID와 회차/종류/표현 키로 저장한다. RLS는 본인의 SELECT/INSERT/DELETE만 허용하며 중복 저장은 무시한다. 테니스 테이블과 독립적이다.
- 회차의 `#vocab` 첫 표는 표현, 두 번째는 단어이다. 새 회차도 이 구조를 유지한다. 인라인 details의 뉘앙스/영어 예문/번역 또는 구형 `article.example`에서 저장 내용을 추출한다. 44회 표현은 `notes-examples.json`의 창작 예문을 사용한다.
- 마이페이지는 단어/표현 필터, 검색, 뜻 가리기 복습, 예문, 출처 링크, 삭제, 현재 화면의 마지막 삭제 되돌리기를 지원한다. 계정 변경 시 이전 계정의 화면과 되돌리기를 비운다. 저장 실패를 성공으로 표시하지 않는다.
- 공유 JS/CSS 변경 시 `python3 scripts/study_reader.py`와 `python3 scripts/build-my-notes.py`를 모두 실행한다. 페이지는 인증 정보를 포함하지 않는 HTML이고 개인 항목은 로그인 후 Supabase에서 읽는다.
- 현재 따라가기 문장의 영어/한국어만 font-weight:700으로 강조한다. 모바일 표 글자 크기 및 검색창 폭을 보완했다.

- 회차 목록의 진입 버튼은 “학습 시작”으로 표시한다. 목록과 본문에 HTML 저장·다운로드 버튼을 표시하지 않는다.

## 48회 예비 노트 (2026-11-24)
- 공식 채널에서 `x0T96jO_UWI`, 영문 페이지 제목의 Ep.48 및 공식 설명 챕터를 확인했다. 사용자 제공 자막은 아직 없으며 전체 대본·발언 시각을 재현하지 않는다.
- 공식 챕터 기반 영한 요약, 주제 관련 추가 학습 표현 15개·단어 15개, 창작 예문·번역, 퀴즈 5개, 복사 기능과 개인 노트 저장을 제공한다. 전체 대본은 자막 제공 후 추가한다.
- Spotify 공식 show에서 `7L6M3z75Yn8gMWpRGFnTEn` 제목·회차 일치 확인. 시각 이동은 검증하지 않아 timestampVerified=false이다.
- 번들은 checkout 형제 `Hey-Tablo-Ep48`에 저장. 모바일 390px 가로 넘침 없음, 저장 버튼 30개, 전체 복사 성공 상태 확인. 자막 제공 요청은 이번 회차에 처음 안내했다.

## 48회 전체 영한 학습본 (2026-11-24)
- 이후 사용자가 제공한 전체 Tactiq 자막을 바탕으로 예비 노트를 대체했다. 00:00~57:17 영한 350쌍, 16개 구간, 실제 자막 표현 15개·단어 15개, 창작 예문·번역, 퀴즈 5개. sourceKind=user-provided.
- 소수점 자막 시작 시각을 따라가기 데이터로 유지한다. 공통 재생/번역/위치/책갈피/개인 노트/전체 자료 복사 기능을 적용했다. HTML 저장 버튼은 표시하지 않는다.
- 모바일 390px 가로 넘침 없음, 저장 버튼 30개, 문장 탭으로 36:26 이동 및 수동 따라가기 재개, 현재 문장 700/나머지 400 굵기, 하단 번역 숨김을 확인했다. 테스트 32개 및 프로덕션 빌드 통과. Spotify 시간 이동은 여전히 미검증이다.
