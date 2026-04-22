---
title: Effect Event를 의존성 배열에 넣지 않기
impact: LOW
impactDescription: 불필요한 effect 재실행 및 린트 오류 방지
tags: advanced, hooks, useEffectEvent, dependencies, effects
---

## Effect Event를 의존성 배열에 넣지 않기

Effect Event 함수는 안정적인 식별성을 가지지 않습니다. 그 식별성은 의도적으로 매 렌더링마다 변경됩니다. `useEffectEvent`가 반환한 함수를 `useEffect` 의존성 배열에 포함하지 마세요. 실제 반응 값을 의존성으로 유지하고 Effect Event를 effect 본문이나 해당 effect로 만든 구독에서 호출하세요.

**잘못된 예 (Effect Event가 의존성으로 추가됨):**

```tsx
import { useEffect, useEffectEvent } from 'react'

function ChatRoom({ roomId, onConnected }: {
  roomId: string
  onConnected: () => void
}) {
  const handleConnected = useEffectEvent(onConnected)

  useEffect(() => {
    const connection = createConnection(roomId)
    connection.on('connected', handleConnected)
    connection.connect()

    return () => connection.disconnect()
  }, [roomId, handleConnected])
}
```

Effect Event를 의존성에 포함하면 effect가 매 렌더링마다 재실행되고 React Hooks 린트 규칙을 트리거합니다.

**올바른 예 (Effect Event가 아닌 반응 값에 의존):**

```tsx
import { useEffect, useEffectEvent } from 'react'

function ChatRoom({ roomId, onConnected }: {
  roomId: string
  onConnected: () => void
}) {
  const handleConnected = useEffectEvent(onConnected)

  useEffect(() => {
    const connection = createConnection(roomId)
    connection.on('connected', handleConnected)
    connection.connect()

    return () => connection.disconnect()
  }, [roomId])
}
```

참고: [React useEffectEvent: 의존성의 Effect Event](https://react.dev/reference/react/useEffectEvent#effect-event-in-deps)
