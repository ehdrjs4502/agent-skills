---
title: 안전 영역에 contentInsetAdjustmentBehavior 사용
impact: MEDIUM
impactDescription: 네이티브 안전 영역 처리, 레이아웃 이동 없음
tags: safe-area, scrollview, layout
---

## 안전 영역에 contentInsetAdjustmentBehavior 사용

SafeAreaView로 내용을 감싸거나 수동으로 패딩을 추가하는 대신,
루트 ScrollView에 `contentInsetAdjustmentBehavior="automatic"`을 사용하세요.
iOS가 안전 영역 인셋을 적절한 스크롤 동작으로 네이티브하게 처리하게 합니다.

**잘못된 예시 (SafeAreaView 래퍼):**

```tsx
import { SafeAreaView, ScrollView, View, Text } from 'react-native'

function MyScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <View>
          <Text>내용</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
```

**잘못된 예시 (수동 안전 영역 패딩):**

```tsx
import { ScrollView, View, Text } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

function MyScreen() {
  const insets = useSafeAreaInsets()

  return (
    <ScrollView contentContainerStyle={{ paddingTop: insets.top }}>
      <View>
        <Text>내용</Text>
      </View>
    </ScrollView>
  )
}
```

**올바른 예시 (네이티브 콘텐츠 인셋 조정):**

```tsx
import { ScrollView, View, Text } from 'react-native'

function MyScreen() {
  return (
    <ScrollView contentInsetAdjustmentBehavior='automatic'>
      <View>
        <Text>내용</Text>
      </View>
    </ScrollView>
  )
}
```

네이티브 방식은 동적 안전 영역(키보드, 툴바)을 처리하고
콘텐츠가 상태 바 뒤로 자연스럽게 스크롤되게 합니다.
