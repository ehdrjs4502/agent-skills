---
title: 렌더 초기에 함수 구조 분해 (React Compiler)
impact: HIGH
impactDescription: 안정적인 참조, 적은 리렌더
tags: rerender, hooks, performance, react-compiler
---

## 렌더 초기에 함수 구조 분해

이 규칙은 React Compiler를 사용하는 경우에만 적용됩니다.

렌더 스코프의 최상단에서 훅으로부터 함수를 구조 분해하세요.
객체에 점 접근으로 함수를 호출하지 마세요. 구조 분해된 함수는 안정적인 참조입니다.
점 접근은 새 참조를 만들어 메모이제이션을 깨뜨립니다.

**잘못된 예시 (객체에 점 접근):**

```tsx
import { useRouter } from 'expo-router'

function SaveButton(props) {
  const router = useRouter()

  // 잘못됨: react-compiler는 매 렌더마다 변경되는 객체인 "props"와 "router"를 캐시 키로 사용
  const handlePress = () => {
    props.onSave()
    router.push('/success') // 불안정한 참조
  }

  return <Button onPress={handlePress}>저장</Button>
}
```

**올바른 예시 (초기에 구조 분해):**

```tsx
import { useRouter } from 'expo-router'

function SaveButton({ onSave }) {
  const { push } = useRouter()

  // 좋음: react-compiler는 push와 onSave를 키로 사용
  const handlePress = () => {
    onSave()
    push('/success') // 안정적인 참조
  }

  return <Button onPress={handlePress}>저장</Button>
}
```
