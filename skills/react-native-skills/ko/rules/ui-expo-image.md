---
title: 최적화된 이미지에 expo-image 사용
impact: HIGH
impactDescription: 메모리 효율, 캐싱, blurhash 플레이스홀더, 프로그레시브 로딩
tags: images, performance, expo-image, ui
---

## 최적화된 이미지에 expo-image 사용

React Native의 `Image` 대신 `expo-image`를 사용하세요.
메모리 효율적인 캐싱, blurhash 플레이스홀더, 프로그레시브 로딩, 목록에서의 더 나은 성능을 제공합니다.

**잘못된 예시 (React Native Image):**

```tsx
import { Image } from 'react-native'

function Avatar({ url }: { url: string }) {
  return <Image source={{ uri: url }} style={styles.avatar} />
}
```

**올바른 예시 (expo-image):**

```tsx
import { Image } from 'expo-image'

function Avatar({ url }: { url: string }) {
  return <Image source={{ uri: url }} style={styles.avatar} />
}
```

**blurhash 플레이스홀더와 함께:**

```tsx
<Image
  source={{ uri: url }}
  placeholder={{ blurhash: 'LGF5]+Yk^6#M@-5c,1J5@[or[Q6.' }}
  contentFit="cover"
  transition={200}
  style={styles.image}
/>
```

**우선순위와 캐싱과 함께:**

```tsx
<Image
  source={{ uri: url }}
  priority="high"
  cachePolicy="memory-disk"
  style={styles.hero}
/>
```

**주요 props:**

- `placeholder` — 로딩 중 blurhash 또는 썸네일
- `contentFit` — `cover`, `contain`, `fill`, `scale-down`
- `transition` — 페이드인 시간(ms)
- `priority` — `low`, `normal`, `high`
- `cachePolicy` — `memory`, `disk`, `memory-disk`, `none`
- `recyclingKey` — 목록 재활용을 위한 고유 키

크로스 플랫폼(웹 + 네이티브)의 경우 `solito/image`의 `SolitoImage`를 사용하세요.
내부적으로 `expo-image`를 사용합니다.

참고: [expo-image](https://docs.expo.dev/versions/latest/sdk/image/)
