---
title: 정적 분석 가능한 경로 선호
impact: HIGH
impactDescription: 의도치 않은 넓은 번들 및 파일 추적 방지
tags: bundle, nextjs, vite, webpack, rollup, esbuild, path
---

## 정적 분석 가능한 경로 선호

빌드 도구는 임포트 및 파일 시스템 경로가 빌드 시간에 명확할 때 가장 잘 작동합니다. 실제 경로를 변수 안에 숨기거나 너무 동적으로 구성하면, 도구는 가능한 파일의 광범위한 세트를 포함하거나, 임포트를 분석할 수 없다고 경고하거나, 안전을 위해 파일 추적을 확장해야 합니다.

도달 가능한 파일 세트가 좁고 예측 가능하도록 명시적 맵이나 리터럴 경로를 선호하세요. 이 규칙은 `import()`로 모듈을 선택하든, 서버/빌드 코드에서 파일을 읽든 동일하게 적용됩니다.

분석이 너무 광범위해지면 실제 비용이 발생합니다:
- 더 큰 서버 번들
- 느린 빌드
- 더 나쁜 콜드 스타트
- 더 많은 메모리 사용

### 임포트 경로

**잘못된 예 (번들러가 무엇이 임포트될지 알 수 없음):**

```ts
const PAGE_MODULES = {
  home: './pages/home',
  settings: './pages/settings',
} as const

const Page = await import(PAGE_MODULES[pageName])
```

**올바른 예 (허용된 모듈의 명시적 맵 사용):**

```ts
const PAGE_MODULES = {
  home: () => import('./pages/home'),
  settings: () => import('./pages/settings'),
} as const

const Page = await PAGE_MODULES[pageName]()
```

### 파일 시스템 경로

**잘못된 예 (2개 값 열거형도 정적 분석에서 최종 경로를 숨김):**

```ts
const baseDir = path.join(process.cwd(), 'content/' + contentKind)
```

**올바른 예 (각 최종 경로를 호출 지점에서 리터럴로 만들기):**

```ts
const baseDir =
  kind === ContentKind.Blog
    ? path.join(process.cwd(), 'content/blog')
    : path.join(process.cwd(), 'content/docs')
```

Next.js 서버 코드에서는 출력 파일 추적에도 중요합니다. `path.join(process.cwd(), someVar)`는 Next.js가 `import`, `require`, `fs` 사용을 정적 분석하기 때문에 추적되는 파일 세트를 넓힐 수 있습니다.

참고: [Next.js output](https://nextjs.org/docs/app/api-reference/config/next-config-js/output), [Next.js dynamic imports](https://nextjs.org/learn/seo/dynamic-imports), [Vite features](https://vite.dev/guide/features.html), [esbuild API](https://esbuild.github.io/api/), [Rollup dynamic import vars](https://www.npmjs.com/package/@rollup/plugin-dynamic-import-vars), [Webpack dependency management](https://webpack.js.org/guides/dependency-management/)
