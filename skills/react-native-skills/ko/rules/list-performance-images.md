---
title: 목록에서 압축된 이미지 사용
impact: HIGH
impactDescription: 빠른 로딩, 적은 메모리
tags: lists, images, performance, optimization
---

## 목록에서 압축된 이미지 사용

목록에서는 항상 압축되고 적절한 크기의 이미지를 로드하세요.
원본 해상도 이미지는 과도한 메모리를 소비하고 스크롤 끊김을 유발합니다.
서버에서 썸네일을 요청하거나 리사이즈 파라미터가 있는 이미지 CDN을 사용하세요.

**잘못된 예시 (원본 해상도 이미지):**

```tsx
function ProductItem({ product }: { product: Product }) {
  return (
    <View>
      {/* 100x100 썸네일에 4000x3000 이미지 로드 */}
      <Image
        source={{ uri: product.imageUrl }}
        style={{ width: 100, height: 100 }}
      />
      <Text>{product.name}</Text>
    </View>
  )
}
```

**올바른 예시 (적절한 크기의 이미지 요청):**

```tsx
function ProductItem({ product }: { product: Product }) {
  // 200x200 이미지 요청 (레티나용 2x)
  const thumbnailUrl = `${product.imageUrl}?w=200&h=200&fit=cover`

  return (
    <View>
      <Image
        source={{ uri: thumbnailUrl }}
        style={{ width: 100, height: 100 }}
        contentFit='cover'
      />
      <Text>{product.name}</Text>
    </View>
  )
}
```

내장 캐싱과 플레이스홀더를 지원하는 최적화된 이미지 컴포넌트를 사용하세요.
예: `expo-image` 또는 `SolitoImage`(내부적으로 `expo-image` 사용).
레티나 화면을 위해 표시 크기의 2배로 이미지를 요청하세요.
