---
title: 네비게이션에 네이티브 네비게이터 사용
impact: HIGH
impactDescription: 네이티브 성능, 플랫폼에 적합한 UI
tags: navigation, react-navigation, expo-router, native-stack, tabs
---

## 네비게이션에 네이티브 네비게이터 사용

항상 JS 기반 네비게이터 대신 네이티브 네비게이터를 사용하세요.
네이티브 네비게이터는 플랫폼 API(iOS의 UINavigationController, Android의 Fragment)를 사용해
더 나은 성능과 네이티브 동작을 제공합니다.

**스택:** `@react-navigation/native-stack` 또는 expo-router의 기본 스택(native-stack 사용)을 사용하세요.
`@react-navigation/stack`은 피하세요.

**탭:** 네이티브 느낌이 중요할 때는 `react-native-bottom-tabs`(네이티브) 또는 expo-router의 네이티브 탭을 사용하세요.
`@react-navigation/bottom-tabs`는 피하세요.

### 스택 네비게이션

**잘못된 예시 (JS 스택 네비게이터):**

```tsx
import { createStackNavigator } from '@react-navigation/stack'

const Stack = createStackNavigator()

function App() {
  return (
    <Stack.Navigator>
      <Stack.Screen name='Home' component={HomeScreen} />
      <Stack.Screen name='Details' component={DetailsScreen} />
    </Stack.Navigator>
  )
}
```

**올바른 예시 (react-navigation으로 네이티브 스택):**

```tsx
import { createNativeStackNavigator } from '@react-navigation/native-stack'

const Stack = createNativeStackNavigator()

function App() {
  return (
    <Stack.Navigator>
      <Stack.Screen name='Home' component={HomeScreen} />
      <Stack.Screen name='Details' component={DetailsScreen} />
    </Stack.Navigator>
  )
}
```

**올바른 예시 (expo-router는 기본적으로 네이티브 스택 사용):**

```tsx
// app/_layout.tsx
import { Stack } from 'expo-router'

export default function Layout() {
  return <Stack />
}
```

### 탭 네비게이션

**잘못된 예시 (JS 하단 탭):**

```tsx
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

const Tab = createBottomTabNavigator()

function App() {
  return (
    <Tab.Navigator>
      <Tab.Screen name='Home' component={HomeScreen} />
      <Tab.Screen name='Settings' component={SettingsScreen} />
    </Tab.Navigator>
  )
}
```

**올바른 예시 (react-navigation으로 네이티브 하단 탭):**

```tsx
import { createNativeBottomTabNavigator } from '@bottom-tabs/react-navigation'

const Tab = createNativeBottomTabNavigator()

function App() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name='Home'
        component={HomeScreen}
        options={{
          tabBarIcon: () => ({ sfSymbol: 'house' }),
        }}
      />
      <Tab.Screen
        name='Settings'
        component={SettingsScreen}
        options={{
          tabBarIcon: () => ({ sfSymbol: 'gear' }),
        }}
      />
    </Tab.Navigator>
  )
}
```

### 네이티브 네비게이터를 사용해야 하는 이유

- **성능**: 네이티브 전환과 제스처가 UI 스레드에서 실행
- **플랫폼 동작**: iOS 큰 제목 자동 적용, Android material design
- **시스템 통합**: 탭 탭으로 맨 위로 스크롤, PiP 회피, 올바른 안전 영역
- **접근성**: 플랫폼 접근성 기능이 자동으로 작동
