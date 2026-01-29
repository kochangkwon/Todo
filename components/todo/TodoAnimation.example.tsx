'use client';

/**
 * 애니메이션 효과 데모 예제
 */

import { useState } from 'react';
import { TodoList } from './TodoList';
import { TodoInput } from './TodoInput';
import { Todo, Priority } from '@/types/todo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

export function TodoAnimationExample() {
  const [todos, setTodos] = useState<Todo[]>([
    {
      id: '1',
      content: '첫 번째 할 일',
      completed: false,
      priority: 'high',
      createdAt: new Date(),
      dueDate: new Date(),
    },
    {
      id: '2',
      content: '두 번째 할 일',
      completed: false,
      priority: 'medium',
      createdAt: new Date(),
      dueDate: new Date(),
    },
  ]);

  const handleAddTodo = (content: string, priority: Priority) => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      content,
      priority,
      completed: false,
      createdAt: new Date(),
      dueDate: new Date(),
    };

    setTodos((prev) => [newTodo, ...prev]);
  };

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

  const handleAddMultiple = () => {
    const newTodos: Todo[] = [
      {
        id: `${Date.now()}-1`,
        content: '여러 개 추가 테스트 1',
        completed: false,
        priority: 'high',
        createdAt: new Date(),
        dueDate: new Date(),
      },
      {
        id: `${Date.now()}-2`,
        content: '여러 개 추가 테스트 2',
        completed: false,
        priority: 'medium',
        createdAt: new Date(),
        dueDate: new Date(),
      },
      {
        id: `${Date.now()}-3`,
        content: '여러 개 추가 테스트 3',
        completed: false,
        priority: 'low',
        createdAt: new Date(),
        dueDate: new Date(),
      },
    ];

    setTodos((prev) => [...newTodos, ...prev]);
  };

  const handleDeleteAll = () => {
    setTodos([]);
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <Card className="glass border-0 shadow-2xl bg-gradient-to-r from-brand-primary/10 to-brand-accent/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-brand-primary" />
            애니메이션 효과 데모
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-neutral-600">
            할 일을 추가하거나 삭제하면서 부드러운 애니메이션을 확인해보세요.
          </p>
        </CardContent>
      </Card>

      {/* 테스트 컨트롤 */}
      <Card className="glass border-0 shadow-2xl">
        <CardHeader>
          <CardTitle>애니메이션 테스트</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <Button onClick={handleAddMultiple} size="sm">
              여러 개 추가
            </Button>
            <Button
              onClick={handleDeleteAll}
              size="sm"
              variant="destructive"
              disabled={todos.length === 0}
            >
              전체 삭제
            </Button>
          </div>
          <div className="text-xs text-neutral-600 space-y-1">
            <p>• <strong>추가 시:</strong> 위에서 슬라이드되며 나타남</p>
            <p>• <strong>삭제 시:</strong> 왼쪽으로 슬라이드되며 사라짐</p>
            <p>• <strong>레이아웃:</strong> 다른 항목들이 부드럽게 재배치됨</p>
          </div>
        </CardContent>
      </Card>

      {/* TodoInput */}
      <TodoInput onAddTodo={handleAddTodo} />

      {/* TodoList with Animations */}
      <TodoList todos={todos} onToggle={handleToggle} onDelete={handleDelete} />

      {/* 애니메이션 설명 */}
      <Card className="glass border-0 shadow-2xl">
        <CardHeader>
          <CardTitle>적용된 애니메이션</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold mb-2">1. 추가 애니메이션</h4>
              <ul className="text-xs space-y-1 text-neutral-600">
                <li>• <code>initial</code>: opacity 0, y -20, scale 0.95</li>
                <li>• <code>animate</code>: opacity 1, y 0, scale 1</li>
                <li>• 위에서 아래로 부드럽게 나타나는 효과</li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-2">2. 삭제 애니메이션</h4>
              <ul className="text-xs space-y-1 text-neutral-600">
                <li>• <code>exit</code>: opacity 0, x -100, scale 0.95</li>
                <li>• 왼쪽으로 슬라이드되며 사라지는 효과</li>
                <li>• 스케일과 투명도가 동시에 감소</li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-2">3. 레이아웃 애니메이션</h4>
              <ul className="text-xs space-y-1 text-neutral-600">
                <li>• <code>layout</code>: 다른 항목들이 자동으로 재배치</li>
                <li>• <code>AnimatePresence mode=&quot;popLayout&quot;</code>: 삭제 시 즉시 공간 확보</li>
                <li>• 0.3초 동안 부드럽게 전환</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 기술 스택 */}
      <Card className="glass border-0 shadow-2xl">
        <CardHeader>
          <CardTitle>기술 스택</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-sm space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-brand-primary">✓</span>
              <span>
                <strong>Framer Motion:</strong> 애니메이션 라이브러리
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-primary">✓</span>
              <span>
                <strong>AnimatePresence:</strong> DOM 제거 시 애니메이션
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-primary">✓</span>
              <span>
                <strong>motion.div:</strong> 애니메이션 가능한 div 컴포넌트
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-primary">✓</span>
              <span>
                <strong>layout prop:</strong> 자동 레이아웃 애니메이션
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
