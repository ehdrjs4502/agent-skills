---
title: 드롭다운과 컨텍스트 메뉴에 네이티브 메뉴 사용
impact: HIGH
impactDescription: 네이티브 접근성, 플랫폼 일관성 UX
tags: user-interface, menus, context-menus, zeego, accessibility
---

## 드롭다운과 컨텍스트 메뉴에 네이티브 메뉴 사용

커스텀 JS 구현 대신 네이티브 플랫폼 메뉴를 사용하세요.
네이티브 메뉴는 내장 접근성, 플랫폼 일관성 UX, 더 나은 성능을 제공합니다.
크로스 플랫폼 네이티브 메뉴에는 [zeego](https://zeego.dev)를 사용하세요.

**잘못된 예시 (커스텀 JS 메뉴):**

```tsx
import { useState } from 'react'
import { View, Pressable, Text } from 'react-native'

function MyMenu() {
  const [open, setOpen] = useState(false)

  return (
    <View>
      <Pressable onPress={() => setOpen(!open)}>
        <Text>메뉴 열기</Text>
      </Pressable>
      {open && (
        <View style={{ position: 'absolute', top: 40 }}>
          <Pressable onPress={() => console.log('edit')}>
            <Text>편집</Text>
          </Pressable>
          <Pressable onPress={() => console.log('delete')}>
            <Text>삭제</Text>
          </Pressable>
        </View>
      )}
    </View>
  )
}
```

**올바른 예시 (zeego로 네이티브 메뉴):**

```tsx
import * as DropdownMenu from 'zeego/dropdown-menu'

function MyMenu() {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Pressable>
          <Text>메뉴 열기</Text>
        </Pressable>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content>
        <DropdownMenu.Item key='edit' onSelect={() => console.log('edit')}>
          <DropdownMenu.ItemTitle>편집</DropdownMenu.ItemTitle>
        </DropdownMenu.Item>

        <DropdownMenu.Item
          key='delete'
          destructive
          onSelect={() => console.log('delete')}
        >
          <DropdownMenu.ItemTitle>삭제</DropdownMenu.ItemTitle>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}
```

**컨텍스트 메뉴 (길게 누르기):**

```tsx
import * as ContextMenu from 'zeego/context-menu'

function MyContextMenu() {
  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger>
        <View style={{ padding: 20 }}>
          <Text>길게 누르세요</Text>
        </View>
      </ContextMenu.Trigger>

      <ContextMenu.Content>
        <ContextMenu.Item key='copy' onSelect={() => console.log('copy')}>
          <ContextMenu.ItemTitle>복사</ContextMenu.ItemTitle>
        </ContextMenu.Item>

        <ContextMenu.Item key='paste' onSelect={() => console.log('paste')}>
          <ContextMenu.ItemTitle>붙여넣기</ContextMenu.ItemTitle>
        </ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu.Root>
  )
}
```

참고: [Zeego 문서](https://zeego.dev/components/dropdown-menu)
