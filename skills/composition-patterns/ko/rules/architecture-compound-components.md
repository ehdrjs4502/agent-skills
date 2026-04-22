---
title: 컴파운드 컴포넌트 사용
impact: HIGH
impactDescription: prop drilling 없이 유연한 컴포지션 가능
tags: composition, compound-components, architecture
---

## 컴파운드 컴포넌트 사용

복잡한 컴포넌트는 공유 컨텍스트를 가진 컴파운드 컴포넌트로 구조화하세요.
각 하위 컴포넌트는 props가 아닌 컨텍스트를 통해 공유 상태에 접근합니다.
사용자는 필요한 부분만 조합합니다.

**잘못된 예시 (렌더 프롭을 가진 모놀리식 컴포넌트):**

```tsx
function Composer({
  renderHeader,
  renderFooter,
  renderActions,
  showAttachments,
  showFormatting,
  showEmojis,
}: Props) {
  return (
    <form>
      {renderHeader?.()}
      <Input />
      {showAttachments && <Attachments />}
      {renderFooter ? (
        renderFooter()
      ) : (
        <Footer>
          {showFormatting && <Formatting />}
          {showEmojis && <Emojis />}
          {renderActions?.()}
        </Footer>
      )}
    </form>
  )
}
```

**올바른 예시 (공유 컨텍스트를 가진 컴파운드 컴포넌트):**

```tsx
const ComposerContext = createContext<ComposerContextValue | null>(null)

function ComposerProvider({ children, state, actions, meta }: ProviderProps) {
  return (
    <ComposerContext value={{ state, actions, meta }}>
      {children}
    </ComposerContext>
  )
}

function ComposerFrame({ children }: { children: React.ReactNode }) {
  return <form>{children}</form>
}

function ComposerInput() {
  const {
    state,
    actions: { update },
    meta: { inputRef },
  } = use(ComposerContext)
  return (
    <TextInput
      ref={inputRef}
      value={state.input}
      onChangeText={(text) => update((s) => ({ ...s, input: text }))}
    />
  )
}

function ComposerSubmit() {
  const {
    actions: { submit },
  } = use(ComposerContext)
  return <Button onPress={submit}>전송</Button>
}

// 컴파운드 컴포넌트로 내보내기
const Composer = {
  Provider: ComposerProvider,
  Frame: ComposerFrame,
  Input: ComposerInput,
  Submit: ComposerSubmit,
  Header: ComposerHeader,
  Footer: ComposerFooter,
  Attachments: ComposerAttachments,
  Formatting: ComposerFormatting,
  Emojis: ComposerEmojis,
}
```

**사용 예시:**

```tsx
<Composer.Provider state={state} actions={actions} meta={meta}>
  <Composer.Frame>
    <Composer.Header />
    <Composer.Input />
    <Composer.Footer>
      <Composer.Formatting />
      <Composer.Submit />
    </Composer.Footer>
  </Composer.Frame>
</Composer.Provider>
```

사용자는 필요한 것만 정확히 조합합니다. 숨겨진 조건문이 없습니다.
상태, 액션, 메타는 부모 프로바이더가 의존성 주입으로 제공하므로
동일한 컴포넌트 구조를 여러 방식으로 사용할 수 있습니다.
