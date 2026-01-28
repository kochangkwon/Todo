import { Todo, CreateTodoInput, Priority, PRIORITY_LABELS } from '@/types/todo';

/**
 * 새로운 Todo 아이템 생성
 */
export function createTodo(input: CreateTodoInput): Todo {
  return {
    id: crypto.randomUUID(),
    ...input,
    createdAt: new Date(),
  };
}

/**
 * 우선순위 라벨 가져오기
 */
export function getPriorityLabel(priority: Priority): string {
  return PRIORITY_LABELS[priority];
}

/**
 * Todo 배열을 우선순위로 정렬
 */
export function sortByPriority(todos: Todo[]): Todo[] {
  const priorityOrder: Record<Priority, number> = {
    high: 0,
    medium: 1,
    low: 2,
  };

  return [...todos].sort((a, b) => {
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
}

/**
 * 완료되지 않은 Todo만 필터링
 */
export function getIncompleteTodos(todos: Todo[]): Todo[] {
  return todos.filter(todo => !todo.completed);
}

/**
 * 완료된 Todo만 필터링
 */
export function getCompletedTodos(todos: Todo[]): Todo[] {
  return todos.filter(todo => todo.completed);
}
