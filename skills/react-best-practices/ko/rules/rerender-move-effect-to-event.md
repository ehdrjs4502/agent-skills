---
title: 인터랙션 로직을 이벤트 핸들러에 배치
impact: MEDIUM
impactDescription: effect 재실행 및 중복 사이드 이펙트 방지
tags: rerender, useEffect, events, side-effects, dependencies
---

## 인터랙션 로직을 이벤트 핸들러에 배치

사이드 이펙트가 특정 사용자 동작(제출, 클릭, 드래그)에 의해 트리거되는 경우 해당 이벤트 핸들러에서 실행하세요. 동작을 상태 + effect로 모델링하지 마세요; 이는 관련 없는 변경 시 effect가 재실행되고 동작이 중복될 수 있습니다.

**잘못된 예 (이벤트를 상태 + effect로 모델링):**

```tsx
function Form() {
  const [submitted, setSubmitted] = useState(false)
  const theme = useContext(ThemeContext)

  useEffect(() => {
    if (submitted) {
      post('/api/register')
      showToast('등록됨', theme)
    }
  }, [submitted, theme])

  return <button onClick={() => setSubmitted(true)}>제출</button>
}
```

**올바른 예 (핸들러에서 처리):**

```tsx
function Form() {
  const theme = useContext(ThemeContext)

  function handleSubmit() {
    post('/api/register')
    showToast('등록됨', theme)
  }

  return <button onClick={handleSubmit}>제출</button>
}
```

참고: [이 코드를 이벤트 핸들러로 이동해야 하나요?](https://react.dev/learn/removing-effect-dependencies#should-this-code-move-to-an-event-handler)
