---
title: Boolean Prop 남발 방지
impact: CRITICAL
impactDescription: 유지보수 불가능한 컴포넌트 변형을 예방
tags: composition, props, architecture
---

## Boolean Prop 남발 방지

컴포넌트 동작을 커스터마이징하기 위해 `isThread`, `isEditing`, `isDMThread` 같은
boolean prop을 추가하지 마세요. boolean이 추가될 때마다 가능한 상태가 두 배로 늘어나고
유지보수 불가능한 조건부 로직이 생깁니다. 대신 컴포지션을 사용하세요.

**잘못된 예시 (boolean prop이 지수적 복잡성을 만듦):**

```tsx
function Composer({
  onSubmit,
  isThread,
  channelId,
  isDMThread,
  dmId,
  isEditing,
  isForwarding,
}: Props) {
  return (
    <form>
      <Header />
      <Input />
      {isDMThread ? (
        <AlsoSendToDMField id={dmId} />
      ) : isThread ? (
        <AlsoSendToChannelField id={channelId} />
      ) : null}
      {isEditing ? (
        <EditActions />
      ) : isForwarding ? (
        <ForwardActions />
      ) : (
        <DefaultActions />
      )}
      <Footer onSubmit={onSubmit} />
    </form>
  )
}
```

**올바른 예시 (컴포지션으로 조건문 제거):**

```tsx
// 채널 컴포저
function ChannelComposer() {
  return (
    <Composer.Frame>
      <Composer.Header />
      <Composer.Input />
      <Composer.Footer>
        <Composer.Attachments />
        <Composer.Formatting />
        <Composer.Emojis />
        <Composer.Submit />
      </Composer.Footer>
    </Composer.Frame>
  )
}

// 스레드 컴포저 - "채널에도 전송" 필드 추가
function ThreadComposer({ channelId }: { channelId: string }) {
  return (
    <Composer.Frame>
      <Composer.Header />
      <Composer.Input />
      <AlsoSendToChannelField id={channelId} />
      <Composer.Footer>
        <Composer.Formatting />
        <Composer.Emojis />
        <Composer.Submit />
      </Composer.Footer>
    </Composer.Frame>
  )
}

// 편집 컴포저 - 다른 하단 액션
function EditComposer() {
  return (
    <Composer.Frame>
      <Composer.Input />
      <Composer.Footer>
        <Composer.Formatting />
        <Composer.Emojis />
        <Composer.CancelEdit />
        <Composer.SaveEdit />
      </Composer.Footer>
    </Composer.Frame>
  )
}
```

각 변형은 자신이 렌더링하는 것을 명시적으로 표현합니다. 하나의 거대한 부모를 공유하지 않고도
내부 요소를 공유할 수 있습니다.
