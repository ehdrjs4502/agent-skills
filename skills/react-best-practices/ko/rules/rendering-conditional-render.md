---
title: 명시적 조건부 렌더링 사용
impact: LOW
impactDescription: 0 또는 NaN 렌더링 방지
tags: rendering, conditional, jsx, falsy-values
---

## 명시적 조건부 렌더링 사용

조건이 렌더링되는 `0`, `NaN`, 또는 다른 거짓 값이 될 수 있을 때 조건부 렌더링에 `&&` 대신 명시적 삼항 연산자(`? :`)를 사용하세요.

**잘못된 예 (count가 0일 때 "0" 렌더링):**

```tsx
function Badge({ count }: { count: number }) {
  return (
    <div>
      {count && <span className="badge">{count}</span>}
    </div>
  )
}

// count = 0일 때: <div>0</div> 렌더링
// count = 5일 때: <div><span class="badge">5</span></div> 렌더링
```

**올바른 예 (count가 0일 때 아무것도 렌더링하지 않음):**

```tsx
function Badge({ count }: { count: number }) {
  return (
    <div>
      {count > 0 ? <span className="badge">{count}</span> : null}
    </div>
  )
}

// count = 0일 때: <div></div> 렌더링
// count = 5일 때: <div><span class="badge">5</span></div> 렌더링
```
