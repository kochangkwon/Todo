'use client';

/**
 * TodoList 컴포넌트 사용 예제
 */

import { useState } from 'react';
import { TodoList } from './TodoList';
import { Todo, Priority } from '@/types/todo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export function TodoListExample() {
  const [todos, setTodos] = useState<Todo[]>([
    {
      id: '1',
      content: '프로젝트 기획서 작성하기',
      completed: false,
      priority: 'high',
      createdAt: new Date('2024-01-15'),
      dueDate: new Date('2024-01-15'),
    },
    {
      id: '2',
      content: '디자인 시안 검토 및 피드백',
      completed: false,
      priority: 'medium',
      createdAt: new Date('2024-01-16'),
      dueDate: new Date('2024-01-16'),
    },
    {
      id: '3',
      content: '코드 리뷰 완료',
      completed: true,
      priority: 'high',
      createdAt: new Date('2024-01-14'),
      dueDate: new Date('2024-01-14'),
    },
    {
      id: '4',
      content: '팀 미팅 준비',
      completed: false,
      priority: 'low',
      createdAt: new Date('2024-01-17'),
      dueDate: new Date('2024-01-17'),
    },
    {
      id: '5',
      content: '주간 리포트 작성',
      completed: true,
      priority: 'medium',
      createdAt: new Date('2024-01-13'),
      dueDate: new Date('2024-01-13'),
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

  const handleAddRandom = () => {
    const priorities: Priority[] = ['low', 'medium', 'high'];
    const randomPriority =
      priorities[Math.floor(Math.random() * priorities.length)];
    const randomCompleted = Math.random() > 0.5;

    const samples = [
      '문서 작성하기',
      '이메일 확인',
      '회의 참석',
      '버그 수정',
      '기능 구현',
      '테스트 작성',
      '배포 준비',
      '리뷰 요청',
    ];

    const randomContent =
      samples[Math.floor(Math.random() * samples.length)] +
      ` (${Date.now()})`;

    const newTodo: Todo = {
      id: Date.now().toString(),
      content: randomContent,
      completed: randomCompleted,
      priority: randomPriority,
      createdAt: new Date(),
      dueDate: new Date(),
    };

    setTodos((prev) => [newTodo, ...prev]);
  };

  const handleCompleteAll = () => {
    setTodos((prev) => prev.map((todo) => ({ ...todo, completed: true })));
  };

  const handleUncompleteAll = () => {
    setTodos((prev) => prev.map((todo) => ({ ...todo, completed: false })));
  };

  const handleDeleteCompleted = () => {
    setTodos((prev) => prev.filter((todo) => !todo.completed));
  };

  const handleClearAll = () => {
    setTodos([]);
  };

  const stats = {
    total: todos.length,
    active: todos.filter((t) => !t.completed).length,
    completed: todos.filter((t) => t.completed).length,
  };

  return (
    <div className="space-y-6">
      {/* 컨트롤 패널 */}
      <Card className="glass border-0 shadow-2xl">
        <CardHeader>
          <CardTitle>테스트 컨트롤</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 통계 */}
          <div className="grid grid-cols-3 gap-4 p-4 bg-neutral-100 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-neutral-900">
                {stats.total}
              </div>
              <div className="text-xs text-neutral-600">전체</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-brand-primary">
                {stats.active}
              </div>
              <div className="text-xs text-neutral-600">진행중</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-success">
                {stats.completed}
              </div>
              <div className="text-xs text-neutral-600">완료</div>
            </div>
          </div>

          {/* 액션 버튼 */}
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              <Button onClick={handleAddRandom} size="sm" variant="default">
                <Plus className="w-4 h-4 mr-1" />
                랜덤 추가
              </Button>
              <Button onClick={handleCompleteAll} size="sm" variant="outline">
                모두 완료
              </Button>
              <Button
                onClick={handleUncompleteAll}
                size="sm"
                variant="outline"
              >
                모두 미완료
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={handleDeleteCompleted}
                size="sm"
                variant="outline"
                disabled={stats.completed === 0}
              >
                완료 항목 삭제
              </Button>
              <Button
                onClick={handleClearAll}
                size="sm"
                variant="destructive"
                disabled={stats.total === 0}
              >
                전체 삭제
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* TodoList 컴포넌트 */}
      <TodoList todos={todos} onToggle={handleToggle} onDelete={handleDelete} />

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
                <strong>탭 필터링:</strong> 전체/진행중/완료 탭으로 필터링
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-primary">✓</span>
              <span>
                <strong>개수 표시:</strong> 각 탭에 해당 항목 개수 뱃지 표시
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-primary">✓</span>
              <span>
                <strong>빈 상태 처리:</strong> 필터별 맞춤 빈 상태 메시지
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-primary">✓</span>
              <span>
                <strong>성능 최적화:</strong> useMemo로 필터링 결과 캐싱
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-primary">✓</span>
              <span>
                <strong>TodoItem 통합:</strong> 각 항목은 TodoItem 컴포넌트로 렌더링
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
            {`import { TodoList } from '@/components/todo/TodoList';
import { useTodos } from '@/hooks/use-todos';

function MyTodoApp() {
  const { todos, toggleTodo, deleteTodo } = useTodos();

  return (
    <TodoList
      todos={todos}
      onToggle={toggleTodo}
      onDelete={deleteTodo}
    />
  );
}`}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
