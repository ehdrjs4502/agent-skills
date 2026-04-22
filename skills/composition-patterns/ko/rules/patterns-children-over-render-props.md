---
title: 렌더 프롭보다 Children 컴포지션 선호
impact: MEDIUM
impactDescription: 더 깔끔한 컴포지션, 더 나은 가독성
tags: composition, children, render-props
---

## 렌더 프롭보다 Children 사용

`renderX` prop 대신 `children`을 사용해 컴포지션하세요. children은 더 읽기 쉽고,
자연스럽게 조합되며, 콜백 시그니처를 이해할 필요가 없습니다.

**잘못된 예시 (렌더 프롭):**

```tsx
function Composer({
  renderHeader,
  renderFooter,
  renderActions,
}: {
  renderHeader?: () => React.ReactNode
  renderFooter?: () => React.ReactNode
  renderActions?: () => React.ReactNode
}) {
  return (
    <form>
      {renderHeader?.()}
      <Input />
      {renderFooter ? renderFooter() : <DefaultFooter />}
      {renderActions?.()}
    </form>
  )
}

// 사용이 어색하고 유연하지 않음
return (
  <Composer
    renderHeader={() => <CustomHeader />}
    renderFooter={() => (
      <>
        <Formatting />
        <Emojis />
      </>
    )}
    renderActions={() => <SubmitButton />}
  />
)
```

**올바른 예시 (children을 사용한 컴파운드 컴포넌트):**

```tsx
function ComposerFrame({ children }: { children: React.ReactNode }) {
  return <form>{children}</form>
}

function ComposerFooter({ children }: { children: React.ReactNode }) {
  return <footer className='flex'>{children}</footer>
}

// 사용이 유연함
return (
  <Composer.Frame>
    <CustomHeader />
    <Composer.Input />
    <Composer.Footer>
      <Composer.Formatting />
      <Composer.Emojis />
      <SubmitButton />
    </Composer.Footer>
  </Composer.Frame>
)
```

**렌더 프롭이 적합한 경우:**

```tsx
// 부모가 데이터를 자식에 전달해야 할 때는 렌더 프롭이 유효함
<List
  data={items}
  renderItem={({ item, index }) => <Item item={item} index={index} />}
/>
```

부모가 자식에게 데이터나 상태를 전달해야 할 때는 렌더 프롭을 사용하세요.
정적 구조를 조합할 때는 children을 사용하세요.
