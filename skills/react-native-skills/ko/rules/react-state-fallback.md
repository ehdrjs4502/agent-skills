---
title: initialState 대신 fallback 상태 사용
impact: MEDIUM
impactDescription: 동기화 없이 반응형 fallback
tags: state, hooks, derived-state, props, initialState
---

## initialState 대신 fallback 상태 사용

초기 상태로 `undefined`를 사용하고 nullish 병합(`??`)으로 부모 또는 서버 값을 fallback으로 사용하세요.
상태는 사용자 의도만을 나타냅니다. `undefined`는 "사용자가 아직 선택하지 않음"을 의미합니다.
이렇게 하면 첫 번째 렌더뿐만 아니라 소스가 변경될 때 업데이트되는 반응형 fallback이 가능합니다.

**잘못된 예시 (상태 동기화, 반응성 손실):**

```tsx
type Props = { fallbackEnabled: boolean }

function Toggle({ fallbackEnabled }: Props) {
  const [enabled, setEnabled] = useState(defaultEnabled)
  // fallbackEnabled가 변경되면 상태가 stale해짐
  // 상태가 사용자 의도와 기본값을 혼합함

  return <Switch value={enabled} onValueChange={setEnabled} />
}
```

**올바른 예시 (상태는 사용자 의도, 반응형 fallback):**

```tsx
type Props = { fallbackEnabled: boolean }

function Toggle({ fallbackEnabled }: Props) {
  const [_enabled, setEnabled] = useState<boolean | undefined>(undefined)
  const enabled = _enabled ?? defaultEnabled
  // undefined = 사용자가 아직 조작하지 않음, prop으로 fallback
  // defaultEnabled가 변경되면 컴포넌트가 반영
  // 사용자가 조작하면 그 선택이 유지됨

  return <Switch value={enabled} onValueChange={setEnabled} />
}
```

**서버 데이터와 함께:**

```tsx
function ProfileForm({ data }: { data: User }) {
  const [_theme, setTheme] = useState<string | undefined>(undefined)
  const theme = _theme ?? data.theme
  // 사용자가 재정의하기 전까지 서버 값 표시
  // 서버 리패치가 자동으로 fallback을 업데이트

  return <ThemePicker value={theme} onChange={setTheme} />
}
```
