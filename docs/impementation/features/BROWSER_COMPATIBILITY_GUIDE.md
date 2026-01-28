# 브라우저 호환성 가이드

## 개요
주요 브라우저에서 Premium Todo 애플리케이션의 호환성을 확인하고 문제를 해결하는 가이드입니다.

## 지원 브라우저

### 데스크톱
- **Chrome**: 최신 2개 버전
- **Safari**: 최신 2개 버전
- **Edge**: 최신 2개 버전
- **Firefox**: 최신 2개 버전

### 모바일
- **iOS Safari**: iOS 14+
- **Android Chrome**: Android 9+

## 사용 기술 브라우저 지원

### Next.js 15
- 모든 모던 브라우저 지원
- IE 미지원

### Framer Motion
- Chrome 51+
- Safari 10+
- Firefox 54+
- Edge 79+

### Canvas Confetti
- Canvas API 지원 브라우저
- IE 9+ (제한적 지원)

### LocalStorage
- 모든 모던 브라우저 지원
- 프라이빗 모드에서 제한적

### CSS Features

#### oklch() 색상
```css
/* 지원: Chrome 111+, Safari 15.4+, Firefox 113+ */
color: oklch(0.55 0.25 264);

/* 폴백 */
color: #6366f1; /* oklch 지원 안 될 경우 */
color: oklch(0.55 0.25 264);
```

#### backdrop-filter
```css
/* 지원: Chrome 76+, Safari 9+, Firefox 103+ */
backdrop-filter: blur(10px);
-webkit-backdrop-filter: blur(10px);
```

#### CSS Grid
```css
/* 지원: 모든 모던 브라우저 */
display: grid;
grid-template-columns: repeat(3, 1fr);
```

#### CSS Custom Properties
```css
/* 지원: 모든 모던 브라우저 */
--color-primary: #6366f1;
color: var(--color-primary);
```

## 브라우저별 테스트 체크리스트

### Chrome (Desktop & Mobile)

#### 기능 테스트
- [ ] 할 일 추가/삭제/완료
- [ ] LocalStorage 저장/불러오기
- [ ] 데이터 백업/복원
- [ ] Confetti 효과
- [ ] 다크 모드 전환
- [ ] 애니메이션 작동

#### 레이아웃 테스트
- [ ] 반응형 레이아웃
- [ ] Glassmorphism 효과
- [ ] 폰트 렌더링
- [ ] 아이콘 표시

#### 성능 테스트
- [ ] Lighthouse 점수 (90+)
- [ ] FCP < 1.5s
- [ ] LCP < 2.5s
- [ ] CLS < 0.1

### Safari (Desktop & iOS)

#### 알려진 이슈
1. **백드롭 필터 접두사 필요**
   ```css
   backdrop-filter: blur(10px);
   -webkit-backdrop-filter: blur(10px);
   ```

2. **날짜 처리**
   ```typescript
   // ISO 8601 형식 사용
   const date = new Date('2024-01-28T12:00:00.000Z');
   // new Date('2024-01-28 12:00:00') ❌
   ```

3. **스크롤 동작**
   ```css
   -webkit-overflow-scrolling: touch;
   ```

#### 테스트 항목
- [ ] 모든 CSS 효과 정상 작동
- [ ] 터치 제스처 반응
- [ ] 세이프 에어리어 고려
- [ ] 확대/축소 동작
- [ ] 다크 모드 자동 감지

### Edge

#### 특이사항
- Chromium 기반이므로 Chrome과 유사
- Windows 10/11 기본 브라우저

#### 테스트 항목
- [ ] 모든 기능 정상 작동
- [ ] 터치 스크린 지원
- [ ] Windows 다크 모드 연동

### Firefox

#### 알려진 차이점
1. **스크롤바 스타일**
   ```css
   /* Firefox */
   scrollbar-width: thin;
   scrollbar-color: rgba(0,0,0,0.3) transparent;

   /* Webkit */
   ::-webkit-scrollbar { width: 8px; }
   ```

2. **백드롭 필터**
   - Firefox 103+ 지원
   - 이전 버전은 폴백 필요

#### 테스트 항목
- [ ] 모든 기능 정상 작동
- [ ] 개발자 도구 콘솔 에러 확인
- [ ] 메모리 사용량 확인

## 호환성 이슈 해결

### 1. CSS 폴백

#### oklch 색상
```css
.button {
  /* 폴백 */
  background-color: #6366f1;
  /* 지원 시 적용 */
  background-color: oklch(0.55 0.25 264);
}
```

