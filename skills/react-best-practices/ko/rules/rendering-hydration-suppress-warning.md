---
title: 예상된 하이드레이션 불일치 경고 억제
impact: LOW-MEDIUM
impactDescription: 알려진 차이에 대한 시끄러운 하이드레이션 경고 방지
tags: rendering, hydration, ssr, nextjs
---

## 예상된 하이드레이션 불일치 경고 억제

SSR 프레임워크(예: Next.js)에서 일부 값은 서버와 클라이언트에서 의도적으로 다릅니다(무작위 ID, 날짜, 로케일/시간대 형식). 이러한 *예상된* 불일치의 경우, 동적 텍스트를 `suppressHydrationWarning`이 있는 요소로 감싸 시끄러운 경고를 방지하세요. 실제 버그를 숨기는 데 사용하지 마세요. 남용하지 마세요.

**잘못된 예 (알려진 불일치 경고):**

```tsx
function Timestamp() {
  return <span>{new Date().toLocaleString()}</span>
}
```

**올바른 예 (예상된 불일치만 억제):**

```tsx
function Timestamp() {
  return (
    <span suppressHydrationWarning>
      {new Date().toLocaleString()}
    </span>
  )
}
```
