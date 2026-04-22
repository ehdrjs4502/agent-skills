---
title: 컴포넌트 내부에 컴포넌트 정의 금지
impact: HIGH
impactDescription: 매 렌더링마다 리마운트 방지
tags: rerender, components, remount, performance
---

## 컴포넌트 내부에 컴포넌트 정의 금지

**영향도: HIGH (매 렌더링마다 리마운트 방지)**

컴포넌트 내부에 컴포넌트를 정의하면 매 렌더링마다 새로운 컴포넌트 타입이 생성됩니다. React는 매번 다른 컴포넌트로 인식하여 완전히 리마운트하고 모든 상태와 DOM을 파괴합니다.

개발자들이 이렇게 하는 일반적인 이유는 props를 전달하지 않고 부모 변수에 접근하기 위해서입니다. 항상 props를 전달하세요.

**잘못된 예 (매 렌더링마다 리마운트):**

```tsx
function UserProfile({ user, theme }) {
  // theme에 접근하기 위해 내부에 정의 - 나쁜 예
  const Avatar = () => (
    <img
      src={user.avatarUrl}
      className={theme === 'dark' ? 'avatar-dark' : 'avatar-light'}
    />
  )

  // user에 접근하기 위해 내부에 정의 - 나쁜 예
  const Stats = () => (
    <div>
      <span>{user.followers} 팔로워</span>
      <span>{user.posts} 게시물</span>
    </div>
  )

  return (
    <div>
      <Avatar />
      <Stats />
    </div>
  )
}
```

`UserProfile`이 렌더링될 때마다 `Avatar`와 `Stats`는 새 컴포넌트 타입입니다. React는 이전 인스턴스를 언마운트하고 새 것을 마운트하여 내부 상태를 잃고, effect가 다시 실행되고, DOM 노드가 재생성됩니다.

**올바른 예 (대신 props 전달):**

```tsx
function Avatar({ src, theme }: { src: string; theme: string }) {
  return (
    <img
      src={src}
      className={theme === 'dark' ? 'avatar-dark' : 'avatar-light'}
    />
  )
}

function Stats({ followers, posts }: { followers: number; posts: number }) {
  return (
    <div>
      <span>{followers} 팔로워</span>
      <span>{posts} 게시물</span>
    </div>
  )
}

function UserProfile({ user, theme }) {
  return (
    <div>
      <Avatar src={user.avatarUrl} theme={theme} />
      <Stats followers={user.followers} posts={user.posts} />
    </div>
  )
}
```

**이 버그의 증상:**
- 입력 필드가 키 입력마다 포커스를 잃음
- 애니메이션이 예기치 않게 재시작됨
- `useEffect` 정리/설정이 매 부모 렌더링마다 실행됨
- 컴포넌트 내의 스크롤 위치가 초기화됨
