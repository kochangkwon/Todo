# 반응형 디자인 가이드

## 개요
모바일부터 데스크톱까지 모든 화면 크기에서 최적의 사용자 경험을 제공하는 반응형 레이아웃 가이드입니다.

## 브레이크포인트

### Tailwind CSS 기본 브레이크포인트
```
sm:  640px  (모바일 가로/작은 태블릿)
md:  768px  (태블릿)
lg:  1024px (데스크톱)
xl:  1280px (큰 데스크톱)
2xl: 1536px (초대형 화면)
```

### 프로젝트 타겟 화면
- **모바일**: 320px ~ 639px
- **태블릿**: 640px ~ 1023px
- **데스크톱**: 1024px 이상

## 터치 타겟 크기

### WCAG 2.1 권장 사항
- **최소 크기**: 44x44px
- **권장 크기**: 48x48px
- **터치 간격**: 최소 8px

### 구현 예시

#### 버튼
```typescript
// 최소 터치 타겟 적용
<Button
  size="icon"
  className="min-w-[44px] min-h-[44px]"
>
  <Icon />
</Button>

// 모바일에서 더 큰 타겟
<Button
  className="h-10 sm:h-9 px-4 sm:px-3"
>
  추가
</Button>
```

#### 체크박스
```typescript
// Checkbox는 기본적으로 16x16이지만 클릭 영역은 44x44
<Checkbox className="h-4 w-4 cursor-pointer p-3" />
```

## 레이아웃 패턴

### 1. 컨테이너 너비
```typescript
// app/layout.tsx
<div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
  {children}
</div>
```

**반응형 패딩:**
- 모바일: 16px (px-4)
- 태블릿: 24px (sm:px-6)
- 데스크톱: 32px (lg:px-8)

### 2. Grid 레이아웃
```typescript
// TodoStats.tsx
<div className="grid grid-cols-3 gap-4">
  {/* 모든 화면에서 3열 */}
</div>

// 반응형 그리드
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* 모바일: 1열, 태블릿: 2열, 데스크톱: 3열 */}
</div>
```

### 3. Flexbox 레이아웃
```typescript
// TodoInput.tsx
<div className="flex flex-col sm:flex-row gap-3">
  {/* 모바일: 세로 배치, 태블릿+: 가로 배치 */}
  <Input className="flex-1" />
  <Select className="w-full sm:w-40" />
  <Button className="w-full sm:w-auto" />
</div>
```

### 4. 타이포그래피
```typescript
// 반응형 텍스트 크기
<h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
  Premium Todo
</h1>

<p className="text-sm sm:text-base">
  설명 텍스트
</p>
```

### 5. 간격 (Spacing)
```typescript
// 반응형 간격
<div className="space-y-4 sm:space-y-6">
  {/* 모바일: 16px, 태블릿+: 24px */}
</div>

<div className="p-4 sm:p-6 lg:p-8">
  {/* 반응형 패딩 */}
</div>
```

## 컴포넌트별 반응형 구현

### TodoInput
```typescript
<form className="glass rounded-2xl p-4 sm:p-6 shadow-2xl">
  <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
    새로운 할 일 추가
  </h2>

  <div className="flex flex-col sm:flex-row gap-3">
    {/* 모바일: 세로 스택 */}
    <Input className="flex-1" />
    <Select className="w-full sm:w-40" />
    <Button className="w-full sm:w-auto h-11">
      추가
    </Button>
  </div>
</form>
```

**특징:**
- 모바일: 전체 너비, 세로 배치
- 태블릿+: 가로 배치, 적절한 너비

### TodoItem
```typescript
<motion.div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4">
  {/* 모바일에서 간격 축소 */}
  <Checkbox className="min-w-[44px] min-h-[44px]" />

  <label className="flex-1 text-sm sm:text-base">
    {content}
  </label>

  <Badge className="text-xs shrink-0">
    {priority}
  </Badge>

  <Button
    size="icon"
    className="min-w-[44px] min-h-[44px] sm:opacity-0 sm:group-hover:opacity-100"
  >
    {/* 모바일: 항상 표시, 데스크톱: 호버 시 표시 */}
    <Trash2 />
  </Button>
</motion.div>
```

**특징:**
- 터치 타겟 44px 이상
- 모바일에서 삭제 버튼 항상 표시
- 반응형 간격과 텍스트 크기

### TodoStats
```typescript
<div className="glass rounded-2xl p-4 sm:p-6 shadow-2xl">
  <div className="space-y-4 sm:space-y-6">
    {/* 헤더 */}
    <div className="flex items-center justify-between">
      <h2 className="text-base sm:text-lg font-semibold">
        진행 상황
      </h2>
      <span className="text-xl sm:text-2xl font-bold">
        {completionRate}%
      </span>
    </div>

    {/* 통계 카드 */}
    <div className="grid grid-cols-3 gap-2 sm:gap-4">
      {/* 모바일: 작은 간격, 태블릿+: 큰 간격 */}
      <Card className="p-3 sm:p-4">
        <p className="text-lg sm:text-2xl font-bold">
          {total}
        </p>
        <p className="text-xs sm:text-sm">전체</p>
      </Card>
    </div>
  </div>
</div>
```

