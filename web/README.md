This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 구현 개요

Agent Skills 목록을 탐색하는 웹 앱입니다. 파일 시스템에 저장된 마크다운 파일을 파싱해 빌드 시 정적 페이지를 생성합니다.

### 페이지 구조

| 경로 | 설명 |
|------|------|
| `/` | 전체 Skills 목록 (3단 그리드) |
| `/skills/[skillSlug]` | Skill 상세 — 규칙 목록 + Impact 필터 |
| `/skills/[skillSlug]/rules/[ruleSlug]` | Rule 상세 — 마크다운 전문 렌더링 |

### 기술 스택

- **Next.js 16** — App Router, `generateStaticParams()` 기반 정적 생성
- **React 19** — 서버/클라이언트 컴포넌트 혼용
- **Tailwind CSS 4** — 유틸리티 스타일링, `@tailwindcss/typography`로 마크다운 prose 처리
- **gray-matter** — Skill/Rule `.md` 파일의 YAML frontmatter 파싱
- **Shiki** — 서버사이드 코드 블록 신택스 하이라이팅 (다크모드 대응)
- **react-markdown + remark-gfm** — GFM 마크다운 렌더링

### 데이터 흐름

```
../skills/                    # 앱 외부 파일
  <skillSlug>/
    SKILL.md                  # name, description, author, version (frontmatter)
    rules/
      <ruleSlug>.md           # title, impact, impactDescription, tags (frontmatter)
                              # + 본문 마크다운
```

`src/lib/skills.ts`가 이 디렉터리를 읽고 파싱해 각 페이지에 데이터를 공급합니다.

### Impact 레벨 시스템

Rules에는 6단계 심각도(Impact)가 부여되며, 색상 코드와 함께 UI 전반에 일관되게 표시됩니다.

| Level | Color |
|-------|-------|
| CRITICAL | Red |
| HIGH | Orange |
| MEDIUM-HIGH | Amber |
| MEDIUM | Yellow |
| LOW-MEDIUM | Lime |
| LOW | Green |

Skill 상세 페이지의 사이드바 필터로 Impact 레벨별 Rules를 토글 필터링할 수 있습니다.

### 주요 컴포넌트

- `SkillCard` — 홈의 Skill 카드 (이름·설명·규칙 수·Impact 분포·작성자)
- `SkillRulesView` — Impact 필터 상태를 관리하는 클라이언트 컴포넌트
- `RuleCard` — Rule 미리보기 카드 (Impact 배지 + 태그)
- `ImpactFilter` — 토글 버튼 + All/None 버튼으로 구성된 필터 사이드바
- `MarkdownRenderer` — Shiki 기반 서버사이드 마크다운 렌더러

---

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
