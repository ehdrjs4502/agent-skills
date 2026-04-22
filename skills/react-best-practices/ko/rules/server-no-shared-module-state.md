---
title: 요청 데이터에 공유 모듈 상태 사용 금지
impact: HIGH
impactDescription: 동시성 버그 및 요청 데이터 유출 방지
tags: server, rsc, ssr, concurrency, security, state
---

## 요청 데이터에 공유 모듈 상태 사용 금지

React 서버 컴포넌트와 SSR 중에 렌더링되는 클라이언트 컴포넌트의 경우, 요청 범위 데이터를 공유하기 위해 변경 가능한 모듈 레벨 변수를 사용하지 마세요. 서버 렌더링은 동일한 프로세스에서 동시에 실행될 수 있습니다. 한 렌더가 공유 모듈 상태에 쓰고 다른 렌더가 그것을 읽으면 경쟁 조건, 요청 간 오염, 한 사용자의 데이터가 다른 사용자의 응답에 나타나는 보안 버그가 발생할 수 있습니다.

서버의 모듈 범위를 요청 로컬 상태가 아닌 프로세스 전체 공유 메모리로 취급하세요.

**잘못된 예 (동시 렌더링 간 요청 데이터 유출):**

```tsx
let currentUser: User | null = null

export default async function Page() {
  currentUser = await auth()
  return <Dashboard />
}

async function Dashboard() {
  return <div>{currentUser?.name}</div>
}
```

두 요청이 겹치면 요청 A가 `currentUser`를 설정하고, 요청 A가 `Dashboard` 렌더링을 마치기 전에 요청 B가 덮어쓸 수 있습니다.

**올바른 예 (렌더 트리 내에 요청 데이터 유지):**

```tsx
export default async function Page() {
  const user = await auth()
  return <Dashboard user={user} />
}

function Dashboard({ user }: { user: User | null }) {
  return <div>{user?.name}</div>
}
```

안전한 예외:

- 모듈 범위에서 한 번 로드되는 불변 정적 에셋 또는 설정
- 요청 간 재사용을 위해 의도적으로 설계되고 올바르게 키가 지정된 공유 캐시
- 요청 또는 사용자별 변경 가능한 데이터를 저장하지 않는 프로세스 전체 싱글톤

정적 에셋 및 설정에 대해서는 [정적 I/O를 모듈 레벨로 호이스팅](./server-hoist-static-io.md)을 참조하세요.
