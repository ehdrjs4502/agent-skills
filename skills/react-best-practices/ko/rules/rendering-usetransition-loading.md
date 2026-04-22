---
title: 수동 로딩 상태 대신 useTransition 사용
impact: LOW
impactDescription: 리렌더링 감소 및 코드 명확성 개선
tags: rendering, transitions, useTransition, loading, state
---

## 수동 로딩 상태 대신 useTransition 사용

로딩 상태에 수동 `useState` 대신 `useTransition`을 사용하세요. 내장 `isPending` 상태를 제공하고 트랜지션을 자동으로 관리합니다.

**잘못된 예 (수동 로딩 상태):**

```tsx
function SearchResults() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = async (value: string) => {
    setIsLoading(true)
    setQuery(value)
    const data = await fetchResults(value)
    setResults(data)
    setIsLoading(false)
  }

  return (
    <>
      <input onChange={(e) => handleSearch(e.target.value)} />
      {isLoading && <Spinner />}
      <ResultsList results={results} />
    </>
  )
}
```

**올바른 예 (내장 pending 상태를 가진 useTransition):**

```tsx
import { useTransition, useState } from 'react'

function SearchResults() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [isPending, startTransition] = useTransition()

  const handleSearch = (value: string) => {
    setQuery(value) // 입력 즉시 업데이트
    
    startTransition(async () => {
      // 결과 패치 및 업데이트
      const data = await fetchResults(value)
      setResults(data)
    })
  }

  return (
    <>
      <input onChange={(e) => handleSearch(e.target.value)} />
      {isPending && <Spinner />}
      <ResultsList results={results} />
    </>
  )
}
```

**장점:**

- **자동 pending 상태**: `setIsLoading(true/false)` 수동 관리 불필요
- **오류 복원성**: 트랜지션이 예외를 발생시켜도 pending 상태가 올바르게 리셋됨
- **더 나은 반응성**: 업데이트 중 UI 반응성 유지
- **인터럽트 처리**: 새 트랜지션이 자동으로 보류 중인 것을 취소

참고: [useTransition](https://react.dev/reference/react/useTransition)
