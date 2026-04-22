---
title: 모노레포 전체에 단일 의존성 버전 사용
impact: MEDIUM
impactDescription: 중복 번들 방지, 버전 충돌 방지
tags: monorepo, dependencies, installation
---

## 모노레포 전체에 단일 의존성 버전 사용

모노레포의 모든 패키지에서 각 의존성의 단일 버전을 사용하세요.
범위보다 정확한 버전을 선호하세요. 여러 버전은 번들에서 코드 중복, 런타임 충돌,
패키지 간 일관성 없는 동작을 유발합니다.

이를 강제하려면 syncpack 같은 도구를 사용하세요.
최후 수단으로 yarn resolutions나 npm overrides를 사용하세요.

**잘못된 예시 (버전 범위, 여러 버전):**

```json
// packages/app/package.json
{
  "dependencies": {
    "react-native-reanimated": "^3.0.0"
  }
}

// packages/ui/package.json
{
  "dependencies": {
    "react-native-reanimated": "^3.5.0"
  }
}
```

**올바른 예시 (정확한 버전, 단일 진실의 원천):**

```json
// package.json (루트)
{
  "pnpm": {
    "overrides": {
      "react-native-reanimated": "3.16.1"
    }
  }
}

// packages/app/package.json
{
  "dependencies": {
    "react-native-reanimated": "3.16.1"
  }
}

// packages/ui/package.json
{
  "dependencies": {
    "react-native-reanimated": "3.16.1"
  }
}
```

루트에서 패키지 매니저의 override/resolution 기능을 사용해 버전을 강제하세요.
의존성을 추가할 때 `^`나 `~` 없이 정확한 버전을 지정하세요.
