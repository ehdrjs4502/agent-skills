---
title: 메모이제이션을 위해 목록 아이템에 기본형 전달
impact: HIGH
impactDescription: 효과적인 memo() 비교 가능
tags: lists, performance, memo, primitives
---

## 메모이제이션을 위해 목록 아이템에 기본형 전달

가능하면 목록 아이템 컴포넌트에 기본형 값(문자열, 숫자, 불리언)만 전달하세요.
기본형은 `memo()`의 얕은 비교가 올바르게 작동하게 해서, 값이 변경되지 않았을 때 리렌더를 건너뜁니다.

**잘못된 예시 (객체 prop은 깊은 비교 필요):**

```tsx
type User = { id: string; name: string; email: string; avatar: string }

const UserRow = memo(function UserRow({ user }: { user: User }) {
  // memo()는 user를 값이 아닌 참조로 비교
  // 부모가 새 user 객체를 생성하면 데이터가 같아도 리렌더됨
  return <Text>{user.name}</Text>
})

renderItem={({ item }) => <UserRow user={item} />}
```

**올바른 예시 (기본형 prop으로 얕은 비교 가능):**

```tsx
const UserRow = memo(function UserRow({
  id,
  name,
  email,
}: {
  id: string
  name: string
  email: string
}) {
  // memo()가 각 기본형을 직접 비교
  // id, name, email이 실제로 변경됐을 때만 리렌더
  return <Text>{name}</Text>
})

renderItem={({ item }) => (
  <UserRow id={item.id} name={item.name} email={item.email} />
)}
```

**필요한 것만 전달:**

```tsx
// 잘못됨: name만 필요한데 전체 item 전달
<UserRow user={item} />

// 올바름: 컴포넌트가 사용하는 필드만 전달
<UserRow name={item.name} avatarUrl={item.avatar} />
```

**콜백은 호이스팅하거나 아이템 ID 사용:**

```tsx
// 잘못됨: 인라인 함수가 새 참조 생성
<UserRow name={item.name} onPress={() => handlePress(item.id)} />

// 올바름: ID 전달, 자식에서 처리
<UserRow id={item.id} name={item.name} />

const UserRow = memo(function UserRow({ id, name }: Props) {
  const handlePress = useCallback(() => {
    // 여기서 id 사용
  }, [id])
  return <Pressable onPress={handlePress}><Text>{name}</Text></Pressable>
})
```

기본형 prop은 메모이제이션을 예측 가능하고 효과적으로 만듭니다.

**참고:** React Compiler가 활성화된 경우 `memo()`나 `useCallback()`이 필요 없지만 객체 참조 규칙은 여전히 적용됩니다.
