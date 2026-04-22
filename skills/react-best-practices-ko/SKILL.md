---
name: vercel-react-best-practices-ko
description: Vercel 엔지니어링의 React 및 Next.js 성능 최적화 가이드라인 (한국어). React/Next.js 코드를 작성, 검토, 리팩토링할 때 최적의 성능 패턴을 보장하기 위해 활용합니다. React 컴포넌트, Next.js 페이지, 데이터 패칭, 번들 최적화, 성능 개선 관련 작업에 적용합니다.
license: MIT
metadata:
  author: vercel
  version: "1.0.0"
---

# Vercel React 모범 사례 (한국어)

Vercel이 관리하는 React 및 Next.js 애플리케이션을 위한 종합 성능 최적화 가이드입니다. 8개 카테고리에 걸친 70개 규칙을 포함하며, 자동화된 리팩토링 및 코드 생성을 안내하기 위해 영향도 순으로 우선순위가 매겨져 있습니다.

## 적용 시점

다음 경우에 이 가이드라인을 참고하세요:
- 새 React 컴포넌트 또는 Next.js 페이지 작성 시
- 데이터 패칭 구현 (클라이언트 또는 서버 사이드)
- 성능 문제 코드 리뷰
- 기존 React/Next.js 코드 리팩토링
- 번들 크기 또는 로딩 시간 최적화

## 우선순위별 규칙 카테고리

| 우선순위 | 카테고리 | 영향도 | 접두사 |
|---------|---------|--------|--------|
| 1 | 워터폴 제거 | CRITICAL | `async-` |
| 2 | 번들 크기 최적화 | CRITICAL | `bundle-` |
| 3 | 서버 사이드 성능 | HIGH | `server-` |
| 4 | 클라이언트 사이드 데이터 패칭 | MEDIUM-HIGH | `client-` |
| 5 | 리렌더링 최적화 | MEDIUM | `rerender-` |
| 6 | 렌더링 성능 | MEDIUM | `rendering-` |
| 7 | 자바스크립트 성능 | LOW-MEDIUM | `js-` |
| 8 | 고급 패턴 | LOW | `advanced-` |

## 빠른 참조

### 1. 워터폴 제거 (CRITICAL)

- `async-cheap-condition-before-await` - async 플래그 await 전에 저렴한 동기 조건 먼저 확인
- `async-defer-await` - 실제 사용되는 분기로 await 이동
- `async-parallel` - 독립 작업에 Promise.all() 사용
- `async-dependencies` - 부분 의존성에 better-all 사용
- `async-api-routes` - API 라우트에서 프로미스를 일찍 시작하고 늦게 await
- `async-suspense-boundaries` - Suspense로 콘텐츠 스트리밍

### 2. 번들 크기 최적화 (CRITICAL)

- `bundle-barrel-imports` - 배럴 파일 대신 직접 임포트
- `bundle-analyzable-paths` - 정적 분석 가능한 임포트/파일 경로 선호
- `bundle-dynamic-imports` - 무거운 컴포넌트에 next/dynamic 사용
- `bundle-defer-third-party` - 분석/로깅 라이브러리를 하이드레이션 후 로드
- `bundle-conditional` - 기능이 활성화될 때만 모듈 로드
- `bundle-preload` - hover/focus 시 미리 로드

### 3. 서버 사이드 성능 (HIGH)

- `server-auth-actions` - API 라우트처럼 서버 액션 인증
- `server-cache-react` - 요청별 중복 제거에 React.cache() 사용
- `server-cache-lru` - 요청 간 캐싱에 LRU 캐시 사용
- `server-dedup-props` - RSC props의 중복 직렬화 방지
- `server-hoist-static-io` - 정적 I/O (폰트, 로고)를 모듈 레벨로 호이스팅
- `server-no-shared-module-state` - RSC/SSR에서 모듈 레벨 가변 요청 상태 방지
- `server-serialization` - 클라이언트 컴포넌트에 전달되는 데이터 최소화
- `server-parallel-fetching` - 데이터 패칭 병렬화를 위한 컴포넌트 재구성
- `server-parallel-nested-fetching` - Promise.all에서 항목별 중첩 패칭 체이닝
- `server-after-nonblocking` - 비차단 작업에 after() 사용

### 4. 클라이언트 사이드 데이터 패칭 (MEDIUM-HIGH)

- `client-swr-dedup` - 자동 요청 중복 제거에 SWR 사용
- `client-event-listeners` - 전역 이벤트 리스너 중복 제거
- `client-passive-event-listeners` - 스크롤에 passive 리스너 사용
- `client-localstorage-schema` - localStorage 데이터 버전 관리 및 최소화

