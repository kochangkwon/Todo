# Task 4: 인터랙션 및 애니메이션 고도화

## 목표
Framer Motion을 사용해 캘린더 전환과 사용자 인터랙션을 부드럽게 만들어 UX를 향상시킵니다.

## 배경
단순한 캘린더 뷰에 애니메이션과 인터랙션을 추가하여 사용자 경험을 개선하고, 직관적인 UI를 제공합니다.

## 구현 항목

### Task 4.1: 월 변경 시 좌우 슬라이드 애니메이션
**라이브러리:** Framer Motion

**기능:**
- 이전 월로 이동 시 오른쪽으로 슬라이드
- 다음 월로 이동 시 왼쪽으로 슬라이드

**체크리스트:**
- [ ] Framer Motion 설치 확인 (`npm install framer-motion`)
- [ ] `AnimatePresence` 컴포넌트로 캘린더 그리드 감싸기
- [ ] `motion.div`로 슬라이드 애니메이션 구현
- [ ] 방향에 따라 다른 애니메이션 적용 (이전/다음)
- [ ] 애니메이션 duration 최적화 (200-300ms 권장)

**애니메이션 코드 예시:**
```typescript
import { motion, AnimatePresence } from 'framer-motion';

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0
  }),
  center: {
    x: 0,
    opacity: 1
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 1000 : -1000,
    opacity: 0
  })
};

<AnimatePresence initial={false} custom={direction}>
  <motion.div
    key={currentMonth}
    custom={direction}
    variants={slideVariants}
    initial="enter"
    animate="center"
    exit="exit"
    transition={{ duration: 0.3 }}
  >
    {/* 캘린더 그리드 */}
  </motion.div>
</AnimatePresence>
```

### Task 4.2: 날짜 칸 호버 및 클릭 시 스케일 업 효과
**기능:**
- 마우스 호버 시 미세한 확대 효과
- 클릭 시 눌림 효과

**체크리스트:**
- [ ] 날짜 칸에 `motion.div` 적용
- [ ] `whileHover` 프롭으로 호버 애니메이션 추가
- [ ] `whileTap` 프롭으로 클릭 애니메이션 추가
- [ ] 전환 효과 부드럽게 조정
- [ ] 커서 변경 (cursor-pointer)

**애니메이션 코드:**
```typescript
<motion.div
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  transition={{ type: "spring", stiffness: 400, damping: 17 }}
  className="cursor-pointer"
>
  {/* 날짜 칸 내용 */}
</motion.div>
```

### Task 4.3: 할 일 완료 시 취소선 및 투명도 처리
**기능:**
- 완료된 할 일에 시각적 피드백 제공
- 캘린더 내 항목에도 완료 상태 반영

**체크리스트:**
- [ ] 완료된 할 일 감지 로직
- [ ] 취소선 스타일 적용 (`line-through`)
- [ ] 투명도 감소 (`opacity-50` 또는 `opacity-60`)
- [ ] 완료 토글 시 애니메이션 효과
- [ ] 완료된 할 일 필터링 옵션 (선택사항)

**스타일 적용:**
```typescript
<div className={cn(
  "transition-all duration-200",
  todo.completed && "line-through opacity-50"
)}>
  {todo.content}
</div>
```

**애니메이션 적용:**
```typescript
<motion.div
  animate={{
    opacity: todo.completed ? 0.5 : 1,
    textDecoration: todo.completed ? 'line-through' : 'none'
  }}
  transition={{ duration: 0.2 }}
>
  {todo.content}
</motion.div>
```

### Task 4.4: 캘린더 날짜 클릭 시 해당 날짜 선택된 다이얼로그 열기
**기능:**
- 캘린더의 특정 날짜를 클릭하면 해당 날짜가 미리 선택된 상태로 추가 다이얼로그 열기
- 빠른 할 일 추가 UX 제공

**체크리스트:**
- [ ] 날짜 칸 클릭 이벤트 핸들러 추가
- [ ] 클릭된 날짜를 `TodoAddDialog`에 전달
- [ ] Dialog의 `preselectedDate` prop 활용
- [ ] 날짜 칸에 추가 버튼(+) UI 옵션 (선택사항)
- [ ] 빈 날짜 칸 클릭 시 바로 Dialog 열기

**이벤트 핸들러 예시:**
```typescript
const handleDateClick = (date: Date) => {
  setSelectedDate(date);
  setIsDialogOpen(true);
};

// TodoCalendar 컴포넌트
<div onClick={() => handleDateClick(date)}>
  {/* 날짜 칸 */}
</div>
```

**Dialog Props 전달:**
```typescript
<TodoAddDialog
  isOpen={isDialogOpen}
  onClose={() => setIsDialogOpen(false)}
  onAdd={handleAddTodo}
  preselectedDate={selectedDate}
/>
```

## 성능 최적화

**주의사항:**
- 너무 많은 애니메이션은 성능 저하 유발
- 필요한 곳에만 애니메이션 적용
- `layoutId`를 사용한 공유 레이아웃 애니메이션 고려 (고급)

**최적화 팁:**
```typescript
// GPU 가속 사용
transform: translateX() // O
left: 100px // X

// 불필요한 리렌더링 방지
const MemoizedDateCell = React.memo(DateCell);
```

## 접근성 고려사항

**키보드 네비게이션:**
- [ ] Tab으로 날짜 칸 이동 가능
- [ ] Enter/Space로 날짜 선택
- [ ] 화살표 키로 월 이동 (선택사항)

**스크린 리더:**
- [ ] aria-label로 날짜 정보 제공
- [ ] role 속성 적절히 사용
- [ ] 포커스 스타일 명확히 표시

## 검증 방법
1. 월 전환 시 슬라이드 애니메이션 확인
2. 날짜 칸 호버/클릭 시 스케일 효과 확인
3. 할 일 완료 토글 시 시각적 피드백 확인
4. 날짜 클릭 시 Dialog가 올바른 날짜로 열리는지 확인
5. 모바일 터치 이벤트 정상 작동 확인
6. 성능 테스트 (Chrome DevTools Performance 탭)

## 의존성
- Task 2 완료 (TodoAddDialog)
- Task 3 완료 (TodoCalendar)

## 다음 단계
이 작업이 완료되면 Task 5 (안정성 및 최적화)로 진행할 수 있습니다.
