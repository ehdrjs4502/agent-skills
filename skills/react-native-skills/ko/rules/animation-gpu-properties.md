---
title: 레이아웃 속성 대신 Transform과 Opacity 애니메이션
impact: HIGH
impactDescription: GPU 가속 애니메이션, 레이아웃 재계산 없음
tags: animation, performance, reanimated, transform, opacity
---

## 레이아웃 속성 대신 Transform과 Opacity 애니메이션

`width`, `height`, `top`, `left`, `margin`, `padding` 애니메이션을 피하세요.
이들은 매 프레임마다 레이아웃 재계산을 트리거합니다.
대신 레이아웃을 트리거하지 않고 GPU에서 실행되는 `transform`(scale, translate)과 `opacity`를 사용하세요.

**잘못된 예시 (height 애니메이션, 매 프레임마다 레이아웃 트리거):**

```tsx
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated'

function CollapsiblePanel({ expanded }: { expanded: boolean }) {
  const animatedStyle = useAnimatedStyle(() => ({
    height: withTiming(expanded ? 200 : 0), // 매 프레임마다 레이아웃 트리거
    overflow: 'hidden',
  }))

  return <Animated.View style={animatedStyle}>{children}</Animated.View>
}
```

**올바른 예시 (scaleY 애니메이션, GPU 가속):**

```tsx
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated'

function CollapsiblePanel({ expanded }: { expanded: boolean }) {
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scaleY: withTiming(expanded ? 1 : 0) },
    ],
    opacity: withTiming(expanded ? 1 : 0),
  }))

  return (
    <Animated.View style={[{ height: 200, transformOrigin: 'top' }, animatedStyle]}>
      {children}
    </Animated.View>
  )
}
```

**올바른 예시 (슬라이드 애니메이션에 translateY):**

```tsx
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated'

function SlideIn({ visible }: { visible: boolean }) {
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: withTiming(visible ? 0 : 100) },
    ],
    opacity: withTiming(visible ? 1 : 0),
  }))

  return <Animated.View style={animatedStyle}>{children}</Animated.View>
}
```

GPU 가속 속성: `transform`(translate, scale, rotate), `opacity`. 그 외는 모두 레이아웃을 트리거합니다.
