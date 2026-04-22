---
title: 이미지 갤러리와 라이트박스에 Galeria 사용
impact: MEDIUM
impactDescription: 네이티브 공유 요소 전환, 핀치 줌, 닫기 제스처
tags: images, gallery, lightbox, expo-image, ui
---

## 이미지 갤러리와 라이트박스에 Galeria 사용

라이트박스(탭으로 전체화면)가 있는 이미지 갤러리에는 `@nandorojo/galeria`를 사용하세요.
네이티브 공유 요소 전환, 핀치 줌, 더블 탭 줌, 닫기 스와이프를 제공합니다.
`expo-image`를 포함한 모든 이미지 컴포넌트와 함께 작동합니다.

**잘못된 예시 (커스텀 모달 구현):**

```tsx
function ImageGallery({ urls }: { urls: string[] }) {
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <>
      {urls.map((url) => (
        <Pressable key={url} onPress={() => setSelected(url)}>
          <Image source={{ uri: url }} style={styles.thumbnail} />
        </Pressable>
      ))}
      <Modal visible={!!selected} onRequestClose={() => setSelected(null)}>
        <Image source={{ uri: selected! }} style={styles.fullscreen} />
      </Modal>
    </>
  )
}
```

**올바른 예시 (expo-image와 함께 Galeria):**

```tsx
import { Galeria } from '@nandorojo/galeria'
import { Image } from 'expo-image'

function ImageGallery({ urls }: { urls: string[] }) {
  return (
    <Galeria urls={urls}>
      {urls.map((url, index) => (
        <Galeria.Image index={index} key={url}>
          <Image source={{ uri: url }} style={styles.thumbnail} />
        </Galeria.Image>
      ))}
    </Galeria>
  )
}
```

**단일 이미지:**

```tsx
import { Galeria } from '@nandorojo/galeria'
import { Image } from 'expo-image'

function Avatar({ url }: { url: string }) {
  return (
    <Galeria urls={[url]}>
      <Galeria.Image>
        <Image source={{ uri: url }} style={styles.avatar} />
      </Galeria.Image>
    </Galeria>
  )
}
```

`expo-image`, `SolitoImage`, `react-native` Image 또는 어떤 이미지 컴포넌트와도 작동합니다.

참고: [Galeria](https://github.com/nandorojo/galeria)
