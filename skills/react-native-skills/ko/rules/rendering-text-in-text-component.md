---
title: 문자열을 Text 컴포넌트로 감싸기
impact: CRITICAL
impactDescription: 런타임 크래시 방지
tags: rendering, text, core
---

## 문자열을 Text 컴포넌트로 감싸기

문자열은 반드시 `<Text>` 내부에서 렌더링해야 합니다.
문자열이 `<View>`의 직접 자식이면 React Native가 크래시합니다.

**잘못된 예시 (크래시):**

```tsx
import { View } from 'react-native'

function Greeting({ name }: { name: string }) {
  return <View>안녕하세요, {name}!</View>
}
// 오류: 텍스트 문자열은 <Text> 컴포넌트 내에서 렌더링해야 합니다.
```

**올바른 예시:**

```tsx
import { View, Text } from 'react-native'

function Greeting({ name }: { name: string }) {
  return (
    <View>
      <Text>안녕하세요, {name}!</Text>
    </View>
  )
}
```