### 5. 리렌더링 최적화 (MEDIUM)

- `rerender-defer-reads` - 콜백에서만 사용하는 상태 구독하지 않기
- `rerender-memo` - 비용이 큰 작업을 메모이즈된 컴포넌트로 추출
- `rerender-memo-with-default-value` - 기본 비원시형 props 호이스팅
- `rerender-dependencies` - effect에서 원시형 의존성 사용
- `rerender-derived-state` - 파생 불린값 구독 (원시값 아닌)
- `rerender-derived-state-no-effect` - effect 아닌 렌더링 중 상태 도출
- `rerender-functional-setstate` - 안정적인 콜백을 위해 함수형 setState 사용
- `rerender-lazy-state-init` - 비용이 큰 값에 함수를 useState에 전달
- `rerender-simple-expression-in-memo` - 단순 원시형에는 memo 사용 금지
- `rerender-split-combined-hooks` - 독립 의존성을 가진 훅 분리
- `rerender-move-effect-to-event` - 인터랙션 로직을 이벤트 핸들러에 배치
- `rerender-transitions` - 긴급하지 않은 업데이트에 startTransition 사용
- `rerender-use-deferred-value` - 비용이 큰 렌더를 지연해 입력 반응성 유지
- `rerender-use-ref-transient-values` - 자주 변경되는 임시 값에 ref 사용
- `rerender-no-inline-components` - 컴포넌트 내부에 컴포넌트 정의 금지

### 6. 렌더링 성능 (MEDIUM)

- `rendering-animate-svg-wrapper` - SVG 요소 대신 div 래퍼 애니메이션
- `rendering-content-visibility` - 긴 목록에 content-visibility 사용
- `rendering-hoist-jsx` - 정적 JSX를 컴포넌트 외부로 추출
- `rendering-svg-precision` - SVG 좌표 정밀도 줄이기
- `rendering-hydration-no-flicker` - 클라이언트 전용 데이터에 인라인 스크립트 사용
- `rendering-hydration-suppress-warning` - 예상된 불일치 경고 억제
- `rendering-activity` - 표시/숨김에 Activity 컴포넌트 사용
- `rendering-conditional-render` - 조건부 렌더링에 &&가 아닌 삼항 연산자 사용
- `rendering-usetransition-loading` - 로딩 상태에 useTransition 선호
- `rendering-resource-hints` - 사전 로딩에 React DOM 리소스 힌트 사용
- `rendering-script-defer-async` - 스크립트 태그에 defer 또는 async 사용

### 7. 자바스크립트 성능 (LOW-MEDIUM)

- `js-batch-dom-css` - 클래스 또는 cssText로 CSS 변경 일괄 처리
- `js-index-maps` - 반복 조회를 위한 Map 구축
- `js-cache-property-access` - 루프에서 객체 프로퍼티 캐싱
- `js-cache-function-results` - 모듈 레벨 Map에 함수 결과 캐싱
- `js-cache-storage` - localStorage/sessionStorage 읽기 캐싱
- `js-combine-iterations` - 여러 filter/map을 하나의 루프로 통합
- `js-length-check-first` - 비용이 큰 비교 전 배열 길이 확인
- `js-early-exit` - 함수에서 조기 반환
- `js-hoist-regexp` - 루프 외부로 RegExp 생성 호이스팅
- `js-min-max-loop` - sort 대신 루프로 min/max 구하기
- `js-set-map-lookups` - O(1) 조회를 위해 Set/Map 사용
- `js-tosorted-immutable` - 불변성을 위해 toSorted() 사용
- `js-flatmap-filter` - 한 번의 순회로 map과 filter에 flatMap 사용
- `js-request-idle-callback` - 브라우저 유휴 시간에 비중요 작업 지연

### 8. 고급 패턴 (LOW)

- `advanced-effect-event-deps` - `useEffectEvent` 결과를 effect 의존성에 넣지 않기
- `advanced-event-handler-refs` - ref에 이벤트 핸들러 저장
- `advanced-init-once` - 앱 로드당 한 번만 초기화
- `advanced-use-latest` - 안정적인 콜백 ref를 위한 useLatest

## 사용 방법

개별 규칙 파일에서 자세한 설명과 코드 예시를 읽으세요:

```
rules/async-parallel.md
rules/bundle-barrel-imports.md
```

각 규칙 파일에 포함된 내용:
- 해당 규칙이 중요한 이유 설명
- 잘못된 코드 예시와 설명
- 올바른 코드 예시와 설명
- 추가 컨텍스트 및 참고 자료

## 전체 컴파일 문서

모든 규칙이 확장된 완전한 가이드: `AGENTS.md`
