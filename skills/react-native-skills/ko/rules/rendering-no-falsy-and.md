---
title: falsy 값에 && 절대 사용 금지
impact: CRITICAL
impactDescription: 프로덕션 크래시 방지
tags: rendering, conditional, jsx, crash
---

## falsy 값에 && 절대 사용 금지

`value`가 빈 문자열이나 `0`이 될 수 있을 때 `{value && <Component />}`를 사용하지 마세요.
이들은 falsy이지만 JSX에서 렌더 가능합니다. React Native는 이를 `<Text>` 컴포넌트 외부의
텍스트로 렌더링하려 해서 프로덕션에서 하드 크래시를 유발합니다.

**잘못된 예시 (count가 0이거나 name이 ""이면 크래시):**

```tsx
function Profile({ name, count }: { name: string; count: number }) {
  return (
    <View>
      {name && <Text>{name}</Text>}
      {count && <Text>{count}개 항목</Text>}
    </View>
  )
}
// name="" 또는 count=0이면 falsy 값을 렌더링 → 크래시
```

**올바른 예시 (null과 함께 삼항 연산자):**

```tsx
function Profile({ name, count }: { name: string; count: number }) {
  return (
    <View>
      {name ? <Text>{name}</Text> : null}
      {count ? <Text>{count}개 항목</Text> : null}
    </View>
  )
}
```

**올바른 예시 (명시적 불리언 강제 변환):**

```tsx
function Profile({ name, count }: { name: string; count: number }) {
  return (
    <View>
      {!!name && <Text>{name}</Text>}
      {!!count && <Text>{count}개 항목</Text>}
    </View>
  )
}
```

**최선 (조기 반환):**

```tsx
function Profile({ name, count }: { name: string; count: number }) {
  if (!name) return null

  return (
    <View>
      <Text>{name}</Text>
      {count > 0 ? <Text>{count}개 항목</Text> : null}
    </View>
  )
}
```

조기 반환이 가장 명확합니다. 인라인 조건문을 사용할 때는 삼항 연산자나 명시적 불리언 확인을 선호하세요.

**린트 규칙:** [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-no-leaked-render.md)의
`react/jsx-no-leaked-render`를 활성화해 자동으로 감지하세요.
