---
title: 비용이 큰 파생 렌더에 useDeferredValue 사용
impact: MEDIUM
impactDescription: 무거운 계산 중 입력 반응성 유지
tags: rerender, useDeferredValue, optimization, concurrent
---

## 비용이 큰 파생 렌더에 useDeferredValue 사용

사용자 입력이 비용이 큰 계산이나 렌더를 트리거할 때 `useDeferredValue`를 사용하여 입력 반응성을 유지하세요. 지연된 값은 뒤처지며, React가 입력 업데이트를 우선시하고 유휴 시간에 비용이 큰 결과를 렌더링할 수 있게 합니다.

**잘못된 예 (필터링 중 입력이 느리게 느껴짐):**

```tsx
function Search({ items }: { items: Item[] }) {
  const [query, setQuery] = useState('')
  const filtered = items.filter(item => fuzzyMatch(item, query))

  return (
    <>
      <input value={query} onChange={e => setQuery(e.target.value)} />
      <ResultsList results={filtered} />
    </>
  )
}
```

**올바른 예 (입력이 빠르게 반응하고, 결과는 준비되면 렌더링):**

```tsx
function Search({ items }: { items: Item[] }) {
  const [query, setQuery] = useState('')
  const deferredQuery = useDeferredValue(query)
  const filtered = useMemo(
    () => items.filter(item => fuzzyMatch(item, deferredQuery)),
    [items, deferredQuery]
  )
  const isStale = query !== deferredQuery

  return (
    <>
      <input value={query} onChange={e => setQuery(e.target.value)} />
      <div style={{ opacity: isStale ? 0.7 : 1 }}>
        <ResultsList results={filtered} />
      </div>
    </>
  )
}
```

**사용 시점:**

- 대용량 목록 필터링/검색
- 입력에 반응하는 비용이 큰 시각화 (차트, 그래프)
- 눈에 띄는 렌더 지연을 야기하는 파생 상태

**참고:** 비용이 큰 계산을 지연된 값을 의존성으로 사용하는 `useMemo`로 감싸세요. 그렇지 않으면 매 렌더링마다 여전히 실행됩니다.

참고: [React useDeferredValue](https://react.dev/reference/react/useDeferredValue)
