---
title: 비차단 작업에 after() 사용
impact: MEDIUM
impactDescription: 더 빠른 응답 시간
tags: server, async, logging, analytics, side-effects
---

## 비차단 작업에 after() 사용

응답이 전송된 후에 실행되어야 하는 작업을 예약하려면 Next.js의 `after()`를 사용하세요. 이를 통해 로깅, 분석 및 기타 사이드 이펙트가 응답을 차단하지 않습니다.

**잘못된 예 (응답 차단):**

```tsx
import { logUserAction } from '@/app/utils'

export async function POST(request: Request) {
  // 뮤테이션 수행
  await updateDatabase(request)
  
  // 로깅이 응답을 차단
  const userAgent = request.headers.get('user-agent') || 'unknown'
  await logUserAction({ userAgent })
  
  return new Response(JSON.stringify({ status: 'success' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
}
```

**올바른 예 (비차단):**

```tsx
import { after } from 'next/server'
import { headers, cookies } from 'next/headers'
import { logUserAction } from '@/app/utils'

export async function POST(request: Request) {
  // 뮤테이션 수행
  await updateDatabase(request)
  
  // 응답 전송 후 로그
  after(async () => {
    const userAgent = (await headers()).get('user-agent') || 'unknown'
    const sessionCookie = (await cookies()).get('session-id')?.value || 'anonymous'
    
    logUserAction({ sessionCookie, userAgent })
  })
  
  return new Response(JSON.stringify({ status: 'success' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
}
```

응답이 즉시 전송되고 로깅은 백그라운드에서 이루어집니다.

**일반적인 사용 사례:**

- 분석 추적
- 감사 로깅
- 알림 전송
- 캐시 무효화
- 정리 작업

**중요 사항:**

- `after()`는 응답이 실패하거나 리디렉션되더라도 실행됩니다
- 서버 액션, 라우트 핸들러, 서버 컴포넌트에서 작동합니다

참고: [https://nextjs.org/docs/app/api-reference/functions/after](https://nextjs.org/docs/app/api-reference/functions/after)
