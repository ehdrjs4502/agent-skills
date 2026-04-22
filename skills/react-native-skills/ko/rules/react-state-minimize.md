---
title: 상태 변수 최소화 및 값 도출
impact: MEDIUM
impactDescription: 적은 리렌더, 상태 불일치 감소
tags: state, derived-state, hooks, optimization
---

## 상태 변수 최소화 및 값 도출

상태 변수를 최대한 적게 사용하세요. 기존 상태나 props에서 계산할 수 있는 값은
상태로 저장하지 말고 렌더 중에 도출하세요.
중복 상태는 불필요한 리렌더를 유발하고 동기화가 어긋날 수 있습니다.

**잘못된 예시 (중복 상태):**

```tsx
function Cart({ items }: { items: Item[] }) {
  const [total, setTotal] = useState(0)
  const [itemCount, setItemCount] = useState(0)

  useEffect(() => {
    setTotal(items.reduce((sum, item) => sum + item.price, 0))
    setItemCount(items.length)
  }, [items])

  return (
    <View>
      <Text>{itemCount}개 상품</Text>
      <Text>합계: ₩{total}</Text>
    </View>
  )
}
```

**올바른 예시 (도출된 값):**

```tsx
function Cart({ items }: { items: Item[] }) {
  const total = items.reduce((sum, item) => sum + item.price, 0)
  const itemCount = items.length

  return (
    <View>
      <Text>{itemCount}개 상품</Text>
      <Text>합계: ₩{total}</Text>
    </View>
  )
}
```

**다른 예시:**

```tsx
// 잘못됨: firstName, lastName, fullName을 모두 저장
const [firstName, setFirstName] = useState('')
const [lastName, setLastName] = useState('')
const [fullName, setFullName] = useState('')

// 올바름: fullName 도출
const [firstName, setFirstName] = useState('')
const [lastName, setLastName] = useState('')
const fullName = `${firstName} ${lastName}`
```

상태는 최소한의 진실의 원천이어야 합니다. 그 외 모든 것은 도출됩니다.

참고: [상태 구조 선택](https://react.dev/learn/choosing-the-state-structure)
