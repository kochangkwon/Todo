/**
 * useTodos 훅 사용 예제
 *
 * 이 파일은 실제 코드에서 사용되지 않으며,
 * 개발자가 useTodos 훅의 사용법을 이해하기 위한 예제입니다.
 */

'use client';

import { useTodos } from './use-todos';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

export function TodosExample() {
  const {
    todos,
    isLoaded,
    addTodo,
    deleteTodo,
    updateTodo,
    toggleTodo,
    clearAllTodos,
    clearCompletedTodos,
    stats,
  } = useTodos();

  const [newTodoContent, setNewTodoContent] = useState('');

  // 새 할 일 추가
  const handleAddTodo = () => {
    if (!newTodoContent.trim()) return;

    addTodo({
      content: newTodoContent,
      priority: 'medium',
      completed: false,
      dueDate: new Date(),
    });

    setNewTodoContent('');
  };

  // 로딩 중
  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      {/* 통계 */}
      <div className="grid grid-cols-4 gap-2">
        <div>전체: {stats.total}</div>
        <div>완료: {stats.completed}</div>
        <div>미완료: {stats.incomplete}</div>
        <div>높음: {stats.byPriority.high}</div>
      </div>

      {/* 새 할 일 추가 */}
      <div className="flex gap-2">
        <Input
          value={newTodoContent}
          onChange={(e) => setNewTodoContent(e.target.value)}
          placeholder="새 할 일..."
          onKeyDown={(e) => e.key === 'Enter' && handleAddTodo()}
        />
        <Button onClick={handleAddTodo}>추가</Button>
      </div>

      {/* 할 일 목록 */}
      <div className="space-y-2">
        {todos.map((todo) => (
          <div key={todo.id} className="flex items-center gap-2">
            {/* 완료 토글 */}
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
            />

            {/* 내용 */}
            <span className={todo.completed ? 'line-through' : ''}>
              {todo.content}
            </span>

            {/* 우선순위 */}
            <span className="text-xs">{todo.priority}</span>

            {/* 삭제 버튼 */}
            <Button
              variant="destructive"
              size="sm"
              onClick={() => deleteTodo(todo.id)}
            >
              삭제
            </Button>

            {/* 수정 예제 */}
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                updateTodo(todo.id, {
                  priority: todo.priority === 'high' ? 'low' : 'high',
                })
              }
            >
              우선순위 변경
            </Button>
          </div>
        ))}
      </div>

      {/* 일괄 작업 */}
      <div className="flex gap-2">
        <Button variant="outline" onClick={clearCompletedTodos}>
          완료된 항목 삭제
        </Button>
        <Button variant="destructive" onClick={clearAllTodos}>
          전체 삭제
        </Button>
      </div>
    </div>
  );
}
