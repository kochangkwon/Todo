# Task 3: 캘린더 뷰 엔진 구축

## 목표
날짜별 할 일을 격자 형태로 시각화하는 캘린더 UI를 구축합니다.

## 배경
리스트 뷰에서 캘린더 뷰로 전환하기 위해 월별 날짜 생성, 날짜별 데이터 매핑, 시각적 표현을 구현해야 합니다.

## 구현 항목

### Task 3.1: date-fns를 이용한 월별 날짜 생성 로직
**라이브러리:** `date-fns`

**필요 함수:**
- `startOfMonth`: 월의 첫 날
- `endOfMonth`: 월의 마지막 날
- `startOfWeek`: 주의 첫 날
- `endOfWeek`: 주의 마지막 날
- `eachDayOfInterval`: 날짜 범위의 모든 날짜 생성
- `format`: 날짜 포맷팅
- `isSameDay`: 날짜 비교
- `isSameMonth`: 같은 월 확인

**체크리스트:**
- [ ] date-fns 설치 확인 (`npm install date-fns`)
- [ ] 월별 날짜 배열 생성 함수 구현
- [ ] 이전 월/다음 월의 일부 날짜도 포함 (그리드 채우기)
- [ ] 주 시작일 설정 (일요일 또는 월요일)

**날짜 생성 로직 예시:**
```typescript
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval
} from 'date-fns';

const generateCalendarDays = (date: Date) => {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
};
```

### Task 3.2: TodoCalendar 컴포넌트 레이아웃 (7열 그리드)
**파일:** `components/TodoCalendar.tsx` (새 파일)

**레이아웃 구조:**
```
┌─────────────────────────────────────────┐
│  ← 2026년 1월 →                         │
├───┬───┬───┬───┬───┬───┬───┐
│일 │월 │화 │수 │목 │금 │토 │
├───┼───┼───┼───┼───┼───┼───┤
│29 │30 │31 │ 1 │ 2 │ 3 │ 4 │
│   │   │   │●  │   │●● │   │
├───┼───┼───┼───┼───┼───┼───┤
│ 5 │ 6 │ 7 │ 8 │ 9 │10 │11 │
│   │●  │   │   │●  │   │   │
└───┴───┴───┴───┴───┴───┴───┘
```

**체크리스트:**
- [ ] Grid 레이아웃 구현 (`grid-cols-7`)
- [ ] 헤더 행에 요일 표시
- [ ] 날짜 칸(Cell) 컴포넌트 구현
- [ ] 현재 월/이전 월/다음 월 날짜 구분 스타일링
- [ ] 오늘 날짜 하이라이트
- [ ] 월 변경 버튼 (이전/다음)

**CSS 클래스 구조:**
```typescript
// 날짜 칸 기본 스타일
"aspect-square border p-2 hover:bg-accent"

// 다른 월의 날짜
"text-muted-foreground"

// 오늘 날짜
"bg-primary/10 font-bold"
```

### Task 3.3: 날짜별 데이터 매핑 알고리즘 (useMemo)
**파일:** `components/TodoCalendar.tsx`

**기능:**
- 모든 할 일을 날짜별로 그룹화
- 성능 최적화를 위해 useMemo 사용

**체크리스트:**
- [ ] `useMemo`로 날짜별 할 일 그룹화 로직 구현
- [ ] `isSameDay`로 날짜 비교
- [ ] Map 또는 Object로 데이터 구조화
- [ ] 의존성 배열 최적화

**매핑 로직 예시:**
```typescript
const todosByDate = useMemo(() => {
  const map = new Map<string, Todo[]>();

  todos.forEach(todo => {
    const dateKey = format(todo.dueDate, 'yyyy-MM-dd');
    if (!map.has(dateKey)) {
      map.set(dateKey, []);
    }
    map.get(dateKey)!.push(todo);
  });

  return map;
}, [todos]);
```

### Task 3.4: 중요도 기반 시각적 배지(Badge) 적용
**우선순위 색상:**
- High (높음): Red (🔴)
- Medium (보통): Amber (🟡)
- Low (낮음): Green (🟢)

**체크리스트:**
- [ ] 날짜 칸 내부에 할 일 표시 UI 구현
- [ ] 우선순위별 색상 배지 적용
- [ ] 모바일 가독성을 위해 '색상 점(Dot)' 표시 옵션
- [ ] 할 일 개수가 많을 때 표시 방법 (예: +3 더보기)
- [ ] 완료된 할 일 스타일 (취소선, 투명도)

**색상 접근성 주의사항:**

**전문가 조언:**
색상으로만 구분하면 색약 사용자가 어려울 수 있습니다. 배지 내부에 아이콘(예: ‼️, ⚠️, ✅)을 병행 표기하는 것이 좋습니다.

**개선된 표시 방법:**
```typescript
// 색상 + 아이콘 조합
const priorityConfig = {
  high: { color: 'bg-red-500', icon: '‼️' },
  medium: { color: 'bg-amber-500', icon: '⚠️' },
  low: { color: 'bg-green-500', icon: '✅' }
};
```

**모바일 최적화:**
- 작은 화면에서는 할 일 텍스트 대신 색상 점만 표시
- 클릭 시 상세 내용 표시 (Task 4.4와 연계)

## 반응형 디자인 고려사항

**데스크톱:**
- 할 일 내용 일부 표시 (truncate)
- 우선순위 배지 + 텍스트

**모바일:**
- 색상 점(Dot)으로만 표시
- 클릭 시 상세 보기

**Tailwind 클래스 예시:**
```typescript
<div className="hidden sm:block">{todo.content}</div>
<div className="sm:hidden w-2 h-2 rounded-full bg-red-500"></div>
```

## 검증 방법
1. 캘린더가 올바르게 렌더링되는지 확인
2. 이전/다음 월 이동이 정상 작동하는지 테스트
3. 할 일이 올바른 날짜에 표시되는지 확인
4. 우선순위별 색상이 제대로 적용되는지 확인
5. 모바일 화면에서 레이아웃 확인

## 의존성
- Task 1 완료 (dueDate 속성)
- Task 2 완료 (할 일 추가 기능)

## 다음 단계
이 작업이 완료되면 Task 4 (인터랙션 및 애니메이션)로 진행할 수 있습니다.
