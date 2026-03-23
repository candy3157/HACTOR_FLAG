# N0N4ME7 워게임 (Flag Checker)

이 프로젝트는 React와 Vite로 구축된 정적 모의해킹/워게임 문제 플래그 검증 사이트입니다.

## 🚀 로컬 환경 실행 방법 (Getting Started)

```bash
# 1. 의존성 모듈 설치
npm install

# 2. 로컬 개발 서버 실행
npm run dev
```

---

## 🛠️ 문제 및 플래그 유지보수 가이드

이 사이트의 모든 문제 제목, 설명, 정답(Flag) 데이터는 단 하나의 파일에서 쉽게 중앙 관리됩니다.
문제 목록을 수정하거나 새로운 문제를 추가하려면 **`src/utils/flagChecker.ts`** 파일을 수정하시면 됩니다.

### 1. 정답(Flag) 수정하기
해당 파일 상단에 있는 `FLAG_MAP` 객체에서 문제를 구별하는 고유 ID(예: `challenge_1`)와 정답 문자열을 매핑합니다.

```typescript
// src/utils/flagChecker.ts
const FLAG_MAP: Record<string, string> = {
  challenge_1: "HACTOR{정성훈_선배님_짱이에요!!}",
  challenge_2: "HACTOR{w3b_d1sc0v3ry_yay}",
  // 새로운 문제를 추가할 경우 아래에 이어서 작성합니다.
  // challenge_3: "HACTOR{new_flag_here}" 
};
```

### 2. 문제 제목 및 설명(UI) 수정하기
파일 하단에 있는 `CHALLENGES` 배열에서는 사용자 화면에 보여질 문제 카드의 내용을 정의합니다.

```typescript
// src/utils/flagChecker.ts
export const CHALLENGES: Challenge[] = [
  {
    id: "challenge_1", // FLAG_MAP에 작성한 키(ID) 값과 반드시 일치해야 합니다!
    title: "1. PNG, ZIP 파일 구조 이해하기",
    description: "PNG 파일과 ZIP 파일의 구조를 이해하고, 이해한 내용을 바탕으로 문제를 해결하기."
  },
  // 새로운 문제를 추가할 경우 아래에 중괄호 객체를 추가합니다.
  // {
  //   id: "challenge_3",
  //   title: "3. 새로운 문제 제목",
  //   description: "새로운 문제에 대한 설명입니다."
  // }
];
```

### ⚠️ 주의사항 (유지보수 팁)
1. **ID 일치**: `CHALLENGES` 배열에 있는 `id` 값과 `FLAG_MAP`에 있는 속성(키) 값은 **정확히 일치**해야 합니다. (이 ID를 기준으로 정답을 판별합니다)
2. **플래그 대소문자**: 플래그 형식은 원하시는 대로 작성하시면 되며(예: `HACTOR{...}`), 대소문자와 띄어쓰기를 완벽히 구분하므로 주의해서 작성해야 합니다.
3. **진행도 초기화 테스트**: 파일을 수정한 뒤 브라우저에서 테스트할 때, 이전에 문제를 푼 기록(완료됨 상태)은 사용자의 브라우저 **로컬 스토리지에 유지**됩니다. 초기화된 상태에서 테스트하고 싶으실 때는 브라우저의 [클리어 스토리지] 기능을 사용하거나 '시크릿 창'을 열어 확인하세요.
