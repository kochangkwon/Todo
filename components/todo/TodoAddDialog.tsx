'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Priority, CreateTodoInput } from '@/types/todo';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

interface TodoAddDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (todo: CreateTodoInput) => void;
  preselectedDate?: Date;
}

/**
 * 할 일 추가 다이얼로그 컴포넌트
 *
 * 사용자가 할 일의 내용, 우선순위, 마감일을 입력할 수 있는 Dialog입니다.
 */
export function TodoAddDialog({
  isOpen,
  onClose,
  onAdd,
  preselectedDate,
}: TodoAddDialogProps) {
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [dueDate, setDueDate] = useState<Date | undefined>(
    preselectedDate || new Date()
  );

  // preselectedDate가 변경되면 dueDate 업데이트
  useEffect(() => {
    if (preselectedDate) {
      setDueDate(preselectedDate);
    }
  }, [preselectedDate]);

  // Dialog가 닫힐 때 폼 초기화
  useEffect(() => {
    if (!isOpen) {
      setContent('');
      setPriority('medium');
      setDueDate(new Date());
    }
  }, [isOpen]);

  const handleSubmit = () => {
    if (!isValid) return;

    onAdd({
      content: content.trim(),
      priority,
      completed: false,
      dueDate: dueDate!,
    });

    onClose();
  };

  // 유효성 검사
  const isValid = content.trim().length > 0 && dueDate !== undefined;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>할 일 추가</DialogTitle>
          <DialogDescription>
            새로운 할 일을 추가하세요. 내용과 마감일은 필수입니다.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* 내용 입력 */}
          <div className="grid gap-2">
            <label htmlFor="content" className="text-sm font-medium">
              내용 <span className="text-red-500">*</span>
            </label>
            <Textarea
              id="content"
              placeholder="할 일을 입력하세요..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={3}
              maxLength={500}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground text-right">
              {content.length}/500
            </p>
          </div>

          {/* 우선순위 선택 */}
          <div className="grid gap-2">
            <label htmlFor="priority" className="text-sm font-medium">
              우선순위
            </label>
            <Select
              value={priority}
              onValueChange={(value) => setPriority(value as Priority)}
            >
              <SelectTrigger id="priority">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high">
                  <div className="flex items-center gap-2">
                    <span className="text-red-500">●</span>
                    <span>높음</span>
                    <span className="text-xs text-muted-foreground">‼️</span>
                  </div>
                </SelectItem>
                <SelectItem value="medium">
                  <div className="flex items-center gap-2">
                    <span className="text-amber-500">●</span>
                    <span>보통</span>
                    <span className="text-xs text-muted-foreground">⚠️</span>
                  </div>
                </SelectItem>
                <SelectItem value="low">
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">●</span>
                    <span>낮음</span>
                    <span className="text-xs text-muted-foreground">✅</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 마감일 선택 */}
          <div className="grid gap-2">
            <label htmlFor="dueDate" className="text-sm font-medium">
              마감일 <span className="text-red-500">*</span>
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="dueDate"
                  variant="outline"
                  className={cn(
                    'justify-start text-left font-normal',
                    !dueDate && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? (
                    format(dueDate, 'PPP', { locale: ko })
                  ) : (
                    <span>날짜를 선택하세요</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={setDueDate}
                  initialFocus
                  locale={ko}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            취소
          </Button>
          <Button onClick={handleSubmit} disabled={!isValid}>
            추가
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
