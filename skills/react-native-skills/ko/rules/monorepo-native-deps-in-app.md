---
title: 앱 디렉토리에 네이티브 의존성 설치
impact: CRITICAL
impactDescription: 자동 링킹 작동에 필수
tags: monorepo, native, autolinking, installation
---

## 앱 디렉토리에 네이티브 의존성 설치

모노레포에서 네이티브 코드가 있는 패키지는 네이티브 앱의 디렉토리에 직접 설치해야 합니다.
자동 링킹은 앱의 `node_modules`만 스캔하므로 다른 패키지에 설치된 네이티브 의존성을 찾지 못합니다.

**잘못된 예시 (공유 패키지에만 네이티브 의존성):**

```
packages/
  ui/
    package.json  # react-native-reanimated 있음
  app/
    package.json  # react-native-reanimated 없음
```

자동 링킹 실패 — 네이티브 코드가 링크되지 않음.

**올바른 예시 (앱 디렉토리에 네이티브 의존성):**

```
packages/
  ui/
    package.json  # react-native-reanimated 있음
  app/
    package.json  # react-native-reanimated도 있음
```

```json
// packages/app/package.json
{
  "dependencies": {
    "react-native-reanimated": "3.16.1"
  }
}
```

공유 패키지가 네이티브 의존성을 사용하더라도, 앱이 자동 링킹으로 네이티브 코드를 감지하고 링크하려면
앱도 해당 의존성을 나열해야 합니다.
