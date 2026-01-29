'use client';

import { useState, useMemo } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  addMonths,
  subMonths,
  isToday,
} from 'date-fns';
import { ko } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Todo, Priority } from '@/types/todo';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TodoCalendarProps {
  todos: Todo[];
  onDateClick?: (date: Date) => void;
  onToggle?: (id: string) => void;
}

/**
 * 우선순위별 설정
 */
const PRIORITY_CONFIG: Record<
  Priority,
  { color: string; bgColor: string; icon: string }
> = {
  high: { color: 'text-red-500', bgColor: 'bg-red-500', icon: '‼️' },
  medium: { color: 'text-amber-500', bgColor: 'bg-amber-500', icon: '⚠️' },
  low: { color: 'text-green-500', bgColor: 'bg-green-500', icon: '✅' },
};

/**
 * 요일 헤더
 */
const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

/**
 * 월 전환 슬라이드 애니메이션 variants
 */
const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
  }),
};

/**
 * 캘린더 뷰 컴포넌트
 *
 * 월별 캘린더 형태로 할 일을 표시합니다.
 */
export function TodoCalendar({
  todos,
  onDateClick,
  onToggle,
}: TodoCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [direction, setDirection] = useState(0);

  /**
   * 캘린더 날짜 배열 생성
   */
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 }); // 일요일 시작
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  }, [currentMonth]);

  /**
   * 날짜별 할 일 그룹화 (성능 최적화)
   */
  const todosByDate = useMemo(() => {
    const map = new Map<string, Todo[]>();

    todos.forEach((todo) => {
      const dateKey = format(todo.dueDate, 'yyyy-MM-dd');
      if (!map.has(dateKey)) {
        map.set(dateKey, []);
      }
      map.get(dateKey)!.push(todo);
    });

    return map;
  }, [todos]);

  /**
   * 특정 날짜의 할 일 가져오기
   */
  const getTodosForDate = (date: Date): Todo[] => {
    const dateKey = format(date, 'yyyy-MM-dd');
    return todosByDate.get(dateKey) || [];
  };

  /**
   * 이전 월로 이동
   */
  const handlePreviousMonth = () => {
    setDirection(-1);
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  /**
   * 다음 월로 이동
   */
  const handleNextMonth = () => {
    setDirection(1);
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  /**
   * 날짜 칸 클릭 핸들러
   */
  const handleDateCellClick = (date: Date) => {
    onDateClick?.(date);
  };

  return (
    <div className="glass dark:glass-dark rounded-2xl p-6 shadow-2xl">
      {/* 헤더: 월 선택 */}
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="outline"
          size="icon"
          onClick={handlePreviousMonth}
          aria-label="이전 월"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <h2 className="text-xl font-bold">
          {format(currentMonth, 'yyyy년 M월', { locale: ko })}
        </h2>

        <Button
          variant="outline"
          size="icon"
          onClick={handleNextMonth}
          aria-label="다음 월"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* 캘린더 그리드 (AnimatePresence로 감싸서 슬라이드 애니메이션) */}
      <div className="relative overflow-hidden">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={format(currentMonth, 'yyyy-MM')}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className="grid grid-cols-7 gap-1"
          >
            {/* 요일 헤더 */}
            {WEEKDAYS.map((day, index) => (
              <div
                key={day}
                className={cn(
                  'text-center font-semibold py-2 text-sm',
                  index === 0 && 'text-red-500', // 일요일
                  index === 6 && 'text-blue-500' // 토요일
                )}
              >
                {day}
              </div>
            ))}

            {/* 날짜 칸 */}
            {calendarDays.map((date) => {
              const dateTodos = getTodosForDate(date);
              const isCurrentMonth = isSameMonth(date, currentMonth);
              const isTodayDate = isToday(date);

              return (
                <motion.div
                  key={date.toISOString()}
                  onClick={() => handleDateCellClick(date)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                  className={cn(
                    'aspect-square border rounded-lg p-2 cursor-pointer transition-colors',
                    'hover:bg-accent hover:border-primary',
                    !isCurrentMonth && 'text-muted-foreground bg-muted/30',
                    isTodayDate && 'bg-primary/10 border-primary font-bold'
                  )}
                >
                  {/* 날짜 숫자 */}
                  <div className="text-sm mb-1">{format(date, 'd')}</div>

                  {/* 할 일 표시 */}
                  <div className="space-y-1">
                    {/* 데스크톱: 할 일 내용 표시 (최대 3개) */}
                    <div className="hidden sm:block space-y-1">
                      {dateTodos.slice(0, 3).map((todo) => (
                        <motion.div
                          key={todo.id}
                          animate={{
                            opacity: todo.completed ? 0.5 : 1,
                          }}
                          transition={{ duration: 0.2 }}
                          className={cn(
                            'text-xs truncate px-1 py-0.5 rounded',
                            PRIORITY_CONFIG[todo.priority].bgColor,
                            'text-white',
                            todo.completed && 'line-through'
                          )}
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggle?.(todo.id);
                          }}
                        >
                          <span className="mr-1">
                            {PRIORITY_CONFIG[todo.priority].icon}
                          </span>
                          {todo.content}
                        </motion.div>
                      ))}
                      {dateTodos.length > 3 && (
                        <div className="text-xs text-muted-foreground text-center">
                          +{dateTodos.length - 3} 더보기
                        </div>
                      )}
                    </div>

                    {/* 모바일: 색상 점으로만 표시 */}
                    <div className="sm:hidden flex flex-wrap gap-1">
                      {dateTodos.slice(0, 6).map((todo) => (
                        <motion.div
                          key={todo.id}
                          animate={{
                            opacity: todo.completed ? 0.3 : 1,
                          }}
                          transition={{ duration: 0.2 }}
                          className={cn(
                            'w-2 h-2 rounded-full',
                            PRIORITY_CONFIG[todo.priority].bgColor
                          )}
                          title={todo.content}
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggle?.(todo.id);
                          }}
                        />
                      ))}
                      {dateTodos.length > 6 && (
                        <div className="text-[10px] text-muted-foreground">
                          +{dateTodos.length - 6}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 범례 */}
      <div className="mt-6 flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <span className={PRIORITY_CONFIG.high.color}>●</span>
          <span>높음 {PRIORITY_CONFIG.high.icon}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={PRIORITY_CONFIG.medium.color}>●</span>
          <span>보통 {PRIORITY_CONFIG.medium.icon}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={PRIORITY_CONFIG.low.color}>●</span>
          <span>낮음 {PRIORITY_CONFIG.low.icon}</span>
        </div>
      </div>
    </div>
  );
}
