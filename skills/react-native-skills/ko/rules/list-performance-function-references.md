---
title: 안정적인 객체 참조로 목록 성능 최적화
impact: CRITICAL
impactDescription: 가상화는 참조 안정성에 의존
tags: lists, performance, flatlist, virtualization
---

## 안정적인 객체 참조로 목록 성능 최적화

가상화 목록에 전달하기 전에 데이터를 map하거나 filter하지 마세요.
가상화는 객체 참조 안정성으로 변경 사항을 파악합니다. 새 참조는 모든 보이는 아이템의 전체 리렌더를 유발합니다.
목록 부모 레벨에서 잦은 렌더를 방지하세요.

필요한 경우, 목록 아이템 내에서 컨텍스트 셀렉터를 사용하세요.

**잘못된 예시 (매 키 입력마다 새 객체 참조 생성):**

```tsx
function DomainSearch() {
  const { keyword, setKeyword } = useKeywordZustandState()
  const { data: tlds } = useTlds()

  // 잘못됨: 매 렌더마다 새 객체 생성, 매 키 입력마다 전체 목록 재생성
  const domains = tlds.map((tld) => ({
    domain: `${keyword}.${tld.name}`,
    tld: tld.name,
    price: tld.price,
  }))

  return (
    <>
      <TextInput value={keyword} onChangeText={setKeyword} />
      <LegendList
        data={domains}
        renderItem={({ item }) => <DomainItem item={item} keyword={keyword} />}
      />
    </>
  )
}
```

**올바른 예시 (안정적인 참조, 아이템 내부에서 변환):**

```tsx
const renderItem = ({ item }) => <DomainItem tld={item} />

function DomainSearch() {
  const { data: tlds } = useTlds()

  return (
    <LegendList
      // 좋음: 데이터가 안정적이면 LegendList가 전체 목록을 리렌더하지 않음
      data={tlds}
      renderItem={renderItem}
    />
  )
}

function DomainItem({ tld }: { tld: Tld }) {
  // 좋음: 아이템 내부에서 변환, 동적 데이터를 prop으로 전달하지 않음
  // 좋음: zustand에서 셀렉터 함수를 사용해 안정적인 문자열 반환
  const domain = useKeywordZustandState((s) => s.keyword + '.' + tld.name)
  return <Text>{domain}</Text>
}
```

**부모 배열 참조 업데이트:**

새 배열 인스턴스 생성은 내부 객체 참조가 안정적인 한 괜찮습니다.
예를 들어 객체 목록을 정렬하는 경우:

```tsx
// 좋음: 내부 객체를 변경하지 않고 새 배열 인스턴스 생성
// 좋음: 부모 배열 참조는 keyword 타이핑/업데이트에 영향받지 않음
const sortedTlds = tlds.toSorted((a, b) => a.name.localeCompare(b.name))

return <LegendList data={sortedTlds} renderItem={renderItem} />
```

새 배열 인스턴스 `sortedTlds`가 생성되더라도 내부 객체 참조는 안정적입니다.

**동적 데이터에 zustand 사용 (부모 리렌더 방지):**

```tsx
const useSearchStore = create<{ keyword: string }>(() => ({ keyword: '' }))

function DomainSearch() {
  const { data: tlds } = useTlds()

  return (
    <>
      <SearchInput />
      <LegendList
        data={tlds}
        renderItem={({ item }) => <DomainItem tld={item} />}
      />
    </>
  )
}

function DomainItem({ tld }: { tld: Tld }) {
  // 필요한 것만 선택 — keyword가 변경될 때만 리렌더
  const keyword = useSearchStore((s) => s.keyword)
  const domain = `${keyword}.${tld.name}`
  return <Text>{domain}</Text>
}
```

가상화는 타이핑 시 변경되지 않은 아이템을 건너뛸 수 있습니다.
부모 리렌더 대신 보이는 아이템(~20개)만 키 입력 시 리렌더됩니다.
