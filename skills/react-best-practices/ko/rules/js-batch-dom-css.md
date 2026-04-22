---
title: 레이아웃 스래싱 방지
impact: MEDIUM
impactDescription: 강제 동기 레이아웃 방지 및 성능 병목 감소
tags: javascript, dom, css, performance, reflow, layout-thrashing
---

## 레이아웃 스래싱 방지

스타일 쓰기와 레이아웃 읽기를 교차하지 마세요. 스타일 변경 사이에 레이아웃 프로퍼티(`offsetWidth`, `getBoundingClientRect()`, `getComputedStyle()` 등)를 읽으면 브라우저가 동기 리플로우를 강제로 트리거합니다.

**괜찮은 예 (브라우저가 스타일 변경을 일괄 처리):**
```typescript
function updateElementStyles(element: HTMLElement) {
  // 각 줄이 스타일을 무효화하지만 브라우저가 재계산을 일괄 처리
  element.style.width = '100px'
  element.style.height = '200px'
  element.style.backgroundColor = 'blue'
  element.style.border = '1px solid black'
}
```

**잘못된 예 (읽기와 쓰기가 교차되어 리플로우 강제):**
```typescript
function layoutThrashing(element: HTMLElement) {
  element.style.width = '100px'
  const width = element.offsetWidth  // 리플로우 강제
  element.style.height = '200px'
  const height = element.offsetHeight  // 또 다른 리플로우 강제
}
```

**올바른 예 (쓰기 일괄 처리 후 한 번 읽기):**
```typescript
function updateElementStyles(element: HTMLElement) {
  // 모든 쓰기를 함께 일괄 처리
  element.style.width = '100px'
  element.style.height = '200px'
  element.style.backgroundColor = 'blue'
  element.style.border = '1px solid black'
  
  // 모든 쓰기가 완료된 후 읽기 (단일 리플로우)
  const { width, height } = element.getBoundingClientRect()
}
```

**더 나은 방법: CSS 클래스 사용:**
```css
.highlighted-box {
  width: 100px;
  height: 200px;
  background-color: blue;
  border: 1px solid black;
}
```
```typescript
function updateElementStyles(element: HTMLElement) {
  element.classList.add('highlighted-box')
  
  const { width, height } = element.getBoundingClientRect()
}
```

가능하면 인라인 스타일보다 CSS 클래스를 선호하세요. CSS 파일은 브라우저에서 캐시되고 클래스는 더 나은 관심사 분리를 제공합니다.
