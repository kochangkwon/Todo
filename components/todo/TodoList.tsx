'use client';

import { useState, useMemo } from 'react';
import { AnimatePresence, LayoutGroup } from 'framer-motion';
import { TodoItem } from './TodoItem';
import { EmptyState } from './EmptyState';
import { Todo } from '@/types/todo';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ListTodo, CheckCircle2, Circle, Inbox } from 'lucide-react';

type FilterType = 'all' | 'active' | 'completed';

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

/**
 * 할 일 목록 컴포넌트
 *
 * 필터링 탭(전체/진행중/완료)과 할 일 목록을 표시합니다.
 */
export function TodoList({ todos, onToggle, onDelete }: TodoListProps) {
  const [filter, setFilter] = useState<FilterType>('all');

  /**
   * 필터링된 할 일 목록
   */
  const filteredTodos = useMemo(() => {
    switch (filter) {
      case 'active':
        return todos.filter((todo) => !todo.completed);
      case 'completed':
        return todos.filter((todo) => todo.completed);
      case 'all':
      default:
        return todos;
    }
  }, [todos, filter]);

  /**
   * 각 필터별 개수
   */
  const counts = useMemo(() => {
    return {
      all: todos.length,
      active: todos.filter((todo) => !todo.completed).length,
      completed: todos.filter((todo) => todo.completed).length,
    };
  }, [todos]);

  /**
   * 빈 상태 메시지
   */
  const getEmptyMessage = () => {
    switch (filter) {
      case 'active':
        return {
          icon: <CheckCircle2 className="w-16 h-16 text-success" />,
          title: '🎉 모든 할 일을 완료했습니다!',
          description: '정말 대단해요! 새로운 목표를 추가해보세요.',
        };
      case 'completed':
        return {
          icon: <Circle className="w-16 h-16 text-neutral-400" />,
          title: '완료된 할 일이 없습니다',
          description: '할 일을 체크하면 여기에 표시됩니다.',
        };
      case 'all':
      default:
        return {
          icon: <Inbox className="w-16 h-16 text-brand-primary" />,
          title: '아직 할 일이 없어요',
          description: '위에서 새로운 할 일을 추가하여 시작해보세요! ✨',
        };
    }
  };

  const emptyState = getEmptyMessage();

  return (
    <div className="glass rounded-2xl shadow-2xl overflow-hidden">
      {/* 탭 헤더 */}
      <Tabs value={filter} onValueChange={(value) => setFilter(value as FilterType)}>
        <div className="border-b border-neutral-200 bg-white/50 backdrop-blur-sm">
          <TabsList className="w-full justify-start rounded-none h-auto p-0 bg-transparent">
            <TabsTrigger
              value="all"
              className="flex items-center gap-2 rounded-none border-b-2 border-transparent data-[state=active]:border-brand-primary data-[state=active]:bg-transparent px-6 py-4"
            >
              <ListTodo className="w-4 h-4" />
              <span>전체</span>
              <Badge variant="secondary" className="ml-1">
                {counts.all}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="active"
              className="flex items-center gap-2 rounded-none border-b-2 border-transparent data-[state=active]:border-brand-primary data-[state=active]:bg-transparent px-6 py-4"
            >
              <Circle className="w-4 h-4" />
              <span>진행중</span>
              <Badge variant="secondary" className="ml-1">
                {counts.active}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="completed"
              className="flex items-center gap-2 rounded-none border-b-2 border-transparent data-[state=active]:border-brand-primary data-[state=active]:bg-transparent px-6 py-4"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>완료</span>
              <Badge variant="secondary" className="ml-1">
                {counts.completed}
              </Badge>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* 탭 컨텐츠 */}
        <LayoutGroup>
          <div className="p-6">
            <TabsContent value="all" className="mt-0">
              {filteredTodos.length === 0 ? (
                <EmptyState {...emptyState} />
              ) : (
                <div className="space-y-3">
                  <AnimatePresence mode="popLayout">
                    {filteredTodos.map((todo) => (
                      <TodoItem
                        key={todo.id}
                        todo={todo}
                        onToggle={onToggle}
                        onDelete={onDelete}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </TabsContent>

            <TabsContent value="active" className="mt-0">
              {filteredTodos.length === 0 ? (
                <EmptyState {...emptyState} />
              ) : (
                <div className="space-y-3">
                  <AnimatePresence mode="popLayout">
                    {filteredTodos.map((todo) => (
                      <TodoItem
                        key={todo.id}
                        todo={todo}
                        onToggle={onToggle}
                        onDelete={onDelete}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </TabsContent>

            <TabsContent value="completed" className="mt-0">
              {filteredTodos.length === 0 ? (
                <EmptyState {...emptyState} />
              ) : (
                <div className="space-y-3">
                  <AnimatePresence mode="popLayout">
                    {filteredTodos.map((todo) => (
                      <TodoItem
                        key={todo.id}
                        todo={todo}
                        onToggle={onToggle}
                        onDelete={onDelete}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </TabsContent>
          </div>
        </LayoutGroup>
      </Tabs>
    </div>
  );
}