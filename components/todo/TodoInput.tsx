'use client';

import { useState, FormEvent, KeyboardEvent } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Priority, PRIORITY_LABELS } from '@/types/todo';
import { Plus } from 'lucide-react';

interface TodoInputProps {
  onAddTodo: (content: string, priority: Priority) => void;
  disabled?: boolean;
}

/**
 * 할 일 입력 컴포넌트
 *
 * 새로운 할 일을 추가하기 위한 입력창과 우선순위 선택 UI를 제공합니다.
 */
export function TodoInput({ onAddTodo, disabled = false }: TodoInputProps) {
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');

  /**
   * 폼 제출 핸들러
   */
  const handleSubmit = (e?: FormEvent) => {
    e?.preventDefault();

    // 빈 내용 체크
    const trimmedContent = content.trim();
    if (!trimmedContent) {
      return;
    }

    // 할 일 추가
    onAddTodo(trimmedContent, priority);

    // 폼 초기화
    setContent('');
    setPriority('medium');
  };

  /**
   * 엔터 키 입력 핸들러
   */
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="glass dark:glass-dark rounded-2xl p-6 shadow-2xl"
      aria-label="새로운 할 일 추가 폼"
    >
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold mb-4 dark:text-neutral-100">새로운 할 일 추가</h2>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {/* 할 일 입력창 */}
          <div className="flex-1">
            <Input
              type="text"
              placeholder="할 일을 입력하세요..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={disabled}
              className="bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm border-neutral-200 dark:border-neutral-700 focus:border-brand-primary dark:text-neutral-100"
              maxLength={500}
              aria-label="할 일 내용"
            />
          </div>

          {/* 우선순위 셀렉트 */}
          <div className="w-full sm:w-40">
            <Select
              value={priority}
              onValueChange={(value) => setPriority(value as Priority)}
              disabled={disabled}
            >
              <SelectTrigger
                className="bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm border-neutral-200 dark:border-neutral-700 dark:text-neutral-100"
                aria-label="우선순위 선택"
              >
                <SelectValue placeholder="우선순위" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-success" />
                    {PRIORITY_LABELS.low}
                  </span>
                </SelectItem>
                <SelectItem value="medium">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-warning" />
                    {PRIORITY_LABELS.medium}
                  </span>
                </SelectItem>
                <SelectItem value="high">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-error" />
                    {PRIORITY_LABELS.high}
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 추가 버튼 */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
          >
            <Button
              type="submit"
              disabled={disabled || !content.trim()}
              className="w-full sm:w-auto bg-brand-primary hover:bg-brand-primary/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              추가
            </Button>
          </motion.div>
        </div>

        {/* 입력 힌트 */}
        <p className="text-xs text-neutral-500">
          Enter 키를 눌러 빠르게 추가하거나, 추가 버튼을 클릭하세요.
        </p>
      </div>
    </form>
  );
}
