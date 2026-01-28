'use client';

/**
 * TodoItem 컴포넌트 사용 예제
 */

import { useState } from 'react';
import { TodoItem } from './TodoItem';
import { Todo, Priority } from '@/types/todo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function TodoItemExample() {
  const [todos, setTodos] = useState<Todo[]>([
    {
      id: '1',
      content: '프로젝트 기획서 작성하기',
      completed: false,
      priority: 'high',
      createdAt: new Date(),
    },
    {
      id: '2',
      content: '디자인 시안 검토',
      completed: true,
      priority: 'medium',
      createdAt: new Date(),
    },
    {
      id: '3',
      content: '팀 미팅 준비',
      completed: false,
      priority: 'low',
      createdAt: new Date(),
    },
  ]);

  const handleToggle = (id: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const handleDelete = (id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const handleAddSample = () => {
    const priorities: Priority[] = ['low', 'medium', 'high'];
    const randomPriority =
      priorities[Math.floor(Math.random() * priorities.length)];

    const newTodo: Todo = {
      id: Date.now().toString(),
      content: `새로운 할 일 ${Date.now()}`,
      completed: false,
      priority: randomPriority,
      createdAt: new Date(),
    };

    setTodos((prev) => [newTodo, ...prev]);
  };

  const handleToggleAll = () => {
    const allCompleted = todos.every((todo) => todo.completed);
    setTodos((prev) =>
      prev.map((todo) => ({ ...todo, completed: !allCompleted }))
    );
  };

  const handleDeleteCompleted = () => {
    setTodos((prev) => prev.filter((todo) => !todo.completed));
  };

  return (
    <div className="space-y-6">
      {/* 컨트롤 패널 */}
      <Card className="glass border-0 shadow-2xl">
        <CardHeader>
          <CardTitle>테스트 컨트롤</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <Button onClick={handleAddSample} variant="outline" size="sm">
              샘플 추가
            </Button>
            <Button onClick={handleToggleAll} variant="outline" size="sm">
              전체 토글
            </Button>
            <Button
              onClick={handleDeleteCompleted}
              variant="outline"
              size="sm"
              disabled={!todos.some((t) => t.completed)}
            >
              완료 항목 삭제
            </Button>
            <Button
              onClick={() => setTodos([])}
              variant="destructive"
              size="sm"
            >
              전체 삭제
            </Button>
          </div>
          <p className="text-xs text-neutral-600">
            총 {todos.length}개 · 완료{' '}
            {todos.filter((t) => t.completed).length}개
          </p>
        </CardContent>
      </Card>

      {/* TodoItem 목록 */}
      <Card className="glass border-0 shadow-2xl">
        <CardHeader>
          <CardTitle>할 일 목록</CardTitle>
        </CardHeader>
        <CardContent>
          {todos.length === 0 ? (
            <p className="text-center text-neutral-500 py-8">
              할 일이 없습니다. 샘플을 추가해보세요!
            </p>
          ) : (
            <div className="space-y-3">
              {todos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={handleToggle}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 기능 설명 */}
      <Card className="glass border-0 shadow-2xl">
        <CardHeader>
          <CardTitle>주요 기능</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-brand-primary">✓</span>
              <span>
                <strong>체크박스 토글:</strong> 클릭하여 완료/미완료 상태 변경
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-primary">✓</span>
              <span>
                <strong>취소선 스타일:</strong> 완료된 항목은 회색 취소선 표시
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-primary">✓</span>
              <span>
                <strong>우선순위 뱃지:</strong> 높음(빨강), 보통(회색),
                낮음(초록)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-primary">✓</span>
              <span>
                <strong>삭제 버튼:</strong> 호버 시 표시, 클릭하여 삭제
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-primary">✓</span>
              <span>
                <strong>React.memo 최적화:</strong> 불필요한 리렌더링 방지
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* 사용 예제 코드 */}
      <Card className="glass border-0 shadow-2xl">
        <CardHeader>
          <CardTitle>사용 방법</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="text-xs bg-neutral-900 text-neutral-100 p-4 rounded-lg overflow-x-auto">
            {`import { TodoItem } from '@/components/todo/TodoItem';
import { useTodos } from '@/hooks/use-todos';

function TodoList() {
  const { todos, toggleTodo, deleteTodo } = useTodos();

  return (
    <div className="space-y-3">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
        />
      ))}
    </div>
  );
}`}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
