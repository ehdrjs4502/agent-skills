---
title: 컴포넌트 구성으로 병렬 데이터 패칭
impact: CRITICAL
impactDescription: 서버 사이드 워터폴 제거
tags: server, rsc, parallel-fetching, composition
---

## 컴포넌트 구성으로 병렬 데이터 패칭

React 서버 컴포넌트는 트리 내에서 순차적으로 실행됩니다. 데이터 패칭을 병렬화하기 위해 컴포넌트 구성으로 재구성하세요.

**잘못된 예 (Sidebar가 Page의 패치 완료를 기다림):**

```tsx
export default async function Page() {
  const header = await fetchHeader()
  return (
    <div>
      <div>{header}</div>
      <Sidebar />
    </div>
  )
}

async function Sidebar() {
  const items = await fetchSidebarItems()
  return <nav>{items.map(renderItem)}</nav>
}
```

**올바른 예 (둘 다 동시에 패치):**

```tsx
async function Header() {
  const data = await fetchHeader()
  return <div>{data}</div>
}

async function Sidebar() {
  const items = await fetchSidebarItems()
  return <nav>{items.map(renderItem)}</nav>
}

export default function Page() {
  return (
    <div>
      <Header />
      <Sidebar />
    </div>
  )
}
```

**children prop을 사용한 대안:**

```tsx
async function Header() {
  const data = await fetchHeader()
  return <div>{data}</div>
}

async function Sidebar() {
  const items = await fetchSidebarItems()
  return <nav>{items.map(renderItem)}</nav>
}

function Layout({ children }: { children: ReactNode }) {
  return (
    <div>
      <Header />
      {children}
    </div>
  )
}

export default function Page() {
  return (
    <Layout>
      <Sidebar />
    </Layout>
  )
}
```
