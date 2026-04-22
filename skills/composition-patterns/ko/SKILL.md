---
name: vercel-composition-patterns
description:
  확장 가능한 React 컴포지션 패턴. boolean prop이 많아진 컴포넌트를 리팩토링하거나,
  유연한 컴포넌트 라이브러리를 구축하거나, 재사용 가능한 API를 설계할 때 활용합니다.
  컴파운드 컴포넌트, 렌더 프롭, 컨텍스트 프로바이더, 컴포넌트 아키텍처가 포함된
  작업에 적용합니다. React 19 API 변경사항도 포함합니다.
license: MIT
metadata:
  author: vercel
  version: '1.0.0'
---

# React 컴포지션 패턴

유연하고 유지보수 가능한 React 컴포넌트를 만들기 위한 컴포지션 패턴입니다.
boolean prop 남발을 방지하기 위해 컴파운드 컴포넌트, 상태 끌어올리기, 내부 컴포즈를 사용합니다.
이 패턴들은 코드베이스가 성장할수록 사람과 AI 에이전트 모두가 작업하기 쉽게 만들어줍니다.

## 적용 시점

다음 경우에 이 가이드라인을 참고하세요:

- boolean prop이 많아진 컴포넌트를 리팩토링할 때
- 재사용 가능한 컴포넌트 라이브러리를 구축할 때
- 유연한 컴포넌트 API를 설계할 때
- 컴포넌트 아키텍처를 검토할 때
- 컴파운드 컴포넌트나 컨텍스트 프로바이더를 다룰 때

## 우선순위별 규칙 카테고리

| 우선순위 | 카테고리          | 영향도 | 접두사          |
| -------- | ----------------- | ------ | --------------- |
| 1        | 컴포넌트 아키텍처 | HIGH   | `architecture-` |
| 2        | 상태 관리         | MEDIUM | `state-`        |
| 3        | 구현 패턴         | MEDIUM | `patterns-`     |
| 4        | React 19 API      | MEDIUM | `react19-`      |

## 빠른 참조

### 1. 컴포넌트 아키텍처 (HIGH)

- `architecture-avoid-boolean-props` - 동작 커스터마이징에 boolean prop 추가 금지; 컴포지션 사용
- `architecture-compound-components` - 공유 컨텍스트로 복잡한 컴포넌트 구조화

### 2. 상태 관리 (MEDIUM)

- `state-decouple-implementation` - 상태 관리 방법은 프로바이더만 알도록
- `state-context-interface` - 의존성 주입을 위한 state, actions, meta 제네릭 인터페이스 정의
- `state-lift-state` - 형제 컴포넌트 접근을 위해 상태를 프로바이더 컴포넌트로 끌어올리기

### 3. 구현 패턴 (MEDIUM)

- `patterns-explicit-variants` - boolean 모드 대신 명시적인 변형 컴포넌트 생성
- `patterns-children-over-render-props` - 컴포지션에는 renderX prop 대신 children 사용

### 4. React 19 API (MEDIUM)

> **⚠️ React 19 이상 전용.** React 18 이하를 사용 중이라면 이 섹션을 건너뛰세요.

- `react19-no-forwardref` - `forwardRef` 사용 금지; `useContext()` 대신 `use()` 사용

## 사용 방법

개별 규칙 파일에서 자세한 설명과 코드 예시를 읽으세요:

```
rules/architecture-avoid-boolean-props.md
rules/state-context-interface.md
```

각 규칙 파일에 포함된 내용:

- 해당 규칙이 중요한 이유 설명
- 잘못된 코드 예시와 설명
- 올바른 코드 예시와 설명
- 추가 컨텍스트 및 참고 자료

## 전체 컴파일 문서

모든 규칙이 확장된 완전한 가이드: `AGENTS.md`
