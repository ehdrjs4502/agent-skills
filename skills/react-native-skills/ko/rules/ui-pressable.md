---
title: Touchable 컴포넌트 대신 Pressable 사용
impact: LOW
impactDescription: 현대적인 API, 더 유연함
tags: ui, pressable, touchable, gestures
---

## Touchable 컴포넌트 대신 Pressable 사용

`TouchableOpacity`나 `TouchableHighlight`를 사용하지 마세요.
대신 `react-native` 또는 `react-native-gesture-handler`의 `Pressable`을 사용하세요.

**잘못된 예시 (레거시 Touchable 컴포넌트):**

```tsx
import { TouchableOpacity } from 'react-native'

function MyButton({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Text>눌러보세요</Text>
    </TouchableOpacity>
  )
}
```

**올바른 예시 (Pressable):**

```tsx
import { Pressable } from 'react-native'

function MyButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable onPress={onPress}>
      <Text>눌러보세요</Text>
    </Pressable>
  )
}
```

**올바른 예시 (목록에 gesture handler의 Pressable):**

```tsx
import { Pressable } from 'react-native-gesture-handler'

function ListItem({ onPress }: { onPress: () => void }) {
  return (
    <Pressable onPress={onPress}>
      <Text>아이템</Text>
    </Pressable>
  )
}
```

`react-native-gesture-handler`의 ScrollView와 함께 스크롤 가능한 목록 내에서는
`react-native-gesture-handler`의 Pressable을 사용해 더 나은 제스처 조율을 하세요.

**애니메이션 프레스 상태(scale, opacity 변화):** Pressable의 스타일 콜백 대신
Reanimated shared value와 `GestureDetector`를 사용하세요. `animation-gesture-detector-press` 규칙을 참고하세요.
