'use client';

import { useState } from 'react';
import { useTodos } from '@/hooks/use-todos';
import { useMounted } from '@/hooks/use-mounted';
import { CreateTodoInput } from '@/types/todo';
import { TodoInput } from '@/components/todo/TodoInput';
import { TodoAddDialog } from '@/components/todo/TodoAddDialog';
import { TodoCalendar } from '@/components/todo/TodoCalendar';
import { TodoStats } from '@/components/todo/TodoStats';
import { TodoList } from '@/components/todo/TodoList';
import { TodoBackup } from '@/components/todo/TodoBackup';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Sparkles, Plus } from 'lucide-react';

export default function Home() {
  const isMounted = useMounted();
  const { todos, addTodo, toggleTodo, deleteTodo, exportTodos, importTodos, stats } = useTodos();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

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
      dueDate: new Date(), // 기본값: 오늘 날짜
    });
  };

  const handleAddTodoFromDialog = (todo: CreateTodoInput) => {
    addTodo(todo);
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass dark:glass-dark rounded-2xl p-8 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1" />
          <ThemeToggle />
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="w-8 h-8 text-brand-primary" />
            <h1 className="text-4xl font-bold text-brand-primary">
              Premium Todo
            </h1>
          </div>
        </div>
      </div>

      {/* Stats */}
      <TodoStats
        total={stats.total}
        completed={stats.completed}
        incomplete={stats.incomplete}
      />

      {/* Input (기존 방식) */}
      <TodoInput onAddTodo={handleAddTodo} />

      {/* 새로운 Dialog 방식 추가 버튼 */}
      <div className="glass dark:glass-dark rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-1">Dialog 방식으로 추가</h3>
            <p className="text-sm text-muted-foreground">
              날짜 선택이 포함된 새로운 입력 방식
            </p>
          </div>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            할 일 추가
          </Button>
        </div>
      </div>

      {/* Dialog */}
      <TodoAddDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onAdd={handleAddTodoFromDialog}
        preselectedDate={selectedDate}
      />

      {/* Calendar View */}
      <TodoCalendar
        todos={todos}
        onDateClick={handleDateClick}
        onToggle={toggleTodo}
      />

      {/* List */}
      <TodoList todos={todos} onToggle={toggleTodo} onDelete={deleteTodo} />

      {/* Backup */}
      <TodoBackup onExport={exportTodos} onImport={importTodos} />
    </div>
  );
}
