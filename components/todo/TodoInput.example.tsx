'use client';

/**
 * TodoInput 컴포넌트 사용 예제
 */

import { useState } from 'react';
import { TodoInput } from './TodoInput';
import { Priority } from '@/types/todo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function TodoInputExample() {
  const [addedTodos, setAddedTodos] = useState<
    Array<{ content: string; priority: Priority }>
  >([]);

  const handleAddTodo = (content: string, priority: Priority) => {
    setAddedTodos((prev) => [...prev, { content, priority }]);
    console.log('할 일 추가됨:', { content, priority });
  };

  return (
    <div className="space-y-6">
      {/* TodoInput 컴포넌트 */}
      <TodoInput onAddTodo={handleAddTodo} />

      {/* 추가된 할 일 목록 (예제용) */}
      <Card className="glass border-0 shadow-2xl">
        <CardHeader>
          <CardTitle>추가된 할 일 (예제)</CardTitle>
        </CardHeader>
        <CardContent>
          {addedTodos.length === 0 ? (
            <p className="text-neutral-500 text-sm">
              아직 추가된 할 일이 없습니다.
            </p>
          ) : (
            <div className="space-y-2">
              {addedTodos.map((todo, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-white/50 rounded-lg"
                >
                  <span className="flex-1">{todo.content}</span>
                  <Badge
                    variant={
                      todo.priority === 'high'
                        ? 'destructive'
                        : todo.priority === 'medium'
                        ? 'default'
                        : 'secondary'
                    }
                  >
                    {todo.priority}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 사용 예제 코드 */}
      <Card className="glass border-0 shadow-2xl">
        <CardHeader>
          <CardTitle>사용 방법</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="text-xs bg-neutral-900 text-neutral-100 p-4 rounded-lg overflow-x-auto">
            {`import { TodoInput } from '@/components/todo/TodoInput';

function MyComponent() {
  const handleAddTodo = (content: string, priority: Priority) => {
    console.log('새 할 일:', content, priority);
    // 실제 로직 구현
  };

  return <TodoInput onAddTodo={handleAddTodo} />;
}`}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
