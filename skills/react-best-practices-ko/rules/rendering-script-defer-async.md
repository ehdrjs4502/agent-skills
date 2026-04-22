---
title: 스크립트 태그에 defer 또는 async 사용
impact: HIGH
impactDescription: 렌더링 차단 제거
tags: rendering, script, defer, async, performance
---

## 스크립트 태그에 defer 또는 async 사용

**영향도: HIGH (렌더링 차단 제거)**

`defer` 또는 `async` 없는 스크립트 태그는 스크립트가 다운로드되고 실행되는 동안 HTML 파싱을 차단합니다. 이는 FCP(First Contentful Paint)와 TTI(Time to Interactive)를 지연시킵니다.

- **`defer`**: 병렬로 다운로드, HTML 파싱 완료 후 실행, 실행 순서 유지
- **`async`**: 병렬로 다운로드, 준비되면 즉시 실행, 순서 보장 없음

DOM 또는 다른 스크립트에 의존하는 스크립트에는 `defer`를 사용하세요. 분석과 같은 독립적인 스크립트에는 `async`를 사용하세요.

**잘못된 예 (렌더링 차단):**

```tsx
export default function Document() {
  return (
    <html>
      <head>
        <script src="https://example.com/analytics.js" />
        <script src="/scripts/utils.js" />
      </head>
      <body>{/* 콘텐츠 */}</body>
    </html>
  )
}
```

**올바른 예 (비차단):**

```tsx
export default function Document() {
  return (
    <html>
      <head>
        {/* 독립 스크립트 - async 사용 */}
        <script src="https://example.com/analytics.js" async />
        {/* DOM 의존 스크립트 - defer 사용 */}
        <script src="/scripts/utils.js" defer />
      </head>
      <body>{/* 콘텐츠 */}</body>
    </html>
  )
}
```

**참고:** Next.js에서는 원시 스크립트 태그 대신 `strategy` prop을 사용하는 `next/script` 컴포넌트를 선호하세요:

```tsx
import Script from 'next/script'

export default function Page() {
  return (
    <>
      <Script src="https://example.com/analytics.js" strategy="afterInteractive" />
      <Script src="/scripts/utils.js" strategy="beforeInteractive" />
    </>
  )
}
```

참고: [MDN - Script 요소](https://developer.mozilla.org/ko/docs/Web/HTML/Element/script#defer)
