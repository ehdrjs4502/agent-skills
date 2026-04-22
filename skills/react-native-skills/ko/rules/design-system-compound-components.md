---
title: 다형성 Children 대신 컴파운드 컴포넌트 사용
impact: MEDIUM
impactDescription: 유연한 컴포지션, 더 명확한 API
tags: design-system, components, composition
---

## 다형성 Children 대신 컴파운드 컴포넌트 사용

텍스트 노드가 아닌 컴포넌트는 문자열을 받을 수 없게 하세요.
문자열 자식을 받을 수 있는 컴포넌트는 전용 `*Text` 컴포넌트여야 합니다.
버튼처럼 View(또는 Pressable)와 텍스트를 함께 가질 수 있는 컴포넌트에는
`Button`, `ButtonText`, `ButtonIcon` 같은 컴파운드 컴포넌트를 사용하세요.

**잘못된 예시 (다형성 children):**

```tsx
import { Pressable, Text } from 'react-native'

type ButtonProps = {
  children: string | React.ReactNode
  icon?: React.ReactNode
}

function Button({ children, icon }: ButtonProps) {
  return (
    <Pressable>
      {icon}
      {typeof children === 'string' ? <Text>{children}</Text> : children}
    </Pressable>
  )
}

// 사용이 모호함
<Button icon={<Icon />}>저장</Button>
<Button><CustomText>저장</CustomText></Button>
```

**올바른 예시 (컴파운드 컴포넌트):**

```tsx
import { Pressable, Text } from 'react-native'

function Button({ children }: { children: React.ReactNode }) {
  return <Pressable>{children}</Pressable>
}

function ButtonText({ children }: { children: React.ReactNode }) {
  return <Text>{children}</Text>
}

function ButtonIcon({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

// 사용이 명시적이고 조합 가능함
<Button>
  <ButtonIcon><SaveIcon /></ButtonIcon>
  <ButtonText>저장</ButtonText>
</Button>

<Button>
  <ButtonText>취소</ButtonText>
</Button>
```
