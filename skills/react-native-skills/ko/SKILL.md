---
name: vercel-react-native-skills
description:
  성능 높은 모바일 앱을 만들기 위한 React Native 및 Expo 모범 사례. React Native 컴포넌트 구축,
  목록 성능 최적화, 애니메이션 구현, 네이티브 모듈 작업 시 활용합니다.
  React Native, Expo, 모바일 성능, 네이티브 플랫폼 API 관련 작업에 적용합니다.
license: MIT
metadata:
  author: vercel
  version: '1.0.0'
---

# React Native 스킬

React Native 및 Expo 애플리케이션을 위한 종합 모범 사례입니다.
성능, 애니메이션, UI 패턴, 플랫폼별 최적화를 다루는 여러 카테고리의 규칙을 포함합니다.

## 적용 시점

다음 경우에 이 가이드라인을 참고하세요:

- React Native 또는 Expo 앱 구축 시
- 목록 및 스크롤 성능 최적화 시
- Reanimated로 애니메이션 구현 시
- 이미지 및 미디어 처리 시
- 네이티브 모듈 또는 폰트 설정 시
- 네이티브 의존성이 있는 모노레포 프로젝트 구조화 시

## 우선순위별 규칙 카테고리

| 우선순위 | 카테고리        | 영향도   | 접두사               |
| -------- | --------------- | -------- | -------------------- |
| 1        | 목록 성능       | CRITICAL | `list-performance-`  |
| 2        | 애니메이션      | HIGH     | `animation-`         |
| 3        | 네비게이션      | HIGH     | `navigation-`        |
| 4        | UI 패턴         | HIGH     | `ui-`                |
| 5        | 상태 관리       | MEDIUM   | `react-state-`       |
| 6        | 렌더링          | MEDIUM   | `rendering-`         |
| 7        | 모노레포        | MEDIUM   | `monorepo-`          |
| 8        | 설정            | LOW      | `fonts-`, `imports-` |

## 빠른 참조

### 1. 목록 성능 (CRITICAL)

- `list-performance-virtualize` - 모든 목록에 가상화 라이브러리 사용
- `list-performance-item-memo` - 목록 아이템 컴포넌트 메모이제이션
- `list-performance-callbacks` - 콜백 참조 안정화
- `list-performance-inline-objects` - renderItem에 인라인 스타일 객체 금지
- `list-performance-function-references` - 렌더 외부에서 함수 추출
- `list-performance-images` - 목록에서 이미지 최적화
- `list-performance-item-expensive` - 아이템 외부에서 비용이 큰 작업 이동
- `list-performance-item-types` - 이종 목록에 아이템 타입 사용

### 2. 애니메이션 (HIGH)

- `animation-gpu-properties` - transform과 opacity만 애니메이션
- `animation-derived-value` - 계산된 애니메이션에 useDerivedValue 사용
- `animation-gesture-detector-press` - Pressable 대신 Gesture.Tap 사용

### 3. 네비게이션 (HIGH)

- `navigation-native-navigators` - JS 네비게이터보다 네이티브 스택/탭 사용

### 4. UI 패턴 (HIGH)

- `ui-expo-image` - 모든 이미지에 expo-image 사용
- `ui-image-gallery` - 이미지 라이트박스에 Galeria 사용
- `ui-pressable` - TouchableOpacity 대신 Pressable 사용
- `ui-safe-area-scroll` - ScrollView에서 안전 영역 처리
- `ui-scrollview-content-inset` - 헤더에 contentInset 사용
- `ui-menus` - 네이티브 컨텍스트 메뉴 사용
- `ui-native-modals` - 가능하면 네이티브 모달 사용
- `ui-measure-views` - measure() 대신 onLayout 사용
- `ui-styling` - StyleSheet.create 또는 Nativewind 사용

### 5. 상태 관리 (MEDIUM)

- `react-state-minimize` - 상태 구독 최소화
- `react-state-dispatcher` - 콜백에 dispatcher 패턴 사용
- `react-state-fallback` - 첫 렌더에서 fallback 표시
- `react-compiler-destructure-functions` - React Compiler를 위한 구조 분해
- `react-compiler-reanimated-shared-values` - 컴파일러와 shared values 처리

### 6. 렌더링 (MEDIUM)

- `rendering-text-in-text-component` - 텍스트를 Text 컴포넌트로 감싸기
- `rendering-no-falsy-and` - 조건부 렌더링에 falsy && 금지

### 7. 모노레포 (MEDIUM)

- `monorepo-native-deps-in-app` - 네이티브 의존성을 앱 패키지에 설치
- `monorepo-single-dependency-versions` - 패키지 전체에 단일 버전 사용

### 8. 설정 (LOW)

- `fonts-config-plugin` - 커스텀 폰트에 config plugin 사용
- `imports-design-system-folder` - 디자인 시스템 imports 구성
- `js-hoist-intl` - Intl 객체 생성 호이스팅

## 사용 방법

개별 규칙 파일에서 자세한 설명과 코드 예시를 읽으세요:

```
rules/list-performance-virtualize.md
rules/animation-gpu-properties.md
```

각 규칙 파일에 포함된 내용:

- 해당 규칙이 중요한 이유 설명
- 잘못된 코드 예시와 설명
- 올바른 코드 예시와 설명
- 추가 컨텍스트 및 참고 자료

## 전체 컴파일 문서

모든 규칙이 확장된 완전한 가이드: `AGENTS.md`
