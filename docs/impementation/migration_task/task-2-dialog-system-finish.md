# Task 2: 다이얼로그 기반 할 일 추가 시스템

## 목표
페이지 상단의 단순 입력창을 제거하고, 팝업(Dialog) 형태의 풍부한 입력 환경을 구축합니다.

## 배경
캘린더 뷰에서는 할 일을 추가할 때 내용뿐만 아니라 날짜와 우선순위도 함께 선택해야 합니다. 이를 위해 Dialog 기반의 입력 UI가 필요합니다.

## 구현 항목

### Task 2.1: shadcn/ui 컴포넌트 설치
**필요 컴포넌트:**
- Dialog
- Calendar
- Popover
- Select (우선순위 선택용)

**체크리스트:**
- [ ] `npx shadcn@latest add dialog` 실행
- [ ] `npx shadcn@latest add calendar` 실행
- [ ] `npx shadcn@latest add popover` 실행
- [ ] `npx shadcn@latest add select` 실행 (아직 없는 경우)
- [ ] 각 컴포넌트가 `components/ui/` 폴더에 생성되었는지 확인

**의존성:**
- date-fns (캘린더 컴포넌트에서 사용)

### Task 2.2: TodoAddDialog 컴포넌트 개발
**파일:** `components/TodoAddDialog.tsx` (새 파일)

**기능:**
1. 내용 입력 (Textarea)
2. 우선순위 선택 (Select: 🔴높음, 🟡보통, 🟢낮음)
3. 날짜 선택 (DatePicker: 달력에서 마우스로 선택)

**체크리스트:**
- [ ] `TodoAddDialog` 컴포넌트 파일 생성
- [ ] Dialog 레이아웃 구성 (DialogHeader, DialogContent, DialogFooter)
- [ ] Textarea로 할 일 내용 입력 필드 추가
- [ ] Select로 우선순위 선택 UI 구현
  - High (높음) - 🔴 Red
  - Medium (보통) - 🟡 Amber
  - Low (낮음) - 🟢 Green
- [ ] Calendar + Popover로 DatePicker 구현
- [ ] 선택된 날짜 표시 UI
- [ ] 저장/취소 버튼 추가

**컴포넌트 Props:**
```typescript
interface TodoAddDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (todo: TodoInput) => void;
  preselectedDate?: Date; // 캘린더에서 날짜 클릭 시 사용
}
```

**UI 구성:**
```
┌─────────────────────────────────┐
│ 할 일 추가                       │
├─────────────────────────────────┤
│ 내용:                            │
│ ┌─────────────────────────────┐ │
│ │ [Textarea]                  │ │
│ └─────────────────────────────┘ │
│                                  │
│ 우선순위: [Select ▼]            │
│                                  │
│ 날짜: [📅 2026-01-29]           │
│                                  │
│         [취소] [추가]           │
└─────────────────────────────────┘
```

### Task 2.3: 유효성 검사 적용
**파일:** `components/TodoAddDialog.tsx`

**검증 규칙:**
- 내용이 비어있으면 추가 버튼 비활성화
- 날짜가 선택되지 않으면 추가 버튼 비활성화
- (선택사항) 내용이 너무 길면 경고

**체크리스트:**
- [ ] 내용 입력 상태 관리 (useState)
- [ ] 날짜 선택 상태 관리 (useState)
- [ ] 우선순위 선택 상태 관리 (useState, 기본값: 'medium')
- [ ] 추가 버튼 disabled 조건 설정
- [ ] Zod 스키마 활용한 검증 (Task 1.2와 연계)
- [ ] 에러 메시지 표시

**유효성 검사 로직:**
```typescript
const isValid = content.trim().length > 0 && selectedDate !== null;
```

## Context API 전환 검토

**전문가 조언:**
할 일 추가 다이얼로그가 어디서든(헤더, 날짜 칸, 플로팅 버튼) 열려야 하므로, `isDialogOpen` 상태와 `selectedDate` 상태를 별도의 전역 상태(Context)로 관리하면 프롭 드릴링(Prop Drilling)을 방지할 수 있습니다.

**구현 옵션:**
1. **현재 단계:** Props로 전달 (간단하지만 프롭 드릴링 발생 가능)
2. **고도화:** Context API로 전역 상태 관리

**Context 사용 시 구조:**
```typescript
// contexts/DialogContext.tsx
interface DialogContextType {
  isOpen: boolean;
  selectedDate: Date | null;
  openDialog: (date?: Date) => void;
  closeDialog: () => void;
}
```

## 검증 방법
1. Dialog가 정상적으로 열리고 닫히는지 확인
2. 모든 입력 필드가 작동하는지 테스트
3. 유효성 검사가 제대로 작동하는지 확인
4. 할 일 추가 시 데이터가 올바르게 전달되는지 확인

## 의존성
- Task 1 완료 필요 (dueDate 속성 및 타입 정의)

## 다음 단계
이 작업이 완료되면 Task 3 (캘린더 뷰 엔진)으로 진행할 수 있습니다.
