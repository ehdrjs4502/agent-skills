---
title: 렌더링 중 파생 상태 계산
impact: MEDIUM
impactDescription: 불필요한 렌더링 및 상태 불일치 방지
tags: rerender, derived-state, useEffect, state
---

## 렌더링 중 파생 상태 계산

현재 props/state에서 값을 계산할 수 있는 경우 상태에 저장하거나 effect에서 업데이트하지 마세요. 렌더링 중에 파생하여 추가 렌더링과 상태 불일치를 방지하세요. props 변경에만 응답하여 effect에서 상태를 설정하지 마세요; 파생 값이나 키 기반 재설정을 선호하세요.

**잘못된 예 (불필요한 상태와 effect):**

```tsx
function Form() {
  const [firstName, setFirstName] = useState('First')
  const [lastName, setLastName] = useState('Last')
  const [fullName, setFullName] = useState('')

  useEffect(() => {
    setFullName(firstName + ' ' + lastName)
  }, [firstName, lastName])

  return <p>{fullName}</p>
}
```

**올바른 예 (렌더링 중 파생):**

```tsx
function Form() {
  const [firstName, setFirstName] = useState('First')
  const [lastName, setLastName] = useState('Last')
  const fullName = firstName + ' ' + lastName

  return <p>{fullName}</p>
}
```

참고: [Effect가 필요하지 않을 수 있습니다](https://react.dev/learn/you-might-not-need-an-effect)
