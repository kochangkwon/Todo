# Task 2.1: types/todo.ts 정의

## 단계
**단계 2: 데이터 스키마 및 상태 관리 (Business Logic)**

## 설명
할 일 애플리케이션의 타입 정의를 작성합니다.

## 체크리스트
- [ ] Todo 인터페이스 정의
- [ ] ID 필드 정의
- [ ] 내용(content) 필드 정의
- [ ] 완료 여부(completed) 필드 정의
- [ ] 우선순위(priority) 필드 정의
- [ ] 생성일시(createdAt) 필드 정의 (선택사항)

## 예시 구조
```typescript
export interface Todo {
  id: string;
  content: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
}
```

## 참고사항
- TypeScript의 strict 모드를 활용하세요
- 필요에 따라 추가 필드를 정의할 수 있습니다
