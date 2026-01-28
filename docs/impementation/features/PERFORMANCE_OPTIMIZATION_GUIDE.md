# 성능 최적화 가이드

## 개요
Next.js 15와 React의 성능 최적화 기능을 활용하여 빠르고 효율적인 애플리케이션을 구현하는 가이드입니다.

## 폰트 최적화

### next/font 사용

#### 1. Google Fonts 최적화
```typescript
// app/layout.tsx
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",        // FOIT/FOUT 방지
  preload: true,          // 우선순위 높은 폰트
  fallback: ["system-ui", "arial"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: false,         // 우선순위 낮은 폰트
});
```

**display 옵션:**
- `swap`: 폴백 폰트 즉시 표시, 웹폰트 로드 후 교체 (권장)
- `optional`: 네트워크 속도에 따라 폴백 사용
- `block`: 짧은 시간 대기 후 웹폰트 표시
- `fallback`: `swap`과 `optional` 중간

#### 2. 로컬 폰트 최적화
```typescript
import localFont from 'next/font/local';

const customFont = localFont({
  src: './fonts/custom-font.woff2',
  variable: '--font-custom',
  display: 'swap',
  weight: '400',
});
```

#### 3. 폰트 서브셋
```typescript
// 영어만 사용
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

// 한글 지원
const notoSansKR = Noto_Sans_KR({
  subsets: ['latin', 'korean'],
  display: 'swap',
});
```

### FOIT/FOUT 방지

#### CSS 폴백
```css
/* globals.css */
@layer base {
  body {
    font-family: var(--font-geist-sans), -apple-system, BlinkMacSystemFont,
      'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans',
      'Droid Sans', 'Helvetica Neue', sans-serif;

    /* 폰트 렌더링 최적화 */
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
  }
}
```

## 이미지 최적화

### next/image 사용

#### 1. 정적 이미지
```typescript
import Image from 'next/image';
import logo from './logo.png';

<Image
  src={logo}
  alt="Logo"
  width={120}
  height={40}
  priority // LCP 이미지는 우선순위
  placeholder="blur" // 자동 블러 생성
/>
```

#### 2. 동적 이미지
```typescript
<Image
  src="/images/hero.jpg"
  alt="Hero"
  width={1200}
  height={600}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  quality={85} // 기본 75
/>
```

#### 3. 반응형 이미지
```typescript
<Image
  src="/profile.jpg"
  alt="Profile"
  width={200}
  height={200}
  sizes="(max-width: 768px) 100px, 200px"
  style={{
    width: '100%',
    height: 'auto',
  }}
/>
```

### 이미지 포맷 최적화

```typescript
// next.config.js
module.exports = {
  images: {
    formats: ['image/avif', 'image/webp'], // 최신 포맷 우선
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
};
```

## 번들 최적화

### 1. 번들 분석

```bash
# 번들 크기 확인
npm run build

# 상세 분석 (플러그인 설치 필요)
npm install -D @next/bundle-analyzer

# next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  // config
});

# 실행
ANALYZE=true npm run build
```

### 2. 동적 임포트

```typescript
// 컴포넌트 지연 로딩
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <p>Loading...</p>,
  ssr: false, // 클라이언트 전용
});

// 라이브러리 지연 로딩
const ConfettiButton = dynamic(
  () => import('./ConfettiButton').then(mod => mod.ConfettiButton),
  { ssr: false }
);
```

### 3. Tree Shaking

```typescript
// ❌ 전체 임포트
import * as icons from 'lucide-react';

// ✅ 필요한 것만 임포트
import { Trash2, CheckCircle2 } from 'lucide-react';

// ❌ 전체 라이브러리
import _ from 'lodash';

// ✅ 개별 함수
import debounce from 'lodash/debounce';
```

## React 최적화

### 1. React.memo

```typescript
// 불필요한 리렌더링 방지
export const TodoItem = memo(function TodoItem({ todo, onToggle, onDelete }) {
  return (
    <div>
      {/* content */}
    </div>
  );
}, (prevProps, nextProps) => {
  // 커스텀 비교 함수
  return (
    prevProps.todo.id === nextProps.todo.id &&
    prevProps.todo.completed === nextProps.todo.completed &&
    prevProps.todo.content === nextProps.todo.content
  );
});
```

### 2. useCallback & useMemo

```typescript
function TodoList({ todos }) {
  // 함수 메모이제이션
  const handleToggle = useCallback((id: string) => {
    setTodos(prev => prev.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  }, []);

  // 계산 결과 메모이제이션
  const filteredTodos = useMemo(() => {
    return todos.filter(todo => !todo.completed);
  }, [todos]);

  return <>{/* content */}</>;
}
```

### 3. 가상화 (Virtualization)

