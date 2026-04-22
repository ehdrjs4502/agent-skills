---
title: API 라우트처럼 서버 액션 인증
impact: CRITICAL
impactDescription: 서버 뮤테이션에 대한 무단 접근 방지
tags: server, server-actions, authentication, security, authorization
---

## API 라우트처럼 서버 액션 인증

**영향도: CRITICAL (서버 뮤테이션에 대한 무단 접근 방지)**

서버 액션(`"use server"`가 있는 함수)은 API 라우트처럼 공개 엔드포인트로 노출됩니다. 서버 액션은 직접 호출될 수 있으므로 미들웨어, 레이아웃 가드, 페이지 레벨 체크만 의존하지 말고 각 서버 액션 **내부에서** 항상 인증 및 인가를 확인하세요.

Next.js 문서는 명시적으로 말합니다: "서버 액션을 공개 API 엔드포인트와 동일한 보안 고려사항으로 처리하고, 사용자가 뮤테이션을 수행할 권한이 있는지 확인하세요."

**잘못된 예 (인증 확인 없음):**

```typescript
'use server'

export async function deleteUser(userId: string) {
  // 누구나 호출 가능! 인증 확인 없음
  await db.user.delete({ where: { id: userId } })
  return { success: true }
}
```

**올바른 예 (액션 내부에서 인증):**

```typescript
'use server'

import { verifySession } from '@/lib/auth'
import { unauthorized } from '@/lib/errors'

export async function deleteUser(userId: string) {
  // 액션 내부에서 항상 인증 확인
  const session = await verifySession()
  
  if (!session) {
    throw unauthorized('로그인이 필요합니다')
  }
  
  // 인가도 확인
  if (session.user.role !== 'admin' && session.user.id !== userId) {
    throw unauthorized('다른 사용자를 삭제할 수 없습니다')
  }
  
  await db.user.delete({ where: { id: userId } })
  return { success: true }
}
```

**입력 유효성 검사와 함께:**

```typescript
'use server'

import { verifySession } from '@/lib/auth'
import { z } from 'zod'

const updateProfileSchema = z.object({
  userId: z.string().uuid(),
  name: z.string().min(1).max(100),
  email: z.string().email()
})

export async function updateProfile(data: unknown) {
  // 먼저 입력 유효성 검사
  const validated = updateProfileSchema.parse(data)
  
  // 그 다음 인증
  const session = await verifySession()
  if (!session) {
    throw new Error('Unauthorized')
  }
  
  // 그 다음 인가
  if (session.user.id !== validated.userId) {
    throw new Error('자신의 프로필만 수정할 수 있습니다')
  }
  
  // 마지막으로 뮤테이션 수행
  await db.user.update({
    where: { id: validated.userId },
    data: {
      name: validated.name,
      email: validated.email
    }
  })
  
  return { success: true }
}
```

참고: [https://nextjs.org/docs/app/guides/authentication](https://nextjs.org/docs/app/guides/authentication)
