---
title: 원시형 결과를 가진 단순 표현식에 useMemo 사용 금지
impact: LOW-MEDIUM
impactDescription: 매 렌더링마다 낭비되는 계산
tags: rerender, useMemo, optimization
---

## 원시형 결과를 가진 단순 표현식에 useMemo 사용 금지

표현식이 단순하고(논리적 또는 산술 연산자가 적음) 원시형 결과 타입(불린, 숫자, 문자열)을 가진 경우 `useMemo`로 감싸지 마세요.
`useMemo` 호출과 훅 의존성 비교가 표현식 자체보다 더 많은 리소스를 소비할 수 있습니다.

**잘못된 예:**

```tsx
function Header({ user, notifications }: Props) {
  const isLoading = useMemo(() => {
    return user.isLoading || notifications.isLoading
  }, [user.isLoading, notifications.isLoading])

  if (isLoading) return <Skeleton />
  // 마크업 반환
}
```

**올바른 예:**

```tsx
function Header({ user, notifications }: Props) {
  const isLoading = user.isLoading || notifications.isLoading

  if (isLoading) return <Skeleton />
  // 마크업 반환
}
```
