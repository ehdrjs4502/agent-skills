---
title: 정적 I/O를 모듈 레벨로 호이스팅
impact: HIGH
impactDescription: 요청마다 반복적인 파일/네트워크 I/O 방지
tags: server, io, performance, next.js, route-handlers, og-image
---

## 정적 I/O를 모듈 레벨로 호이스팅

**영향도: HIGH (요청마다 반복적인 파일/네트워크 I/O 방지)**

라우트 핸들러나 서버 함수에서 정적 에셋(폰트, 로고, 이미지, 설정 파일)을 로드할 때는 I/O 작업을 모듈 레벨로 호이스팅하세요. 모듈 레벨 코드는 모듈이 처음 임포트될 때 한 번만 실행되고, 매 요청마다 실행되지 않습니다. 이를 통해 모든 호출마다 실행되는 불필요한 파일 시스템 읽기나 네트워크 패치가 제거됩니다.

**잘못된 예 (매 요청마다 폰트 파일 읽기):**

```typescript
// app/api/og/route.tsx
import { ImageResponse } from 'next/og'

export async function GET(request: Request) {
  // 매 요청마다 실행 - 비용이 큼!
  const fontData = await fetch(
    new URL('./fonts/Inter.ttf', import.meta.url)
  ).then(res => res.arrayBuffer())

  const logoData = await fetch(
    new URL('./images/logo.png', import.meta.url)
  ).then(res => res.arrayBuffer())

  return new ImageResponse(
    <div style={{ fontFamily: 'Inter' }}>
      <img src={logoData} />
      Hello World
    </div>,
    { fonts: [{ name: 'Inter', data: fontData }] }
  )
}
```

**올바른 예 (모듈 초기화 시 한 번만 로드):**

```typescript
// app/api/og/route.tsx
import { ImageResponse } from 'next/og'

// 모듈 레벨: 모듈이 처음 임포트될 때 한 번만 실행
const fontData = fetch(
  new URL('./fonts/Inter.ttf', import.meta.url)
).then(res => res.arrayBuffer())

const logoData = fetch(
  new URL('./images/logo.png', import.meta.url)
).then(res => res.arrayBuffer())

export async function GET(request: Request) {
  // 이미 시작된 프로미스를 await
  const [font, logo] = await Promise.all([fontData, logoData])

  return new ImageResponse(
    <div style={{ fontFamily: 'Inter' }}>
      <img src={logo} />
      Hello World
    </div>,
    { fonts: [{ name: 'Inter', data: font }] }
  )
}
```

**올바른 예 (모듈 레벨에서 동기 fs):**

```typescript
// app/api/og/route.tsx
import { ImageResponse } from 'next/og'
import { readFileSync } from 'fs'
import { join } from 'path'

// 모듈 레벨에서 동기 읽기 - 모듈 초기화 중에만 차단
const fontData = readFileSync(
  join(process.cwd(), 'public/fonts/Inter.ttf')
)

const logoData = readFileSync(
  join(process.cwd(), 'public/images/logo.png')
)

export async function GET(request: Request) {
  return new ImageResponse(
    <div style={{ fontFamily: 'Inter' }}>
      <img src={logoData} />
      Hello World
    </div>,
    { fonts: [{ name: 'Inter', data: fontData }] }
  )
}
```

이 패턴을 사용할 때:

- OG 이미지 생성을 위한 폰트 로드
- 정적 로고, 아이콘, 워터마크 로드
- 런타임에 변경되지 않는 설정 파일 읽기
- 이메일 템플릿 또는 기타 정적 템플릿 로드
- 모든 요청에서 동일한 정적 에셋

이 패턴을 사용하지 말아야 할 때:

- 요청 또는 사용자별로 다른 에셋
- 런타임에 변경될 수 있는 파일 (TTL이 있는 캐싱 사용)
- 로드된 상태로 유지하면 메모리를 너무 많이 소비하는 대용량 파일
- 메모리에 지속되어서는 안 되는 민감한 데이터
