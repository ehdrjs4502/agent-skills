---
title: 지연 상태 초기화 사용
impact: MEDIUM
impactDescription: 매 렌더링마다 낭비되는 계산
tags: react, hooks, useState, performance, initialization
---

## 지연 상태 초기화 사용

비용이 큰 초기 값에는 `useState`에 함수를 전달하세요. 함수 형태 없이는 초기화 함수가 값이 한 번만 사용됨에도 불구하고 매 렌더링마다 실행됩니다.

**잘못된 예 (매 렌더링마다 실행):**

```tsx
function FilteredList({ items }: { items: Item[] }) {
  // buildSearchIndex()가 초기화 후에도 매 렌더링마다 실행
  const [searchIndex, setSearchIndex] = useState(buildSearchIndex(items))
  const [query, setQuery] = useState('')
  
  // query 변경 시 buildSearchIndex가 불필요하게 다시 실행
  return <SearchResults index={searchIndex} query={query} />
}

function UserProfile() {
  // JSON.parse가 매 렌더링마다 실행
  const [settings, setSettings] = useState(
    JSON.parse(localStorage.getItem('settings') || '{}')
  )
  
  return <SettingsForm settings={settings} onChange={setSettings} />
}
```

**올바른 예 (한 번만 실행):**

```tsx
function FilteredList({ items }: { items: Item[] }) {
  // buildSearchIndex()가 초기 렌더링에만 실행
  const [searchIndex, setSearchIndex] = useState(() => buildSearchIndex(items))
  const [query, setQuery] = useState('')
  
  return <SearchResults index={searchIndex} query={query} />
}

function UserProfile() {
  // JSON.parse가 초기 렌더링에만 실행
  const [settings, setSettings] = useState(() => {
    const stored = localStorage.getItem('settings')
    return stored ? JSON.parse(stored) : {}
  })
  
  return <SettingsForm settings={settings} onChange={setSettings} />
}
```

localStorage/sessionStorage에서 초기 값 계산, 데이터 구조(인덱스, 맵) 구축, DOM 읽기, 또는 무거운 변환 수행 시 지연 초기화를 사용하세요.

단순 원시형(`useState(0)`), 직접 참조(`useState(props.value)`), 또는 저렴한 리터럴(`useState({})`)의 경우 함수 형태가 불필요합니다.
