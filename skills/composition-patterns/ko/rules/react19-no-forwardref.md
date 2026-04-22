---
title: React 19 API 변경사항
impact: MEDIUM
impactDescription: 더 깔끔한 컴포넌트 정의와 컨텍스트 사용
tags: react19, refs, context, hooks
---

## React 19 API 변경사항

> **⚠️ React 19 이상 전용.** React 18 이하를 사용 중이라면 이 섹션을 건너뛰세요.

React 19에서는 `ref`가 일반 prop이 되었습니다(`forwardRef` 래퍼 불필요).
`use()`가 `useContext()`를 대체합니다.

**잘못된 예시 (React 19에서 forwardRef 사용):**

```tsx
const ComposerInput = forwardRef<TextInput, Props>((props, ref) => {
  return <TextInput ref={ref} {...props} />
})
```

**올바른 예시 (ref를 일반 prop으로):**

```tsx
function ComposerInput({ ref, ...props }: Props & { ref?: React.Ref<TextInput> }) {
  return <TextInput ref={ref} {...props} />
}
```

**잘못된 예시 (React 19에서 useContext 사용):**

```tsx
const value = useContext(MyContext)
```

**올바른 예시 (useContext 대신 use 사용):**

```tsx
const value = use(MyContext)
```

`use()`는 `useContext()`와 달리 조건부로 호출할 수 있습니다.