### TodoList
```typescript
<Tabs>
  <TabsList className="w-full justify-start overflow-x-auto">
    {/* 모바일에서 스크롤 가능 */}
    <TabsTrigger className="px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base">
      전체
    </TabsTrigger>
  </TabsList>

  <TabsContent className="p-4 sm:p-6">
    <div className="space-y-2 sm:space-y-3">
      {/* 반응형 간격 */}
      {todos.map(todo => <TodoItem key={todo.id} {...todo} />)}
    </div>
  </TabsContent>
</Tabs>
```

## 모바일 최적화

### 1. 터치 제스처
```typescript
// 스와이프 삭제 (향후 개선)
<motion.div
  drag="x"
  dragConstraints={{ left: -100, right: 0 }}
  onDragEnd={(e, info) => {
    if (info.offset.x < -50) {
      handleDelete();
    }
  }}
>
  <TodoItem />
</motion.div>
```

### 2. 가상 키보드 대응
```css
/* iOS Safari 주소창 숨김 대응 */
.min-h-screen {
  min-height: 100vh;
  min-height: -webkit-fill-available;
}

html {
  height: -webkit-fill-available;
}
```

### 3. 스크롤 최적화
```css
/* 부드러운 스크롤 */
html {
  scroll-behavior: smooth;
}

/* 스크롤 영역 */
.scroll-container {
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}
```

### 4. 모바일 전용 스타일
```typescript
// 모바일에서만 적용
<div className="block sm:hidden">
  {/* 모바일 전용 */}
</div>

// 데스크톱에서만 적용
<div className="hidden sm:block">
  {/* 데스크톱 전용 */}
</div>
```

## 테스트 체크리스트

### 모바일 (320px ~ 639px)
- [ ] 모든 텍스트가 읽기 쉬움
- [ ] 버튼이 터치하기 쉬움 (44px+)
- [ ] 레이아웃이 깨지지 않음
- [ ] 가로 스크롤이 발생하지 않음
- [ ] 세로 모드와 가로 모드 모두 정상 작동
- [ ] 가상 키보드 표시 시 문제없음

### 태블릿 (640px ~ 1023px)
- [ ] 적절한 여백 활용
- [ ] 가로 배치가 적절함
- [ ] 터치와 마우스 모두 작동
- [ ] 가로/세로 모드 모두 최적화

### 데스크톱 (1024px+)
- [ ] 최대 너비 제한 (max-w-5xl)
- [ ] 호버 효과 정상 작동
- [ ] 키보드 네비게이션 지원
- [ ] 큰 화면에서 과도하게 늘어나지 않음

## 테스트 도구

### Chrome DevTools
```
F12 → Device Toolbar 활성화
- iPhone SE (375x667)
- iPhone 12 Pro (390x844)
- iPad Air (820x1180)
- Responsive 모드
```

### 실제 기기 테스트
- iOS Safari
- Android Chrome
- 다양한 화면 크기

### 반응형 테스트 도구
- [Responsively App](https://responsively.app/)
- [BrowserStack](https://www.browserstack.com/)

## 성능 최적화

### 이미지 최적화
```typescript
import Image from 'next/image';

<Image
  src="/icon.png"
  alt="아이콘"
  width={32}
  height={32}
  sizes="(max-width: 768px) 24px, 32px"
/>
```

### 조건부 로딩
```typescript
const isMobile = useMediaQuery('(max-width: 768px)');

{isMobile ? <MobileView /> : <DesktopView />}
```

### 최적화된 애니메이션
```typescript
// 모바일에서 애니메이션 감소
const isMobile = useMediaQuery('(max-width: 768px)');

<motion.div
  animate={isMobile ? {} : complexAnimation}
>
  Content
</motion.div>
```

## 공통 패턴

### 반응형 버튼
```typescript
<Button className="
  w-full sm:w-auto
  h-11 sm:h-10
  text-base sm:text-sm
  px-6 sm:px-4
">
  버튼
</Button>
```

### 반응형 카드
```typescript
<Card className="
  p-4 sm:p-6
  rounded-xl sm:rounded-2xl
  shadow-lg sm:shadow-2xl
">
  Content
</Card>
```

### 반응형 간격
```typescript
<div className="
  space-y-3 sm:space-y-4 lg:space-y-6
  px-4 sm:px-6 lg:px-8
">
  Content
</div>
```

## 참고 자료

- [Tailwind CSS 반응형 디자인](https://tailwindcss.com/docs/responsive-design)
- [MDN 반응형 이미지](https://developer.mozilla.org/ko/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images)
- [Web.dev 반응형 가이드](https://web.dev/responsive-web-design-basics/)
