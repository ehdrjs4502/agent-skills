---
title: 상태는 진실의 원천을 나타내야 함
impact: HIGH
impactDescription: 더 깔끔한 로직, 쉬운 디버깅, 단일 진실의 원천
tags: state, derived-state, reanimated, hooks
---

## 상태는 진실의 원천을 나타내야 함

React `useState`와 Reanimated shared value 모두 실제 상태를 나타내야 합니다
(예: `pressed`, `progress`, `isOpen`). 도출된 시각적 값(예: `scale`, `opacity`, `translateY`)을
저장하면 안 됩니다. 시각적 값은 계산이나 보간으로 상태에서 도출하세요.

**잘못된 예시 (시각적 출력값 저장):**

```tsx
const scale = useSharedValue(1)

const tap = Gesture.Tap()
  .onBegin(() => {
    scale.set(withTiming(0.95))
  })
  .onFinalize(() => {
    scale.set(withTiming(1))
  })

const animatedStyle = useAnimatedStyle(() => ({
  transform: [{ scale: scale.get() }],
}))
```

**올바른 예시 (상태 저장, 시각적 값 도출):**

```tsx
const pressed = useSharedValue(0) // 0 = 미프레스, 1 = 프레스

const tap = Gesture.Tap()
  .onBegin(() => {
    pressed.set(withTiming(1))
  })
  .onFinalize(() => {
    pressed.set(withTiming(0))
  })

const animatedStyle = useAnimatedStyle(() => ({
  transform: [{ scale: interpolate(pressed.get(), [0, 1], [1, 0.95]) }],
}))
```

**이것이 중요한 이유:**

1. **단일 진실의 원천** — 상태(`pressed`)는 무슨 일이 일어나는지 설명; 시각적 값은 도출됨
2. **확장 용이성** — 같은 상태에서 더 많은 보간으로 opacity, 회전 등 다른 효과 추가 가능
3. **디버깅** — `pressed = 1` 검사가 `scale = 0.95`보다 명확함
4. **재사용 가능한 로직** — 같은 `pressed` 값으로 여러 시각적 속성 구동 가능

**React 상태에도 동일한 원칙:**

```tsx
// 잘못됨: 도출된 값 저장
const [isExpanded, setIsExpanded] = useState(false)
const [height, setHeight] = useState(0)

useEffect(() => {
  setHeight(isExpanded ? 200 : 0)
}, [isExpanded])

// 올바름: 상태에서 도출
const [isExpanded, setIsExpanded] = useState(false)
const height = isExpanded ? 200 : 0
```

상태는 최소한의 진실입니다. 그 외 모든 것은 도출됩니다.
