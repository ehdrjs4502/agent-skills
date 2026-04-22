---
title: 임시 값에 useRef 사용
impact: MEDIUM
impactDescription: 자주 업데이트 시 불필요한 리렌더링 방지
tags: rerender, useref, state, performance
---

## 임시 값에 useRef 사용

값이 자주 변경되고 매 업데이트마다 리렌더링을 원하지 않을 때 (예: 마우스 트래커, 인터벌, 임시 플래그), `useState` 대신 `useRef`에 저장하세요. UI를 위한 컴포넌트 상태와 임시 DOM 관련 값을 위한 ref를 구분하세요. ref를 업데이트해도 리렌더링이 트리거되지 않습니다.

**잘못된 예 (매 업데이트마다 렌더링):**

```tsx
function Tracker() {
  const [lastX, setLastX] = useState(0)

  useEffect(() => {
    const onMove = (e: MouseEvent) => setLastX(e.clientX)
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: lastX,
        width: 8,
        height: 8,
        background: 'black',
      }}
    />
  )
}
```

**올바른 예 (추적을 위한 리렌더링 없음):**

```tsx
function Tracker() {
  const lastXRef = useRef(0)
  const dotRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      lastXRef.current = e.clientX
      const node = dotRef.current
      if (node) {
        node.style.transform = `translateX(${e.clientX}px)`
      }
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <div
      ref={dotRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: 8,
        height: 8,
        background: 'black',
        transform: 'translateX(0px)',
      }}
    />
  )
}
```
