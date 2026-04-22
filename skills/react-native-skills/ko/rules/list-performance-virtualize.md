---
title: 모든 목록에 가상화 라이브러리 사용
impact: HIGH
impactDescription: 메모리 감소, 빠른 마운트
tags: lists, performance, virtualization, scrollview
---

## 모든 목록에 가상화 라이브러리 사용

자식을 map한 ScrollView 대신 LegendList나 FlashList 같은 가상화 라이브러리를 사용하세요.
짧은 목록에도 마찬가지입니다. 가상화는 보이는 아이템만 렌더링해 메모리 사용량과 마운트 시간을 줄입니다.
ScrollView는 모든 자식을 미리 렌더링해 빠르게 비용이 커집니다.

**잘못된 예시 (ScrollView가 모든 아이템을 한 번에 렌더):**

```tsx
function Feed({ items }: { items: Item[] }) {
  return (
    <ScrollView>
      {items.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </ScrollView>
  )
}
// 50개 아이템 = 보이는 것이 10개뿐이어도 50개 컴포넌트 마운트
```

**올바른 예시 (가상화로 보이는 아이템만 렌더):**

```tsx
import { LegendList } from '@legendapp/list'

function Feed({ items }: { items: Item[] }) {
  return (
    <LegendList
      data={items}
      renderItem={({ item }) => <ItemCard item={item} />}
      keyExtractor={(item) => item.id}
      estimatedItemSize={80}
    />
  )
}
// 동시에 ~10-15개의 보이는 아이템만 마운트
```

**대안 (FlashList):**

```tsx
import { FlashList } from '@shopify/flash-list'

function Feed({ items }: { items: Item[] }) {
  return (
    <FlashList
      data={items}
      renderItem={({ item }) => <ItemCard item={item} />}
      keyExtractor={(item) => item.id}
    />
  )
}
```

스크롤 가능한 콘텐츠가 있는 모든 화면에 적용됩니다. 프로필, 설정, 피드, 검색 결과 등.
기본적으로 가상화를 사용하세요.
