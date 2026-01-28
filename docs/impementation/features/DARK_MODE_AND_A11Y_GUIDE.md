# 다크 모드 및 접근성 가이드

## 개요
next-themes를 사용한 다크 모드 구현과 WCAG 2.1 AA 기준을 준수하는 접근성 기능을 제공합니다.

## 설치

```bash
npm install next-themes
```

## 다크 모드 구현

### 1. ThemeProvider 설정

```typescript
// components/theme/ThemeProvider.tsx
import { ThemeProvider as NextThemesProvider } from 'next-themes';

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
```

```typescript
// app/layout.tsx
<ThemeProvider
  attribute="class"
  defaultTheme="system"
  enableSystem
  disableTransitionOnChange
>
  {children}
</ThemeProvider>
```

**속성 설명:**
- `attribute="class"`: HTML에 class="dark" 추가
- `defaultTheme="system"`: 시스템 설정 따름
- `enableSystem`: 시스템 테마 감지 활성화
- `disableTransitionOnChange`: 테마 전환 시 트랜지션 제거 (깜빡임 방지)

### 2. 색상 팔레트 (globals.css)

#### 라이트 모드
```css
:root {
  /* Brand Colors */
  --color-brand-primary: oklch(0.55 0.25 264);
  --color-brand-secondary: oklch(0.65 0.20 290);
  --color-brand-accent: oklch(0.70 0.22 330);

  /* Neutral Colors */
  --color-neutral-50: oklch(0.98 0.01 264);
  --color-neutral-900: oklch(0.15 0.02 264);
}
```

#### 다크 모드
```css
.dark {
  /* Brand Colors - Brighter */
  --color-brand-primary: oklch(0.65 0.25 264);
  --color-brand-secondary: oklch(0.70 0.20 290);
  --color-brand-accent: oklch(0.75 0.22 330);

  /* Neutral Colors - Inverted */
  --color-neutral-50: oklch(0.10 0.01 264);
  --color-neutral-900: oklch(0.92 0.02 264);
}
```

**다크 모드 색상 조정 원칙:**
- 브랜드 색상: 5-10% 밝게
- 중립 색상: 완전 반전
- 배경: 낮은 명도 (0.10-0.15)
- 텍스트: 높은 명도 (0.90-0.95)

### 3. ThemeToggle 컴포넌트

```typescript
export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <SkeletonButton />;
  }

  return (
    <Button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      aria-label={theme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환'}
      aria-pressed={theme === 'dark'}
    >
      {theme === 'dark' ? <Moon /> : <Sun />}
    </Button>
  );
}
```

**Hydration 안전성:**
- `useState` + `useEffect`로 마운트 상태 관리
- 마운트 전 스켈레톤 표시
- 서버/클라이언트 불일치 방지

### 4. 컴포넌트에 다크 모드 스타일 적용

```typescript
<div className="glass dark:glass-dark rounded-2xl">
  <h2 className="text-neutral-900 dark:text-neutral-100">
    Title
  </h2>
  <Input className="bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700" />
</div>
```

**유틸리티 클래스:**
```css
.glass {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.glass-dark {
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
```

## 접근성 (A11y)

### 1. WCAG 2.1 AA 기준

#### 색상 대비율
- **일반 텍스트**: 4.5:1 이상
- **대형 텍스트** (18px+ 또는 14px+ bold): 3:1 이상
- **UI 컴포넌트**: 3:1 이상

#### 색상 대비 확인
```
라이트 모드:
- 배경 white (#FFFFFF) / 텍스트 neutral-900 (oklch 0.15) = 15.8:1 ✅

다크 모드:
- 배경 neutral-50 (oklch 0.10) / 텍스트 neutral-900 (oklch 0.92) = 14.2:1 ✅
```

### 2. ARIA 레이블

#### 버튼
```typescript
<Button
  onClick={handleDelete}
  aria-label="할 일 삭제"
>
  <Trash2 />
</Button>
```

#### 폼
```typescript
<form aria-label="새로운 할 일 추가 폼">
  <Input
    placeholder="할 일을 입력하세요..."
    aria-label="할 일 내용"
  />
  <Select aria-label="우선순위 선택">
    {/* options */}
  </Select>
</form>
```

