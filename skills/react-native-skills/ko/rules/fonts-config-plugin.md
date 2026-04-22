---
title: 빌드 시 네이티브로 폰트 로드
impact: LOW
impactDescription: 실행 시 폰트 바로 사용 가능, 비동기 로딩 없음
tags: fonts, expo, performance, config-plugin
---

## 폰트 로딩에 Expo Config Plugin 사용

`useFonts`나 `Font.loadAsync` 대신 `expo-font` config plugin을 사용해 빌드 시 폰트를 임베드하세요.
임베드된 폰트가 더 효율적입니다.

**잘못된 예시 (비동기 폰트 로딩):**

```tsx
import { useFonts } from 'expo-font'
import { Text, View } from 'react-native'

function App() {
  const [fontsLoaded] = useFonts({
    'Geist-Bold': require('./assets/fonts/Geist-Bold.otf'),
  })

  if (!fontsLoaded) {
    return null
  }

  return (
    <View>
      <Text style={{ fontFamily: 'Geist-Bold' }}>안녕하세요</Text>
    </View>
  )
}
```

**올바른 예시 (config plugin, 빌드 시 폰트 임베드):**

```json
// app.json
{
  "expo": {
    "plugins": [
      [
        "expo-font",
        {
          "fonts": ["./assets/fonts/Geist-Bold.otf"]
        }
      ]
    ]
  }
}
```

```tsx
import { Text, View } from 'react-native'

function App() {
  // 로딩 상태 불필요 — 폰트가 이미 사용 가능
  return (
    <View>
      <Text style={{ fontFamily: 'Geist-Bold' }}>안녕하세요</Text>
    </View>
  )
}
```

config plugin에 폰트를 추가한 후 `npx expo prebuild`를 실행하고 네이티브 앱을 다시 빌드하세요.

참고: [Expo Font 문서](https://docs.expo.dev/versions/latest/sdk/font/)
