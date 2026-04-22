---
title: 결합된 훅 계산 분리
impact: MEDIUM
impactDescription: 독립적인 단계 재계산 방지
tags: rerender, useMemo, useEffect, dependencies, optimization
---

## 결합된 훅 계산 분리

훅이 다른 의존성을 가진 여러 독립적인 작업을 포함할 때, 별도의 훅으로 분리하세요. 결합된 훅은 의존성이 변경될 때마다 모든 작업을 재실행하며, 일부 작업이 변경된 값을 사용하지 않더라도 마찬가지입니다.

**잘못된 예 (`sortOrder` 변경 시 필터링도 재계산):**

```tsx
const sortedProducts = useMemo(() => {
  const filtered = products.filter((p) => p.category === category)
  const sorted = filtered.toSorted((a, b) =>
    sortOrder === "asc" ? a.price - b.price : b.price - a.price
  )
  return sorted
}, [products, category, sortOrder])
```

**올바른 예 (products나 category 변경 시에만 필터링 재계산):**

```tsx
const filteredProducts = useMemo(
  () => products.filter((p) => p.category === category),
  [products, category]
)

const sortedProducts = useMemo(
  () =>
    filteredProducts.toSorted((a, b) =>
      sortOrder === "asc" ? a.price - b.price : b.price - a.price
    ),
  [filteredProducts, sortOrder]
)
```

이 패턴은 관련 없는 사이드 이펙트를 결합할 때 `useEffect`에도 적용됩니다:

**잘못된 예 (의존성이 변경될 때 두 effect 모두 실행):**

```tsx
useEffect(() => {
  analytics.trackPageView(pathname)
  document.title = `${pageTitle} | My App`
}, [pathname, pageTitle])
```

**올바른 예 (effect가 독립적으로 실행):**

```tsx
useEffect(() => {
  analytics.trackPageView(pathname)
}, [pathname])

useEffect(() => {
  document.title = `${pageTitle} | My App`
}, [pageTitle])
```

**참고:** 프로젝트에 [React Compiler](https://react.dev/learn/react-compiler)가 활성화된 경우 컴파일러가 의존성 추적을 자동으로 최적화하여 이러한 경우 일부를 처리할 수 있습니다.