```typescript
// 긴 리스트의 경우
import { Virtuoso } from 'react-virtuoso';

<Virtuoso
  data={todos}
  itemContent={(index, todo) => <TodoItem key={todo.id} todo={todo} />}
  style={{ height: '600px' }}
/>
```

## 애니메이션 최적화

### 1. Framer Motion 최적화

```typescript
// GPU 가속 프로퍼티 사용
<motion.div
  animate={{
    x: 100,        // ✅ GPU 가속
    y: 100,        // ✅ GPU 가속
    scale: 1.2,    // ✅ GPU 가속
    rotate: 45,    // ✅ GPU 가속
    opacity: 0.5,  // ✅ GPU 가속
  }}
/>

// ❌ 레이아웃 프로퍼티는 느림
<motion.div
  animate={{
    width: 200,    // ❌ 레이아웃 재계산
    height: 200,   // ❌ 레이아웃 재계산
    padding: 20,   // ❌ 레이아웃 재계산
  }}
/>
```

### 2. 조건부 애니메이션

```typescript
const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

<motion.div
  animate={prefersReducedMotion ? {} : {
    y: [0, -10, 0],
  }}
  transition={{
    duration: prefersReducedMotion ? 0 : 0.5,
  }}
/>
```

### 3. 레이아웃 애니메이션 최적화

```typescript
// layoutId로 공유 레이아웃 최적화
<motion.div layoutId="shared-element">
  Content
</motion.div>

// will-change 힌트
<motion.div
  style={{ willChange: 'transform' }}
  animate={{ x: 100 }}
/>
```

## 데이터 최적화

### 1. LocalStorage 최적화

```typescript
// 디바운스로 저장 빈도 줄이기
import { debounce } from 'lodash';

const debouncedSave = useCallback(
  debounce((todos: Todo[]) => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, 500),
  []
);

useEffect(() => {
  debouncedSave(todos);
}, [todos, debouncedSave]);
```

### 2. 데이터 압축

```typescript
// LZ-string 사용
import LZString from 'lz-string';

// 저장
const compressed = LZString.compress(JSON.stringify(todos));
localStorage.setItem('todos', compressed);

// 불러오기
const compressed = localStorage.getItem('todos');
const todos = JSON.parse(LZString.decompress(compressed));
```

## 메타데이터 최적화

### SEO 및 성능
```typescript
// app/layout.tsx
export const metadata: Metadata = {
  title: "Premium Todo - 프리미엄 할 일 관리",
  description: "빠르고 아름다운 할 일 관리 애플리케이션",
  keywords: ["todo", "productivity", "next.js"],

  // Open Graph
  openGraph: {
    title: "Premium Todo",
    description: "프리미엄 할 일 관리 앱",
    images: ['/og-image.jpg'],
  },

  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: "Premium Todo",
    description: "프리미엄 할 일 관리 앱",
    images: ['/twitter-image.jpg'],
  },

  // Viewport
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },

  // Theme Color
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
};
```

## 성능 측정

### Lighthouse 점수 목표
- **Performance**: 90+
- **Accessibility**: 90+
- **Best Practices**: 90+
- **SEO**: 90+

### Core Web Vitals
- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1

### 측정 도구

#### 1. Chrome DevTools
```
F12 → Lighthouse
- 성능 점수 확인
- 개선 권장사항 확인
```

#### 2. Web Vitals 라이브러리
```bash
npm install web-vitals

# _app.tsx 또는 layout.tsx
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric) {
  console.log(metric);
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

#### 3. Next.js 빌드 분석
```bash
npm run build

# 결과 예시
Route (app)                              Size     First Load JS
┌ ○ /                                    5.2 kB         95 kB
└ ○ /_not-found                          871 B          85 kB
```

## 체크리스트

### 폰트 최적화
- [x] next/font 사용
- [x] display: swap 설정
- [x] 서브셋 지정
- [x] 폴백 폰트 설정
- [x] 폰트 프리로드

### 이미지 최적화
- [x] next/image 사용
- [x] 적절한 크기 지정
- [x] 반응형 sizes 속성
- [x] priority 플래그 (LCP)
- [x] 최신 포맷 (AVIF, WebP)

### 번들 최적화
- [x] Tree shaking
- [x] 동적 임포트
- [x] 코드 분할
- [x] 불필요한 의존성 제거

### React 최적화
- [x] React.memo 사용
- [x] useCallback/useMemo 활용
- [x] 불필요한 리렌더링 방지

### 애니메이션 최적화
- [x] GPU 가속 프로퍼티
- [x] will-change 힌트
- [x] 조건부 애니메이션

## 참고 자료

- [Next.js 최적화 가이드](https://nextjs.org/docs/app/building-your-application/optimizing)
- [Web.dev Performance](https://web.dev/performance/)
- [React 성능 최적화](https://react.dev/learn/render-and-commit)
- [Framer Motion Performance](https://www.framer.com/motion/guide-reduce-bundle-size/)
