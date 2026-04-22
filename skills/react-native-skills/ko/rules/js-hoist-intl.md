---
title: Intl 포매터 생성 호이스팅
impact: LOW-MEDIUM
impactDescription: 비용이 큰 객체 재생성 방지
tags: javascript, intl, optimization, memoization
---

## Intl 포매터 생성 호이스팅

렌더나 루프 내부에서 `Intl.DateTimeFormat`, `Intl.NumberFormat`, `Intl.RelativeTimeFormat`을
생성하지 마세요. 이들은 인스턴스화 비용이 큽니다. 로케일/옵션이 정적이면 모듈 스코프로 호이스팅하세요.

**잘못된 예시 (매 렌더마다 새 포매터 생성):**

```tsx
function Price({ amount }: { amount: number }) {
  const formatter = new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
  })
  return <Text>{formatter.format(amount)}</Text>
}
```

**올바른 예시 (모듈 스코프로 호이스팅):**

```tsx
const currencyFormatter = new Intl.NumberFormat('ko-KR', {
  style: 'currency',
  currency: 'KRW',
})

function Price({ amount }: { amount: number }) {
  return <Text>{currencyFormatter.format(amount)}</Text>
}
```

**동적 로케일의 경우 메모이즈:**

```tsx
const dateFormatter = useMemo(
  () => new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }),
  [locale]
)
```

**호이스팅할 일반적인 포매터들:**

```tsx
// 모듈 레벨 포매터
const dateFormatter = new Intl.DateTimeFormat('ko-KR', { dateStyle: 'medium' })
const timeFormatter = new Intl.DateTimeFormat('ko-KR', { timeStyle: 'short' })
const percentFormatter = new Intl.NumberFormat('ko-KR', { style: 'percent' })
const relativeFormatter = new Intl.RelativeTimeFormat('ko', { numeric: 'auto' })
```

`Intl` 객체 생성은 `RegExp`나 일반 객체보다 훨씬 비쌉니다.
각 인스턴스화는 로케일 데이터를 파싱하고 내부 조회 테이블을 구성합니다.
