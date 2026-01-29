'use client';

/**
 * Layout 애니메이션 데모 예제
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { TodoList } from './TodoList';
import { TodoInput } from './TodoInput';
import { TodoStats } from './TodoStats';
import { ConfettiButton } from './ConfettiButton';
import { Todo, Priority } from '@/types/todo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, Shuffle } from 'lucide-react';

export function TodoLayoutExample() {
  const [todos, setTodos] = useState<Todo[]>([
    {
      id: '1',
      content: '프로젝트 기획서 작성',
      completed: false,
      priority: 'high',
      createdAt: new Date('2024-01-15'),
      dueDate: new Date('2024-01-15'),
    },
    {
      id: '2',
      content: '디자인 시안 검토',
      completed: true,
      priority: 'medium',
      createdAt: new Date('2024-01-16'),
      dueDate: new Date('2024-01-16'),
    },
    {
      id: '3',
      content: '코드 리뷰',
      completed: false,
      priority: 'high',
      createdAt: new Date('2024-01-14'),
      dueDate: new Date('2024-01-14'),
    },
    {
      id: '4',
      content: '팀 미팅',
      completed: false,
      priority: 'low',
      createdAt: new Date('2024-01-17'),
      dueDate: new Date('2024-01-17'),
    },
    {
      id: '5',
      content: '문서 업데이트',
      completed: true,
      priority: 'low',
      createdAt: new Date('2024-01-13'),
      dueDate: new Date('2024-01-13'),
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

  /**
   * 우선순위로 정렬
   */
  const handleSortByPriority = () => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    setTodos((prev) =>
      [...prev].sort(
        (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
      )
    );
  };

  /**
   * 생성 날짜로 정렬
   */
  const handleSortByDate = () => {
    setTodos((prev) =>
      [...prev].sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
      )
    );
  };

  /**
   * 순서 섞기
   */
  const handleShuffle = () => {
    setTodos((prev) => {
      const shuffled = [...prev];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    });
  };

  /**
   * 완료 항목을 맨 아래로
   */
  const handleMoveCompletedToBottom = () => {
    setTodos((prev) => {
      const incomplete = prev.filter((t) => !t.completed);
      const completed = prev.filter((t) => t.completed);
      return [...incomplete, ...completed];
    });
  };

  const stats = {
    total: todos.length,
    completed: todos.filter((t) => t.completed).length,
    incomplete: todos.filter((t) => !t.completed).length,
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <Card className="glass border-0 shadow-2xl bg-gradient-to-r from-brand-primary/10 to-brand-secondary/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowUpDown className="w-5 h-5 text-brand-primary" />
            Layout 애니메이션 데모
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-neutral-600">
            항목을 추가/삭제하거나 순서를 변경하면서 부드러운 레이아웃 전환을
            확인하세요.
          </p>
        </CardContent>
      </Card>

      {/* 레이아웃 조작 컨트롤 */}
      <Card className="glass border-0 shadow-2xl">
        <CardHeader>
          <CardTitle>레이아웃 조작</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            >
              <Button onClick={handleSortByPriority} size="sm" variant="outline" className="w-full">
                <ArrowUpDown className="w-4 h-4 mr-1" />
                우선순위 정렬
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            >
              <Button onClick={handleSortByDate} size="sm" variant="outline" className="w-full">
                <ArrowUpDown className="w-4 h-4 mr-1" />
                날짜 정렬
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            >
              <Button onClick={handleShuffle} size="sm" variant="outline" className="w-full">
                <Shuffle className="w-4 h-4 mr-1" />
                순서 섞기
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            >
              <Button
                onClick={handleMoveCompletedToBottom}
                size="sm"
                variant="outline"
                className="w-full"
              >
                완료 항목 맨 아래로
              </Button>
            </motion.div>
          </div>

          {/* Confetti 테스트 버튼 */}
          <div className="flex justify-center pt-3 border-t border-neutral-200">
            <ConfettiButton />
          </div>

          <div className="text-xs text-neutral-600 space-y-1 mt-3">
            <p>
              • <strong>정렬/순서 변경:</strong> 항목들이 스프링 애니메이션으로
              부드럽게 이동
            </p>
            <p>
              • <strong>필터 전환:</strong> 탭을 변경하면 항목들이 재배치됨
            </p>
            <p>
              • <strong>LayoutGroup:</strong> 여러 컴포넌트 간 레이아웃 동기화
            </p>
            <p>
              • <strong>마이크로 인터랙션:</strong> 버튼 호버/클릭 시 스케일 효과
            </p>
            <p>
              • <strong>프로그레스 바:</strong> 달성률 변경 시 부드러운 애니메이션
            </p>
            <p>
              • <strong>축하 효과:</strong> 모든 할 일 완료 시 Confetti 자동 실행
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 통계 */}
      <TodoStats
        total={stats.total}
        completed={stats.completed}
        incomplete={stats.incomplete}
      />

      {/* TodoInput */}
      <TodoInput onAddTodo={handleAddTodo} />

      {/* TodoList with Layout Animations */}
      <TodoList todos={todos} onToggle={handleToggle} onDelete={handleDelete} />

      {/* Layout 설정 설명 */}
      <Card className="glass border-0 shadow-2xl">
        <CardHeader>
          <CardTitle>적용된 Layout 설정</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold mb-2">
                1. layout 프로퍼티 (TodoItem)
              </h4>
              <ul className="text-xs space-y-1 text-neutral-600">
                <li>
                  • <code>layout</code>: 자동으로 위치/크기 변화를 감지하고
                  애니메이션
                </li>
                <li>
                  • 스프링 애니메이션: stiffness 300, damping 30
                </li>
                <li>• 더 탄력있고 자연스러운 움직임</li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-2">
                2. LayoutGroup (TodoList)
              </h4>
              <ul className="text-xs space-y-1 text-neutral-600">
                <li>
                  • 탭 전환 시에도 항목들의 레이아웃 변화가 동기화됨
                </li>
                <li>• 여러 컴포넌트 간 공유 레이아웃 애니메이션</li>
                <li>• 부드러운 필터 전환 효과</li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-2">
                3. AnimatePresence mode=&quot;popLayout&quot;
              </h4>
              <ul className="text-xs space-y-1 text-neutral-600">
                <li>• 항목 삭제 시 즉시 레이아웃 재계산</li>
                <li>• 나머지 항목들이 빠르게 재배치</li>
                <li>• 부드러운 전환과 성능의 균형</li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-2">
                4. 마이크로 인터랙션 (whileHover/whileTap)
              </h4>
              <ul className="text-xs space-y-1 text-neutral-600">
                <li>• 버튼 호버 시 scale: 1.05~1.1로 확대</li>
                <li>• 버튼 클릭 시 scale: 0.95로 축소 후 복원</li>
                <li>• 체크박스 체크 시 V 마크 드로잉 애니메이션</li>
                <li>• 스프링 애니메이션으로 탄력있는 피드백</li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-2">
                5. 프로그레스 바 애니메이션 (useSpring/useTransform)
              </h4>
              <ul className="text-xs space-y-1 text-neutral-600">
                <li>• 달성률 변경 시 프로그레스 바 부드럽게 이동</li>
                <li>• 숫자 카운팅 애니메이션 (0→100)</li>
                <li>• 100% 달성 시 빛나는 펄스 효과</li>
                <li>• 스프링 기반 자연스러운 전환</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 코드 예제 */}
      <Card className="glass border-0 shadow-2xl">
        <CardHeader>
          <CardTitle>코드 예제</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="text-xs bg-neutral-900 text-neutral-100 p-4 rounded-lg overflow-x-auto">
            {`// TodoItem.tsx - Layout 애니메이션
<motion.div
  layout
  transition={{
    layout: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
    },
  }}
>
  {/* 내용 */}
</motion.div>

// TodoList.tsx - LayoutGroup
<LayoutGroup>
  <AnimatePresence mode="popLayout">
    {todos.map(todo => (
      <TodoItem key={todo.id} {...todo} />
    ))}
  </AnimatePresence>
</LayoutGroup>

// 마이크로 인터랙션 - 버튼
<motion.div
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  transition={{ type: 'spring', stiffness: 400, damping: 15 }}
>
  <Button>추가</Button>
</motion.div>

// 체크박스 - V 마크 드로잉
<svg>
  <motion.path
    d="M3 8L6.5 11.5L13 4.5"
    initial={{ pathLength: 0 }}
    animate={{ pathLength: 1 }}
    transition={{ duration: 0.3 }}
  />
</svg>

// 프로그레스 바 - 숫자 카운팅
const springValue = useSpring(0, { stiffness: 100, damping: 20 });
const displayValue = useTransform(springValue, (latest) => Math.round(latest));

useEffect(() => {
  springValue.set(completionRate);
}, [completionRate]);

<motion.span>{displayValue}%</motion.span>`}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
