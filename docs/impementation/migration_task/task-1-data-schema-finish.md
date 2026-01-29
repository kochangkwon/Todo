# Task 1: 데이터 스키마 및 비즈니스 로직 고도화

## 목표
기존 리스트 중심 로직에 '시간' 개념을 주입하여 캘린더 기반 플래너로의 전환을 위한 데이터 구조를 확립합니다.

## 배경
현재 Todo 항목은 날짜 정보 없이 단순 리스트로 관리됩니다. 캘린더 뷰를 구현하기 위해서는 각 할 일에 `dueDate` 속성이 필수적입니다.

## 구현 항목

### Task 1.1: Todo 타입에 dueDate 속성 추가
**파일:** `types/todo.ts`

**변경사항:**
- `Todo` 인터페이스에 `dueDate: Date` 필드 추가
- `TodoInput` 타입에도 날짜 관련 필드 추가

**체크리스트:**
- [ ] `Todo` 인터페이스에 `dueDate: Date` 속성 추가
- [ ] `TodoInput` 타입 업데이트
- [ ] 타입 변경으로 인한 컴파일 에러 확인

### Task 1.2: Zod 스키마에 날짜 필드 추가
**파일:** `lib/schemas/todoSchema.ts`

**변경사항:**
- Zod 스키마에 날짜 검증 로직 추가
- 날짜 유효성 검사 규칙 정의

**체크리스트:**
- [ ] `z.date()` 또는 `z.string().refine()` 사용하여 날짜 필드 추가
- [ ] 날짜가 과거가 아닌지 검증 (선택사항)
- [ ] 에러 메시지 한글화

### Task 1.3: loadTodos 함수에 Date 객체 파싱 로직 추가
**파일:** `hooks/use-todos.ts`

**변경사항:**
- LocalStorage에서 불러온 문자열 날짜를 Date 객체로 변환
- 데이터 무결성 보장

**체크리스트:**
- [ ] `loadTodos` 함수 내 `JSON.parse` 후 날짜 변환 로직 추가
- [ ] `todo.dueDate = new Date(todo.dueDate)` 처리
- [ ] invalid date 에러 핸들링

**중요 주의사항:**
```typescript
// LocalStorage는 Date 객체를 문자열로 저장합니다
// 반드시 복원 처리가 필요합니다
const todos = JSON.parse(data);
todos.forEach(todo => {
  todo.dueDate = new Date(todo.dueDate);
});
```

### Task 1.4: 레거시 데이터 마이그레이션 로직 구현
**파일:** `hooks/use-todos.ts`

**변경사항:**
- 기존에 저장된 할 일들 중 `dueDate`가 없는 항목 처리
- 기본값 할당 로직

**체크리스트:**
- [ ] `dueDate`가 없는 항목 감지
- [ ] `createdAt` 또는 현재 날짜를 기본값으로 할당
- [ ] 마이그레이션 후 LocalStorage 업데이트
- [ ] 콘솔에 마이그레이션 로그 출력 (개발 환경)

**마이그레이션 로직 예시:**
```typescript
const todos = JSON.parse(data);
let needsMigration = false;

todos.forEach(todo => {
  if (!todo.dueDate) {
    todo.dueDate = todo.createdAt ? new Date(todo.createdAt) : new Date();
    needsMigration = true;
  } else {
    todo.dueDate = new Date(todo.dueDate);
  }
});

if (needsMigration) {
  localStorage.setItem('todos', JSON.stringify(todos));
}
```

## 데이터 호환성 주의사항

**전문가 조언:**
- **데이터 무결성:** `JSON.parse` 이후 반드시 `todo.dueDate = new Date(todo.dueDate)` 처리를 해야 합니다. 이 과정이 없으면 `date-fns` 함수들이 `invalid date` 에러를 발생시킵니다.
- **기존 데이터 보호:** 마이그레이션 시 기존 할 일이 손실되지 않도록 `dueDate`가 없는 경우 적절한 기본값을 할당해야 합니다.

## 검증 방법
1. 기존 할 일이 있는 상태에서 앱 실행
2. 콘솔에 마이그레이션 로그 확인
3. 모든 할 일에 `dueDate` 속성이 있는지 확인
4. Date 객체가 정상적으로 파싱되는지 테스트

## 의존성
- 없음 (첫 번째 단계)

## 다음 단계
이 작업이 완료되면 Task 2 (Dialog 입력 시스템)로 진행할 수 있습니다.
