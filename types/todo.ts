/**
 * Todo 아이템의 우선순위
 */
export type Priority = 'low' | 'medium' | 'high';

/**
 * Todo 아이템 인터페이스
 */
export interface Todo {
  /**
   * 고유 식별자
   */
  id: string;

  /**
   * 할 일 내용
   */
  content: string;

  /**
   * 완료 여부
   */
  completed: boolean;

  /**
   * 우선순위
   */
  priority: Priority;

  /**
   * 생성 일시
   */
  createdAt: Date;
}

/**
 * Todo 생성을 위한 입력 타입 (id와 createdAt 제외)
 */
export type CreateTodoInput = Omit<Todo, 'id' | 'createdAt'>;

/**
 * Todo 업데이트를 위한 입력 타입 (부분 업데이트 가능)
 */
export type UpdateTodoInput = Partial<Omit<Todo, 'id' | 'createdAt'>>;

/**
 * 우선순위별 색상 매핑
 */
export const PRIORITY_COLORS = {
  low: 'success',
  medium: 'warning',
  high: 'error',
} as const;

/**
 * 우선순위별 라벨
 */
export const PRIORITY_LABELS = {
  low: '낮음',
  medium: '보통',
  high: '높음',
} as const;
