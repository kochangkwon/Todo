/**
 * Todo 검증 스키마 사용 예제
 *
 * 이 파일은 실제 코드에서 사용되지 않으며,
 * 개발자가 검증 기능을 이해하기 위한 예제입니다.
 */

import { validateCreateTodo, validateUpdateTodo } from '@/lib/validators/todoValidator';

// ✅ 성공 케이스
export function exampleValidTodoCreation() {
  const result = validateCreateTodo({
    content: '프로젝트 문서 작성하기',
    priority: 'high',
    completed: false,
  });

  if (result.success) {
    console.log('검증 성공:', result.data);
    // result.data는 CreateTodoSchema 타입으로 안전하게 사용 가능
  }
}

// ❌ 실패 케이스 - 빈 내용
export function exampleEmptyContent() {
  const result = validateCreateTodo({
    content: '',
    priority: 'medium',
    completed: false,
  });

  if (!result.success) {
    console.log('검증 실패:', result.errors);
    // { content: ['할 일 내용을 최소 1자 이상 입력해주세요.'] }
  }
}

// ❌ 실패 케이스 - 잘못된 우선순위
export function exampleInvalidPriority() {
  const result = validateCreateTodo({
    content: '할 일',
    priority: 'urgent', // 잘못된 값
    completed: false,
  });

  if (!result.success) {
    console.log('검증 실패:', result.errors);
    // { priority: ['우선순위는 낮음, 보통, 높음 중 하나여야 합니다.'] }
  }
}

// ❌ 실패 케이스 - 너무 긴 내용
export function exampleTooLongContent() {
  const longContent = 'a'.repeat(501);
  const result = validateCreateTodo({
    content: longContent,
    priority: 'low',
    completed: false,
  });

  if (!result.success) {
    console.log('검증 실패:', result.errors);
    // { content: ['할 일 내용은 500자를 초과할 수 없습니다.'] }
  }
}

// ✅ 업데이트 검증 예제
export function exampleValidUpdate() {
  const result = validateUpdateTodo({
    content: '수정된 내용',
  });

  if (result.success) {
    console.log('업데이트 검증 성공:', result.data);
  }
}

// ✅ 일부 필드만 업데이트
export function examplePartialUpdate() {
  const result = validateUpdateTodo({
    completed: true,
  });

  if (result.success) {
    console.log('일부 업데이트 검증 성공:', result.data);
  }
}
