---
title: 깜빡임 없이 하이드레이션 불일치 방지
impact: MEDIUM
impactDescription: 시각적 깜빡임 및 하이드레이션 오류 방지
tags: rendering, ssr, hydration, localStorage, flicker
---

## 깜빡임 없이 하이드레이션 불일치 방지

클라이언트 사이드 저장소(localStorage, 쿠키)에 의존하는 콘텐츠를 렌더링할 때, React가 하이드레이션하기 전에 DOM을 업데이트하는 동기 스크립트를 주입하여 SSR 오류와 하이드레이션 후 깜빡임을 모두 방지하세요.

**잘못된 예 (SSR 깨짐):**

```tsx
function ThemeWrapper({ children }: { children: ReactNode }) {
  // localStorage가 서버에서 사용 불가 - 오류 발생
  const theme = localStorage.getItem('theme') || 'light'
  
  return (
    <div className={theme}>
      {children}
    </div>
  )
}
```

`localStorage`가 정의되지 않아 서버 사이드 렌더링이 실패합니다.

**잘못된 예 (시각적 깜빡임):**

```tsx
function ThemeWrapper({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState('light')
  
  useEffect(() => {
    // 하이드레이션 후 실행 - 눈에 띄는 깜빡임 발생
    const stored = localStorage.getItem('theme')
    if (stored) {
      setTheme(stored)
    }
  }, [])
  
  return (
    <div className={theme}>
      {children}
    </div>
  )
}
```

컴포넌트가 기본값(`light`)으로 먼저 렌더링되고 하이드레이션 후 업데이트되어 잘못된 콘텐츠의 눈에 띄는 깜빡임이 발생합니다.

**올바른 예 (깜빡임 없음, 하이드레이션 불일치 없음):**

```tsx
function ThemeWrapper({ children }: { children: ReactNode }) {
  return (
    <>
      <div id="theme-wrapper">
        {children}
      </div>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              try {
                var theme = localStorage.getItem('theme') || 'light';
                var el = document.getElementById('theme-wrapper');
                if (el) el.className = theme;
              } catch (e) {}
            })();
          `,
        }}
      />
    </>
  )
}
```

인라인 스크립트가 요소를 표시하기 전에 동기적으로 실행되어 DOM이 이미 올바른 값을 가집니다. 깜빡임 없음, 하이드레이션 불일치 없음.

이 패턴은 테마 전환, 사용자 설정, 인증 상태, 기본값 깜빡임 없이 즉시 렌더링되어야 하는 모든 클라이언트 전용 데이터에 특히 유용합니다.