#### backdrop-filter
```css
.glass {
  /* 폴백 배경 */
  background: rgba(255, 255, 255, 0.9);
  /* 지원 시 적용 */
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

@supports (backdrop-filter: blur(10px)) {
  .glass {
    background: rgba(255, 255, 255, 0.7);
  }
}
```

### 2. JavaScript 폴리필

#### crypto.randomUUID()
```typescript
// Next.js 15는 자동 폴리필 제공
// 필요 시 수동 폴리필:
const uuid = () => {
  if (crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // 폴백 구현
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};
```

#### IntersectionObserver
```typescript
// Framer Motion이 자동 처리
// 필요 시 polyfill.io 사용
```

### 3. LocalStorage 안전성

```typescript
const safeLocalStorage = {
  getItem: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch {
      console.warn('LocalStorage not available');
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      localStorage.setItem(key, value);
    } catch {
      console.warn('LocalStorage not available');
    }
  },
};
```

### 4. 날짜 처리

```typescript
// ✅ 안전한 방법
const date = new Date('2024-01-28T12:00:00.000Z');
const isoString = date.toISOString();

// ❌ 브라우저별로 다름
const date = new Date('2024-01-28 12:00:00');
```

## 테스트 도구

### 자동화 도구

#### BrowserStack
```bash
# 실제 기기에서 테스트
- 다양한 브라우저/버전 조합
- 모바일 기기 테스트
- 스크린샷 자동 캡처
```

#### Playwright
```bash
npm install -D @playwright/test

# playwright.config.ts
export default {
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'mobile-chrome', use: { ...devices['Pixel 5'] } },
    { name: 'mobile-safari', use: { ...devices['iPhone 13'] } },
  ],
};
```

### 수동 테스트

#### Chrome DevTools
```
F12 → Console
- 에러 메시지 확인
- 네트워크 요청 확인
- 성능 프로파일링
```

#### Safari Web Inspector
```
Develop → Show Web Inspector
- Console 에러 확인
- iOS 시뮬레이터 연결
- Responsive Design Mode
```

## 문제 해결 가이드

### 이슈: Safari에서 애니메이션이 끊김

**원인**: GPU 가속 미지원

**해결**:
```css
.animated-element {
  transform: translateZ(0);
  will-change: transform;
}
```

### 이슈: iOS에서 LocalStorage 작동 안 함

**원인**: 프라이빗 브라우징 모드

**해결**:
```typescript
const isStorageAvailable = () => {
  try {
    localStorage.setItem('test', 'test');
    localStorage.removeItem('test');
    return true;
  } catch {
    return false;
  }
};

if (!isStorageAvailable()) {
  // 대체 저장소 사용 (메모리, IndexedDB 등)
}
```

### 이슈: Edge에서 폰트가 다르게 보임

**원인**: 폰트 렌더링 차이

**해결**:
```css
body {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}
```

### 이슈: Firefox에서 backdrop-filter 미지원

**원인**: 버전 103 이전

**해결**:
```css
@supports (backdrop-filter: blur(10px)) {
  .glass {
    backdrop-filter: blur(10px);
    background: rgba(255, 255, 255, 0.7);
  }
}

@supports not (backdrop-filter: blur(10px)) {
  .glass {
    background: rgba(255, 255, 255, 0.95);
  }
}
```

## 최종 체크리스트

### 기능 테스트
- [ ] 모든 CRUD 작동
- [ ] LocalStorage 저장/불러오기
- [ ] 데이터 백업/복원
- [ ] 필터링 정상 작동
- [ ] Confetti 효과
- [ ] 다크 모드 전환

### 레이아웃 테스트
- [ ] 반응형 디자인
- [ ] 모든 화면 크기
- [ ] 가로/세로 모드
- [ ] 폰트 렌더링
- [ ] 색상 정확도

### 성능 테스트
- [ ] 초기 로딩 속도
- [ ] 애니메이션 프레임률
- [ ] 메모리 사용량
- [ ] CPU 사용률

### 접근성 테스트
- [ ] 키보드 네비게이션
- [ ] 스크린 리더
- [ ] 색상 대비
- [ ] ARIA 레이블

## 참고 자료

- [Can I Use](https://caniuse.com/) - 브라우저 지원 확인
- [MDN Browser Compatibility](https://developer.mozilla.org/en-US/docs/Web/API)
- [Next.js Browser Support](https://nextjs.org/docs/architecture/supported-browsers)
- [Browserslist](https://browserslist.dev/) - 타겟 브라우저 설정
