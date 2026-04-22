---
title: 메모이즈된 컴포넌트의 기본 비원시형 파라미터 값을 상수로 추출
impact: MEDIUM
impactDescription: 기본값에 상수를 사용하여 메모이제이션 복원
tags: rerender, memo, optimization
---

## 메모이즈된 컴포넌트의 기본 비원시형 파라미터 값을 상수로 추출

메모이즈된 컴포넌트에 배열, 함수, 객체와 같은 비원시형 선택적 파라미터의 기본값이 있는 경우, 해당 파라미터 없이 컴포넌트를 호출하면 메모이제이션이 깨집니다. 이는 매 리렌더링마다 새 값 인스턴스가 생성되어 `memo()`의 엄격한 동등성 비교를 통과하지 못하기 때문입니다.

이 문제를 해결하려면 기본값을 상수로 추출하세요.

**잘못된 예 (`onClick`이 매 리렌더링마다 다른 값 가짐):**

```tsx
const UserAvatar = memo(function UserAvatar({ onClick = () => {} }: { onClick?: () => void }) {
  // ...
})

// 선택적 onClick 없이 사용
<UserAvatar />
```

**올바른 예 (안정적인 기본값):**

```tsx
const NOOP = () => {};

const UserAvatar = memo(function UserAvatar({ onClick = NOOP }: { onClick?: () => void }) {
  // ...
})

// 선택적 onClick 없이 사용
<UserAvatar />
```
