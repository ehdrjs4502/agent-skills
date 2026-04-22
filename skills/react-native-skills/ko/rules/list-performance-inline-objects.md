---
title: renderItem에서 인라인 객체 금지
impact: HIGH
impactDescription: 메모이즈된 목록 아이템의 불필요한 리렌더 방지
tags: lists, performance, flatlist, virtualization, memo
---

## renderItem에서 인라인 객체 금지

`renderItem` 내부에서 prop으로 전달할 새 객체를 만들지 마세요.
인라인 객체는 매 렌더마다 새 참조를 만들어 메모이제이션을 깨뜨립니다.
대신 `item`에서 직접 기본형 값을 전달하세요.

**잘못된 예시 (인라인 객체가 메모이제이션을 깨뜨림):**

```tsx
function UserList({ users }: { users: User[] }) {
  return (
    <LegendList
      data={users}
      renderItem={({ item }) => (
        <UserRow
          // 잘못됨: 매 렌더마다 새 객체
          user={{ id: item.id, name: item.name, avatar: item.avatar }}
        />
      )}
    />
  )
}
```

**잘못된 예시 (인라인 스타일 객체):**

```tsx
renderItem={({ item }) => (
  <UserRow
    name={item.name}
    // 잘못됨: 매 렌더마다 새 스타일 객체
    style={{ backgroundColor: item.isActive ? 'green' : 'gray' }}
  />
)}
```

**올바른 예시 (item 직접 전달 또는 기본형):**

```tsx
function UserList({ users }: { users: User[] }) {
  return (
    <LegendList
      data={users}
      renderItem={({ item }) => (
        // 좋음: item을 직접 전달
        <UserRow user={item} />
      )}
    />
  )
}
```

**올바른 예시 (기본형 전달, 자식에서 도출):**

```tsx
renderItem={({ item }) => (
  <UserRow
    id={item.id}
    name={item.name}
    isActive={item.isActive}
  />
)}

const UserRow = memo(function UserRow({ id, name, isActive }: Props) {
  // 좋음: 메모이즈된 컴포넌트 내부에서 스타일 도출
  const backgroundColor = isActive ? 'green' : 'gray'
  return <View style={[styles.row, { backgroundColor }]}>{/* ... */}</View>
})
```

**올바른 예시 (모듈 스코프에 정적 스타일 호이스팅):**

```tsx
const activeStyle = { backgroundColor: 'green' }
const inactiveStyle = { backgroundColor: 'gray' }

renderItem={({ item }) => (
  <UserRow
    name={item.name}
    // 좋음: 안정적인 참조
    style={item.isActive ? activeStyle : inactiveStyle}
  />
)}
```

기본형이나 안정적인 참조를 전달하면 실제 값이 변경되지 않았을 때 `memo()`가 리렌더를 건너뛸 수 있습니다.

**참고:** React Compiler가 활성화된 경우 메모이제이션을 자동으로 처리하므로 수동 최적화의 중요성이 줄어듭니다.
