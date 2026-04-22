---
title: Reanimated Shared Values에 .value 대신 .get()/.set() 사용 (React Compiler)
impact: LOW
impactDescription: React Compiler 호환성에 필요
tags: reanimated, react-compiler, shared-values
---

## React Compiler와 Shared Values에 .get()/.set() 사용

React Compiler가 활성화된 경우, Reanimated shared value에서 `.value`를 직접 읽거나 쓰는 대신
`.get()`과 `.set()`을 사용하세요. 컴파일러는 속성 접근을 추적할 수 없어 명시적 메서드가 올바른 동작을 보장합니다.

**잘못된 예시 (React Compiler에서 작동 안 함):**

```tsx
import { useSharedValue } from 'react-native-reanimated'

function Counter() {
  const count = useSharedValue(0)

  const increment = () => {
    count.value = count.value + 1 // react compiler 비활성화
  }

  return <Button onPress={increment} title={`Count: ${count.value}`} />
}
```

**올바른 예시 (React Compiler 호환):**

```tsx
import { useSharedValue } from 'react-native-reanimated'

function Counter() {
  const count = useSharedValue(0)

  const increment = () => {
    count.set(count.get() + 1)
  }

  return <Button onPress={increment} title={`Count: ${count.get()}`} />
}
```

참고: [Reanimated 문서](https://docs.swmansion.com/react-native-reanimated/docs/core/useSharedValue/#react-compiler-support)
