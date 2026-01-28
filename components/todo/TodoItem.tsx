'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Todo, PRIORITY_LABELS } from '@/types/todo';
import { Trash2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

/**
 * 개별 할 일 항목 컴포넌트
 *
 * 체크박스, 내용, 우선순위 뱃지, 삭제 버튼을 포함합니다.
 */
function TodoItemComponent({ todo, onToggle, onDelete }: TodoItemProps) {
  /**
   * 우선순위에 따른 뱃지 variant
   */
  const getPriorityVariant = () => {
    switch (todo.priority) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      case 'low':
        return 'secondary';
      default:
        return 'default';
    }
  };

  /**
   * 우선순위에 따른 색상
   */
  const getPriorityColor = () => {
    switch (todo.priority) {
      case 'high':
        return 'text-error';
      case 'medium':
        return 'text-warning';
      case 'low':
        return 'text-success';
      default:
        return 'text-neutral-500';
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: -100, scale: 0.95 }}
      transition={{
        layout: {
          type: 'spring',
          stiffness: 300,
          damping: 30,
        },
        opacity: { duration: 0.2 },
        scale: { duration: 0.2 },
      }}
      className={cn(
        'group flex items-center gap-3 p-4 rounded-xl transition-all duration-200',
        'bg-white/70 backdrop-blur-sm border border-neutral-200',
        'hover:shadow-lg hover:border-brand-primary/30',
        todo.completed && 'opacity-60'
      )}
    >
      {/* 체크박스 */}
      <Checkbox
        id={`todo-${todo.id}`}
        checked={todo.completed}
        onCheckedChange={() => onToggle(todo.id)}
        className="mt-0.5"
      />

      {/* 할 일 내용 */}
      <label
        htmlFor={`todo-${todo.id}`}
        className={cn(
          'flex-1 cursor-pointer select-none transition-all',
          todo.completed && 'line-through text-neutral-500'
        )}
      >
        <span className="text-sm md:text-base">{todo.content}</span>
      </label>

      {/* 우선순위 뱃지 */}
      <motion.div
        className="flex items-center gap-2"
        whileHover={{ scale: 1.05 }}
        transition={{ type: 'spring', stiffness: 400, damping: 10 }}
      >
        {todo.priority === 'high' && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <AlertCircle className={cn('w-4 h-4', getPriorityColor())} />
          </motion.div>
        )}
        <Badge variant={getPriorityVariant()} className="text-xs">
          {PRIORITY_LABELS[todo.priority]}
        </Badge>
      </motion.div>

      {/* 삭제 버튼 */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(todo.id)}
          className={cn(
            'opacity-0 group-hover:opacity-100 transition-opacity',
            'hover:bg-error/10 hover:text-error'
          )}
          aria-label="삭제"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </motion.div>
    </motion.div>
  );
}

/**
 * React.memo로 최적화된 TodoItem
 *
 * props가 변경되지 않으면 리렌더링을 방지합니다.
 */
export const TodoItem = memo(TodoItemComponent, (prevProps, nextProps) => {
  // todo 객체의 모든 필드가 동일한지 확인
  return (
    prevProps.todo.id === nextProps.todo.id &&
    prevProps.todo.content === nextProps.todo.content &&
    prevProps.todo.completed === nextProps.todo.completed &&
    prevProps.todo.priority === nextProps.todo.priority &&
    prevProps.onToggle === nextProps.onToggle &&
    prevProps.onDelete === nextProps.onDelete
  );
});

TodoItem.displayName = 'TodoItem';
