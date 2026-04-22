---
title: React DOM 리소스 힌트 사용
impact: HIGH
impactDescription: 중요 리소스의 로드 시간 단축
tags: rendering, preload, preconnect, prefetch, resource-hints
---

## React DOM 리소스 힌트 사용

**영향도: HIGH (중요 리소스의 로드 시간 단축)**

React DOM은 브라우저에게 필요한 리소스에 대한 힌트를 제공하는 API를 제공합니다. 이는 클라이언트가 HTML을 받기 전에 리소스 로딩을 시작하기 위해 서버 컴포넌트에서 특히 유용합니다.

- **`prefetchDNS(href)`**: 연결할 것으로 예상되는 도메인의 DNS 해석
- **`preconnect(href)`**: 서버에 연결 설정 (DNS + TCP + TLS)
- **`preload(href, options)`**: 곧 사용할 리소스(스타일시트, 폰트, 스크립트, 이미지) 패치
- **`preloadModule(href)`**: 곧 사용할 ES 모듈 패치
- **`preinit(href, options)`**: 스타일시트 또는 스크립트 패치 및 평가
- **`preinitModule(href)`**: ES 모듈 패치 및 평가

**예시 (서드파티 API에 사전 연결):**

```tsx
import { preconnect, prefetchDNS } from 'react-dom'

export default function App() {
  prefetchDNS('https://analytics.example.com')
  preconnect('https://api.example.com')

  return <main>{/* 콘텐츠 */}</main>
}
```

**예시 (중요 폰트와 스타일 사전 로드):**

```tsx
import { preload, preinit } from 'react-dom'

export default function RootLayout({ children }) {
  // 폰트 파일 사전 로드
  preload('/fonts/inter.woff2', { as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' })

  // 중요 스타일시트 즉시 패치 및 적용
  preinit('/styles/critical.css', { as: 'style' })

  return (
    <html>
      <body>{children}</body>
    </html>
  )
}
```

**예시 (코드 분할 라우트를 위한 모듈 사전 로드):**

```tsx
import { preloadModule, preinitModule } from 'react-dom'

function Navigation() {
  const preloadDashboard = () => {
    preloadModule('/dashboard.js', { as: 'script' })
  }

  return (
    <nav>
      <a href="/dashboard" onMouseEnter={preloadDashboard}>
        대시보드
      </a>
    </nav>
  )
}
```

**각 API 사용 시점:**

| API | 사용 사례 |
|-----|----------|
| `prefetchDNS` | 나중에 연결할 서드파티 도메인 |
| `preconnect` | 즉시 패치할 API 또는 CDN |
| `preload` | 현재 페이지에 필요한 중요 리소스 |
| `preloadModule` | 다음 내비게이션 가능성이 있는 JS 모듈 |
| `preinit` | 일찍 실행되어야 하는 스타일시트/스크립트 |
| `preinitModule` | 일찍 실행되어야 하는 ES 모듈 |

참고: [React DOM 리소스 사전 로드 API](https://react.dev/reference/react-dom#resource-preloading-apis)
