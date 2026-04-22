---
title: 디자인 시스템 폴더에서 가져오기
impact: LOW
impactDescription: 전역 변경 및 쉬운 리팩토링 가능
tags: imports, architecture, design-system
---

## 디자인 시스템 폴더에서 가져오기

의존성을 디자인 시스템 폴더에서 재내보내기하세요.
앱 코드는 패키지에서 직접 가져오는 대신 그곳에서 가져옵니다.
이렇게 하면 전역 변경과 쉬운 리팩토링이 가능합니다.

**잘못된 예시 (패키지에서 직접 가져오기):**

```tsx
import { View, Text } from 'react-native'
import { Button } from '@ui/button'

function Profile() {
  return (
    <View>
      <Text>안녕하세요</Text>
      <Button>저장</Button>
    </View>
  )
}
```

**올바른 예시 (디자인 시스템에서 가져오기):**

```tsx
// components/view.tsx
import { View as RNView } from 'react-native'

// 실제로 사용할 props만 선택해 구현을 제어하는 것이 이상적
export function View(
  props: Pick<React.ComponentProps<typeof RNView>, 'style' | 'children'>
) {
  return <RNView {...props} />
}
```

```tsx
// components/text.tsx
export { Text } from 'react-native'
```

```tsx
// components/button.tsx
export { Button } from '@ui/button'
```

```tsx
import { View } from '@/components/view'
import { Text } from '@/components/text'
import { Button } from '@/components/button'

function Profile() {
  return (
    <View>
      <Text>안녕하세요</Text>
      <Button>저장</Button>
    </View>
  )
}
```

단순 재내보내기부터 시작하세요. 앱 코드 변경 없이 나중에 커스터마이징할 수 있습니다.
