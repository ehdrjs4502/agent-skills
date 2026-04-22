---
title: 무거운 컴포넌트에 동적 임포트
impact: CRITICAL
impactDescription: TTI와 LCP에 직접 영향
tags: bundle, dynamic-import, code-splitting, next-dynamic
---

## 무거운 컴포넌트에 동적 임포트

초기 렌더링에 필요하지 않은 대형 컴포넌트를 지연 로드하려면 `next/dynamic`을 사용하세요.

**잘못된 예 (Monaco가 메인 청크와 함께 번들링됨 ~300KB):**

```tsx
import { MonacoEditor } from './monaco-editor'

function CodePanel({ code }: { code: string }) {
  return <MonacoEditor value={code} />
}
```

**올바른 예 (Monaco가 필요 시 로드):**

```tsx
import dynamic from 'next/dynamic'

const MonacoEditor = dynamic(
  () => import('./monaco-editor').then(m => m.MonacoEditor),
  { ssr: false }
)

function CodePanel({ code }: { code: string }) {
  return <MonacoEditor value={code} />
}
```
