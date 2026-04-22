---
title: JS 기반 바텀 시트보다 네이티브 모달 사용
impact: HIGH
impactDescription: 네이티브 성능, 제스처, 접근성
tags: modals, bottom-sheet, native, react-navigation
---

## JS 기반 바텀 시트보다 네이티브 모달 사용

JS 기반 바텀 시트 라이브러리 대신 `presentationStyle="formSheet"`가 있는 네이티브 `<Modal>` 또는
React Navigation v7의 네이티브 form sheet를 사용하세요.
네이티브 모달은 내장 제스처, 접근성, 더 나은 성능을 갖습니다.
저수준 기본 요소에는 네이티브 UI를 활용하세요.

**잘못된 예시 (JS 기반 바텀 시트):**

```tsx
import BottomSheet from 'custom-js-bottom-sheet'

function MyScreen() {
  const sheetRef = useRef<BottomSheet>(null)

  return (
    <View style={{ flex: 1 }}>
      <Button onPress={() => sheetRef.current?.expand()} title='열기' />
      <BottomSheet ref={sheetRef} snapPoints={['50%', '90%']}>
        <View>
          <Text>시트 내용</Text>
        </View>
      </BottomSheet>
    </View>
  )
}
```

**올바른 예시 (formSheet가 있는 네이티브 Modal):**

```tsx
import { Modal, View, Text, Button } from 'react-native'

function MyScreen() {
  const [visible, setVisible] = useState(false)

  return (
    <View style={{ flex: 1 }}>
      <Button onPress={() => setVisible(true)} title='열기' />
      <Modal
        visible={visible}
        presentationStyle='formSheet'
        animationType='slide'
        onRequestClose={() => setVisible(false)}
      >
        <View>
          <Text>시트 내용</Text>
        </View>
      </Modal>
    </View>
  )
}
```

**올바른 예시 (React Navigation v7 네이티브 form sheet):**

```tsx
// 네비게이터에서
<Stack.Screen
  name='Details'
  component={DetailsScreen}
  options={{
    presentation: 'formSheet',
    sheetAllowedDetents: 'fitToContents',
  }}
/>
```

네이티브 모달은 스와이프로 닫기, 올바른 키보드 회피, 접근성을 기본으로 제공합니다.
