# Chung-Website

여행, 운동 기록, 영어 학습을 모은 개인 웹사이트입니다.

- `/`: 사이트 모음 홈
- `/australia-2027`: 호주여행 일정·숙소·예산·체크리스트
- `/fitness`: 현준과 유진의 운동 기록
- `/hey-tablo`: 회차별 영한 학습 노트

## 실행과 검증

```sh
pnpm install
pnpm dev
pnpm test
pnpm build
```

Next.js와 Vercel을 사용하며 GitHub main 브랜치 푸시로 배포합니다.
인생날씨 화면과 날씨·도시 검색 API는 제거했습니다.

## 브라우저 저장 데이터

운동 기록과 여행 체크리스트는 브라우저의 localStorage에 저장됩니다.
기존 저장 키는 호환성을 위해 유지합니다. 도메인이 달라지면 저장 공간도 달라지므로
기존 주소는 기록 접근용으로 유지하며 자동으로 새 도메인에 리디렉션하지 않습니다.

Hey Tablo 게시 작업은 `docs/hey-tablo-automation.md`를 참고하세요.
