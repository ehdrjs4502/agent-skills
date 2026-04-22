---
title: 현대적인 React Native 스타일링 패턴
impact: MEDIUM
impactDescription: 일관된 디자인, 부드러운 테두리, 깔끔한 레이아웃
tags: styling, css, layout, shadows, gradients
---

## 현대적인 React Native 스타일링 패턴

더 깔끔하고 일관된 React Native 코드를 위한 스타일링 패턴입니다.

**`borderRadius`에 항상 `borderCurve: 'continuous'` 사용:**

```tsx
// 잘못됨
{ borderRadius: 12 }

// 올바름 – iOS 스타일의 더 부드러운 모서리
{ borderRadius: 12, borderCurve: 'continuous' }
```

**요소 간 간격에 margin 대신 `gap` 사용:**

```tsx
// 잘못됨 – 자식에 margin
<View>
  <Text style={{ marginBottom: 8 }}>제목</Text>
  <Text style={{ marginBottom: 8 }}>부제목</Text>
</View>

// 올바름 – 부모에 gap
<View style={{ gap: 8 }}>
  <Text>제목</Text>
  <Text>부제목</Text>
</View>
```

**내부 공간에 `padding`, 요소 간 공간에 `gap`:**

```tsx
<View style={{ padding: 16, gap: 12 }}>
  <Text>첫 번째</Text>
  <Text>두 번째</Text>
</View>
```

**선형 그라디언트에 `experimental_backgroundImage` 사용:**

```tsx
// 잘못됨 – 서드파티 그라디언트 라이브러리
<LinearGradient colors={['#000', '#fff']} />

// 올바름 – 네이티브 CSS 그라디언트 문법
<View
  style={{
    experimental_backgroundImage: 'linear-gradient(to bottom, #000, #fff)',
  }}
/>
```

**그림자에 CSS `boxShadow` 문자열 문법 사용:**

```tsx
// 잘못됨 – 레거시 그림자 객체 또는 elevation
{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1 }
{ elevation: 4 }

// 올바름 – CSS box-shadow 문법
{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }
```

**여러 폰트 크기 사용 금지 – 강조에 weight와 색상 사용:**

```tsx
// 잘못됨 – 계층 구조에 다양한 폰트 크기
<Text style={{ fontSize: 18 }}>제목</Text>
<Text style={{ fontSize: 14 }}>부제목</Text>
<Text style={{ fontSize: 12 }}>캡션</Text>

// 올바름 – 일관된 크기, weight와 색상 변화
<Text style={{ fontWeight: '600' }}>제목</Text>
<Text style={{ color: '#666' }}>부제목</Text>
<Text style={{ color: '#999' }}>캡션</Text>
```

폰트 크기를 제한하면 시각적 일관성이 생깁니다.
계층 구조에는 크기 대신 `fontWeight`(bold/semibold)와 회색조 색상을 사용하세요.
