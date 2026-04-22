---
title: 애니메이션 프레스 상태에 GestureDetector 사용
impact: MEDIUM
impactDescription: UI 스레드 애니메이션, 더 부드러운 프레스 피드백
tags: animation, gestures, press, reanimated
---

## 애니메이션 프레스 상태에 GestureDetector 사용

애니메이션 프레스 상태(프레스 시 scale, opacity 변화)에는 Pressable의
`onPressIn`/`onPressOut` 대신 `GestureDetector`와 `Gesture.Tap()` 및 shared value를 사용하세요.
제스처 콜백은 worklet으로 UI 스레드에서 실행되어 프레스 애니메이션에 JS 스레드 왕복이 없습니다.

**잘못된 예시 (JS 스레드 콜백을 가진 Pressable):**

```tsx
import { Pressable } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated'

function AnimatedButton({ onPress }: { onPress: () => void }) {
  const scale = useSharedValue(1)

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => (scale.value = withTiming(0.95))}
      onPressOut={() => (scale.value = withTiming(1))}
    >
      <Animated.View style={animatedStyle}>
        <Text>눌러보세요</Text>
      </Animated.View>
    </Pressable>
  )
}
```

**올바른 예시 (UI 스레드 worklet을 가진 GestureDetector):**

```tsx
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  runOnJS,
} from 'react-native-reanimated'

function AnimatedButton({ onPress }: { onPress: () => void }) {
  // 프레스 상태 저장 (0 = 미프레스, 1 = 프레스)
  const pressed = useSharedValue(0)

  const tap = Gesture.Tap()
    .onBegin(() => {
      pressed.set(withTiming(1))
    })
    .onFinalize(() => {
      pressed.set(withTiming(0))
    })
    .onEnd(() => {
      runOnJS(onPress)()
    })

  // 상태에서 시각적 값 도출
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: interpolate(withTiming(pressed.get()), [0, 1], [1, 0.95]) },
    ],
  }))

  return (
    <GestureDetector gesture={tap}>
      <Animated.View style={animatedStyle}>
        <Text>눌러보세요</Text>
      </Animated.View>
    </GestureDetector>
  )
}
```

프레스 **상태**(0 또는 1)를 저장하고, `interpolate`로 scale을 도출하세요.
shared value를 진실의 원천으로 유지합니다. worklet에서 JS 함수를 호출하려면 `runOnJS`를 사용하세요.
React Compiler 호환성을 위해 `.set()`과 `.get()`을 사용하세요.

참고: [Gesture Handler Tap Gesture](https://docs.swmansion.com/react-native-gesture-handler/docs/gestures/tap-gesture)
