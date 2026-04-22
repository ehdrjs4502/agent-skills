---
title: 마운트당이 아닌 앱당 한 번만 초기화
impact: LOW-MEDIUM
impactDescription: 개발 환경에서 중복 초기화 방지
tags: initialization, useEffect, app-startup, side-effects
---

## 마운트당이 아닌 앱당 한 번만 초기화

앱 로드당 한 번 실행되어야 하는 앱 전체 초기화를 컴포넌트의 `useEffect([])`에 넣지 마세요. 컴포넌트는 리마운트될 수 있고 effect가 다시 실행됩니다. 대신 모듈 레벨 가드나 진입 모듈의 최상위 init을 사용하세요.

**잘못된 예 (개발 환경에서 두 번 실행, 리마운트 시 재실행):**

```tsx
function Comp() {
  useEffect(() => {
    loadFromStorage()
    checkAuthToken()
  }, [])

  // ...
}
```

**올바른 예 (앱 로드당 한 번):**

```tsx
let didInit = false

function Comp() {
  useEffect(() => {
    if (didInit) return
    didInit = true
    loadFromStorage()
    checkAuthToken()
  }, [])

  // ...
}
```

참고: [애플리케이션 초기화](https://react.dev/learn/you-might-not-need-an-effect#initializing-the-application)
