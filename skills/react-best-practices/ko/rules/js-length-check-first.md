---
title: 배열 비교 시 길이 먼저 확인
impact: MEDIUM-HIGH
impactDescription: 길이가 다를 때 비용이 큰 작업 방지
tags: javascript, arrays, performance, optimization, comparison
---

## 배열 비교 시 길이 먼저 확인

비용이 큰 작업(정렬, 깊은 동등성, 직렬화)으로 배열을 비교할 때 길이를 먼저 확인하세요. 길이가 다르면 배열이 같을 수 없습니다.

실제 애플리케이션에서 이 최적화는 비교가 핫 패스(이벤트 핸들러, 렌더 루프)에서 실행될 때 특히 유용합니다.

**잘못된 예 (항상 비용이 큰 비교 실행):**

```typescript
function hasChanges(current: string[], original: string[]) {
  // 길이가 달라도 항상 정렬 및 join 실행
  return current.sort().join() !== original.sort().join()
}
```

`current.length`가 5이고 `original.length`가 100이어도 O(n log n)의 정렬이 두 번 실행됩니다.

**올바른 예 (O(1) 길이 확인 먼저):**

```typescript
function hasChanges(current: string[], original: string[]) {
  // 길이가 다르면 조기 반환
  if (current.length !== original.length) {
    return true
  }
  // 길이가 같을 때만 정렬
  const currentSorted = current.toSorted()
  const originalSorted = original.toSorted()
  for (let i = 0; i < currentSorted.length; i++) {
    if (currentSorted[i] !== originalSorted[i]) {
      return true
    }
  }
  return false
}
```

이 새 접근 방식이 더 효율적인 이유:
- 길이가 다를 때 배열 정렬 및 join 오버헤드 방지
- join된 문자열을 위한 메모리 소비 방지 (대용량 배열에서 특히 중요)
- 원본 배열 변경 방지
- 차이가 발견되면 조기 반환
