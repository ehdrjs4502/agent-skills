---
title: requestIdleCallback으로 비중요 작업 지연
impact: MEDIUM
impactDescription: 백그라운드 작업 중 UI 반응성 유지
tags: javascript, performance, idle, scheduling, analytics
---

## requestIdleCallback으로 비중요 작업 지연

**영향도: MEDIUM (백그라운드 작업 중 UI 반응성 유지)**

브라우저 유휴 시간에 비중요 작업을 예약하려면 `requestIdleCallback()`을 사용하세요. 이를 통해 메인 스레드가 사용자 인터랙션과 애니메이션을 위해 자유롭게 유지되어 버벅거림이 줄고 인지된 성능이 향상됩니다.

**잘못된 예 (사용자 인터랙션 중 메인 스레드 차단):**

```typescript
function handleSearch(query: string) {
  const results = searchItems(query)
  setResults(results)

  // 이것들이 즉시 메인 스레드를 차단
  analytics.track('search', { query })
  saveToRecentSearches(query)
  prefetchTopResults(results.slice(0, 3))
}
```

**올바른 예 (비중요 작업을 유휴 시간으로 지연):**

```typescript
function handleSearch(query: string) {
  const results = searchItems(query)
  setResults(results)

  // 비중요 작업을 유휴 시간으로 지연
  requestIdleCallback(() => {
    analytics.track('search', { query })
  })

  requestIdleCallback(() => {
    saveToRecentSearches(query)
  })

  requestIdleCallback(() => {
    prefetchTopResults(results.slice(0, 3))
  })
}
```

**필수 작업에 타임아웃 지정:**

```typescript
// 브라우저가 바빠도 2초 내에 분석 발생 보장
requestIdleCallback(
  () => analytics.track('page_view', { path: location.pathname }),
  { timeout: 2000 }
)
```

**대용량 데이터셋 청킹:**

```typescript
function processLargeDataset(items: Item[]) {
  let index = 0

  function processChunk(deadline: IdleDeadline) {
    // 유휴 시간이 있는 동안 항목 처리 (목표: <50ms 청크)
    while (index < items.length && deadline.timeRemaining() > 0) {
      processItem(items[index])
      index++
    }

    // 더 많은 항목이 있으면 다음 청크 예약
    if (index < items.length) {
      requestIdleCallback(processChunk)
    }
  }

  requestIdleCallback(processChunk)
}
```

**지원하지 않는 브라우저를 위한 폴백:**

```typescript
const scheduleIdleWork = window.requestIdleCallback ?? ((cb: () => void) => setTimeout(cb, 1))

scheduleIdleWork(() => {
  // 비중요 작업
})
```

**사용 시점:**
- 분석 및 원격 측정
- localStorage/IndexedDB에 상태 저장
- 다음 가능한 액션을 위한 리소스 프리패칭
- 긴급하지 않은 데이터 변환 처리
- 비중요 기능의 지연 초기화

**사용하지 말아야 할 때:**
- 즉각적인 피드백이 필요한 사용자 시작 액션
- 사용자가 기다리는 렌더링 업데이트
- 시간에 민감한 작업
