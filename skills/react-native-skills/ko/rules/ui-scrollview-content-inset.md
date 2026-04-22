---
title: 동적 ScrollView 간격에 contentInset 사용
impact: LOW
impactDescription: 더 부드러운 업데이트, 레이아웃 재계산 없음
tags: scrollview, layout, contentInset, performance
---

## 동적 ScrollView 간격에 contentInset 사용

변경될 수 있는 ScrollView의 상단이나 하단에 공간을 추가할 때(키보드, 툴바, 동적 콘텐츠),
패딩 대신 `contentInset`을 사용하세요.
`contentInset`을 변경하면 레이아웃 재계산이 트리거되지 않습니다.
콘텐츠를 리렌더하지 않고 스크롤 영역만 조정합니다.

**잘못된 예시 (패딩이 레이아웃 재계산 유발):**

```tsx
function Feed({ bottomOffset }: { bottomOffset: number }) {
  return (
    <ScrollView contentContainerStyle={{ paddingBottom: bottomOffset }}>
      {children}
    </ScrollView>
  )
}
// bottomOffset 변경 시 전체 레이아웃 재계산 트리거
```

**올바른 예시 (동적 간격에 contentInset):**

```tsx
function Feed({ bottomOffset }: { bottomOffset: number }) {
  return (
    <ScrollView
      contentInset={{ bottom: bottomOffset }}
      scrollIndicatorInsets={{ bottom: bottomOffset }}
    >
      {children}
    </ScrollView>
  )
}
// bottomOffset 변경 시 스크롤 경계만 조정
```

스크롤 인디케이터를 정렬하려면 `contentInset`과 함께 `scrollIndicatorInsets`를 사용하세요.
절대 변경되지 않는 정적 간격에는 패딩이 괜찮습니다.
