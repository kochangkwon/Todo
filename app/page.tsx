'use client';

import { useTodos } from '@/hooks/use-todos';
import { useMounted } from '@/hooks/use-mounted';
import { TodoInput } from '@/components/todo/TodoInput';
import { TodoStats } from '@/components/todo/TodoStats';
import { TodoList } from '@/components/todo/TodoList';
import { TodoBackup } from '@/components/todo/TodoBackup';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

export default function Home() {
  const isMounted = useMounted();
  const { todos, addTodo, toggleTodo, deleteTodo, exportTodos, importTodos, stats } = useTodos();

  // 로딩 중 (Hydration 안전성)
  if (!isMounted) {
    return (
      <div className="space-y-6">
        <div className="glass rounded-2xl p-8 shadow-2xl">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4 text-brand-primary">
              Premium Todo
            </h1>
            <p className="text-neutral-700">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  const handleAddTodo = (content: string, priority: 'low' | 'medium' | 'high') => {
    addTodo({
      content,
      priority,
      completed: false,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass rounded-2xl p-8 shadow-2xl">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="w-8 h-8 text-brand-primary" />
            <h1 className="text-4xl font-bold text-brand-primary">
              Premium Todo
            </h1>
          </div>
          <p className="text-neutral-700">
            Next.js 15 + shadcn/ui + Framer Motion + oklch Colors
          </p>
        </div>
      </div>

      {/* Stats */}
      <TodoStats
        total={stats.total}
        completed={stats.completed}
        incomplete={stats.incomplete}
      />

      {/* Input */}
      <TodoInput onAddTodo={handleAddTodo} />

      {/* List */}
      <TodoList todos={todos} onToggle={toggleTodo} onDelete={deleteTodo} />

      {/* Backup */}
      <TodoBackup onExport={exportTodos} onImport={importTodos} />

      {/* Footer */}
      <Card className="glass border-0 shadow-2xl">
        <CardContent className="p-6">
          <div className="text-center text-sm text-neutral-600 space-y-1">
            <p>
              <strong>기능:</strong> 할 일 추가/삭제/완료, 우선순위 설정, 필터링, 데이터 백업/복원
            </p>
            <p>
              <strong>기술:</strong> TypeScript, Zod, LocalStorage, Framer Motion
            </p>
            <p className="text-xs text-neutral-500 mt-2">
              Made with Claude Code ✨
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
