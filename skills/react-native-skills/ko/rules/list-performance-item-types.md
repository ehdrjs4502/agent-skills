---
title: 이종 목록에 아이템 타입 사용
impact: HIGH
impactDescription: 효율적인 재활용, 레이아웃 스래싱 감소
tags: list, performance, recycling, heterogeneous, LegendList
---

## 이종 목록에 아이템 타입 사용

목록에 다른 레이아웃의 아이템이 있을 때(메시지, 이미지, 헤더 등),
각 아이템에 `type` 필드를 추가하고 목록에 `getItemType`을 제공하세요.
이렇게 하면 아이템이 별도의 재활용 풀에 들어가 메시지 컴포넌트가 이미지 컴포넌트로 재활용되지 않습니다.

**잘못된 예시 (조건문이 있는 단일 컴포넌트):**

```tsx
type Item = { id: string; text?: string; imageUrl?: string; isHeader?: boolean }

function ListItem({ item }: { item: Item }) {
  if (item.isHeader) {
    return <HeaderItem title={item.text} />
  }
  if (item.imageUrl) {
    return <ImageItem url={item.imageUrl} />
  }
  return <MessageItem text={item.text} />
}

function Feed({ items }: { items: Item[] }) {
  return (
    <LegendList
      data={items}
      renderItem={({ item }) => <ListItem item={item} />}
      recycleItems
    />
  )
}
```

**올바른 예시 (별도 컴포넌트를 가진 타입별 아이템):**

```tsx
type HeaderItem = { id: string; type: 'header'; title: string }
type MessageItem = { id: string; type: 'message'; text: string }
type ImageItem = { id: string; type: 'image'; url: string }
type FeedItem = HeaderItem | MessageItem | ImageItem

function Feed({ items }: { items: FeedItem[] }) {
  return (
    <LegendList
      data={items}
      keyExtractor={(item) => item.id}
      getItemType={(item) => item.type}
      renderItem={({ item }) => {
        switch (item.type) {
          case 'header':
            return <SectionHeader title={item.title} />
          case 'message':
            return <MessageRow text={item.text} />
          case 'image':
            return <ImageRow url={item.url} />
        }
      }}
      recycleItems
    />
  )
}
```

**이것이 중요한 이유:**

- **재활용 효율성**: 같은 타입의 아이템이 재활용 풀을 공유
- **레이아웃 스래싱 없음**: 헤더가 이미지 셀로 재활용되지 않음
- **타입 안전성**: TypeScript가 각 분기에서 아이템 타입을 좁힐 수 있음
- **더 나은 크기 추정**: 타입별 정확한 추정을 위해 `itemType`과 함께 `getEstimatedItemSize` 사용

참고: [LegendList getItemType](https://legendapp.com/open-source/list/api/props/#getitemtype-v2)
