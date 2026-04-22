---
title: 배럴 파일 임포트 방지
impact: CRITICAL
impactDescription: 200-800ms 임포트 비용, 느린 빌드
tags: bundle, imports, tree-shaking, barrel-files, performance
---

## 배럴 파일 임포트 방지

사용하지 않는 수천 개의 모듈 로딩을 방지하기 위해 배럴 파일 대신 소스 파일에서 직접 임포트하세요. **배럴 파일**은 여러 모듈을 재내보내는 진입점입니다(예: `export * from './module'`을 하는 `index.js`).

인기 있는 아이콘 및 컴포넌트 라이브러리는 진입 파일에 **최대 10,000개의 재내보내기**가 있을 수 있습니다. 많은 React 패키지의 경우 **임포트만으로 200-800ms가 소요**되어 개발 속도와 프로덕션 콜드 스타트 모두에 영향을 미칩니다.

**트리 쉐이킹이 도움이 되지 않는 이유:** 라이브러리가 외부(번들링되지 않음)로 표시된 경우 번들러가 최적화할 수 없습니다. 트리 쉐이킹을 위해 번들링하면 전체 모듈 그래프 분석으로 빌드가 상당히 느려집니다.

**잘못된 예 (전체 라이브러리 임포트):**

```tsx
import { Check, X, Menu } from 'lucide-react'
// 1,583개 모듈 로드, 개발 환경에서 ~2.8s 추가 소요
// 런타임 비용: 매 콜드 스타트마다 200-800ms

import { Button, TextField } from '@mui/material'
// 2,225개 모듈 로드, 개발 환경에서 ~4.2s 추가 소요
```

**올바른 예 - Next.js 13.5+ (권장):**

```js
// next.config.js - 빌드 시 자동으로 배럴 임포트 최적화
module.exports = {
  experimental: {
    optimizePackageImports: ['lucide-react', '@mui/material']
  }
}
```

```tsx
// 표준 임포트 유지 - Next.js가 직접 임포트로 변환
import { Check, X, Menu } from 'lucide-react'
// 완전한 TypeScript 지원, 수동 경로 조작 불필요
```

이 방법은 TypeScript 타입 안전성과 에디터 자동 완성을 유지하면서 배럴 임포트 비용을 제거하므로 권장됩니다.

**올바른 예 - 직접 임포트 (Next.js가 아닌 프로젝트):**

```tsx
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
// 사용하는 것만 로드
```

> **TypeScript 주의:** 일부 라이브러리(특히 `lucide-react`)는 깊은 임포트 경로에 `.d.ts` 파일을 제공하지 않습니다. `lucide-react/dist/esm/icons/check`에서 임포트하면 암시적 `any` 타입으로 해석되어 `strict` 또는 `noImplicitAny` 환경에서 오류가 발생합니다. 가능한 경우 `optimizePackageImports`를 선호하거나 직접 임포트 전에 서브패스에 대한 타입 내보내기를 확인하세요.

이 최적화는 개발 부팅 15-70% 단축, 빌드 28% 단축, 콜드 스타트 40% 단축, HMR 상당 개선을 제공합니다.

일반적으로 영향을 받는 라이브러리: `lucide-react`, `@mui/material`, `@mui/icons-material`, `@tabler/icons-react`, `react-icons`, `@headlessui/react`, `@radix-ui/react-*`, `lodash`, `ramda`, `date-fns`, `rxjs`, `react-use`.

참고: [Next.js에서 패키지 임포트 최적화 방법](https://vercel.com/blog/how-we-optimized-package-imports-in-next-js)