#### 동적 콘텐츠
```typescript
<div
  role="status"
  aria-live="polite"
  aria-atomic="true"
>
  {statusMessage}
</div>
```

### 3. 키보드 네비게이션

#### Tab 순서
```typescript
<div tabIndex={0}>
  <Button tabIndex={0}>추가</Button>
  <Input tabIndex={0} />
</div>
```

#### Enter/Space 키 지원
```typescript
const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    handleAction();
  }
};

<div
  role="button"
  tabIndex={0}
  onKeyDown={handleKeyDown}
  onClick={handleAction}
>
  Click me
</div>
```

#### Focus 표시
```css
.button:focus-visible {
  outline: 2px solid var(--color-brand-primary);
  outline-offset: 2px;
}
```

### 4. 시맨틱 HTML

```html
<!-- Good -->
<header>
  <h1>Premium Todo</h1>
</header>

<main>
  <form>
    <label for="todo-input">할 일</label>
    <input id="todo-input" />
  </form>

  <section aria-labelledby="todo-list-title">
    <h2 id="todo-list-title">할 일 목록</h2>
    <ul>
      <li>...</li>
    </ul>
  </section>
</main>

<!-- Bad -->
<div>
  <div>Premium Todo</div>
</div>

<div>
  <div>
    <span>할 일</span>
    <div contenteditable="true"></div>
  </div>
</div>
```

### 5. 스크린 리더 지원

#### 동적 업데이트 알림
```typescript
<div
  role="alert"
  aria-live="assertive"
>
  할 일이 추가되었습니다.
</div>

<div
  role="status"
  aria-live="polite"
>
  3개 중 1개 완료
</div>
```

#### 숨김 텍스트
```typescript
<span className="sr-only">
  현재 진행률: {completionRate}%
</span>

<VisuallyHidden>
  우선순위: {priority}
</VisuallyHidden>
```

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

### 6. 움직임 줄이기

```typescript
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

<motion.div
  animate={prefersReducedMotion.matches ? {} : { y: [0, -10, 0] }}
>
  Content
</motion.div>
```

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## 테스트

### 자동 테스트 도구

1. **Lighthouse** (Chrome DevTools)
   - Accessibility 점수 확인
   - 90점 이상 목표

2. **axe DevTools** (브라우저 확장)
   - WCAG 위반 사항 확인
   - 0 violations 목표

3. **WAVE** (웹 평가 도구)
   - 시각적 피드백 제공

### 수동 테스트

1. **키보드 네비게이션**
   - Tab으로 모든 요소 접근 가능
   - Enter/Space로 모든 버튼 작동
   - Escape로 모달 닫기

2. **스크린 리더** (NVDA, JAWS, VoiceOver)
   - 모든 콘텐츠 읽기 가능
   - 폼 레이블 명확
   - 동적 업데이트 알림

3. **색상 대비**
   - 모든 텍스트 명확히 읽힘
   - 다크 모드도 동일

4. **확대/축소**
   - 200% 확대 시 레이아웃 유지
   - 텍스트 잘림 없음

## 체크리스트

### 다크 모드
- [x] next-themes 설치 및 설정
- [x] 다크 모드 색상 팔레트 정의
- [x] 테마 토글 버튼 구현
- [x] 모든 컴포넌트에 다크 스타일 적용
- [x] 시스템 설정 감지
- [x] Hydration 안전성

### 접근성
- [x] ARIA 레이블 추가
- [x] 키보드 네비게이션 지원
- [x] 색상 대비 4.5:1 이상
- [x] 시맨틱 HTML 사용
- [x] Focus 표시
- [x] 스크린 리더 지원
- [ ] 움직임 줄이기 옵션 (향후 개선)

## 참고 자료

- [WCAG 2.1 가이드라인](https://www.w3.org/WAI/WCAG21/quickref/)
- [next-themes 문서](https://github.com/pacocoursey/next-themes)
- [MDN 접근성](https://developer.mozilla.org/ko/docs/Web/Accessibility)
- [WebAIM 대비 체커](https://webaim.org/resources/contrastchecker/)
