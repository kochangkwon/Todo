'use client';

/**
 * TodoStats 컴포넌트 사용 예제
 */

import { useState } from 'react';
import { TodoStats } from './TodoStats';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Minus, CheckCircle, Circle } from 'lucide-react';

export function TodoStatsExample() {
  const [total, setTotal] = useState(10);
  const [completed, setCompleted] = useState(6);

  const incomplete = total - completed;

  const handleAddTotal = () => setTotal((prev) => prev + 1);
  const handleRemoveTotal = () => setTotal((prev) => Math.max(0, prev - 1));
  const handleAddCompleted = () =>
    setCompleted((prev) => Math.min(prev + 1, total));
  const handleRemoveCompleted = () =>
    setCompleted((prev) => Math.max(0, prev - 1));

  return (
    <div className="space-y-6">
      {/* TodoStats 컴포넌트 */}
      <TodoStats total={total} completed={completed} incomplete={incomplete} />

      {/* 컨트롤 패널 */}
      <Card className="glass border-0 shadow-2xl">
        <CardHeader>
          <CardTitle>테스트 컨트롤</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 전체 할 일 조정 */}
          <div className="flex items-center justify-between p-4 bg-neutral-100 rounded-lg">
            <div className="flex items-center gap-2">
              <Circle className="w-5 h-5 text-neutral-600" />
              <span className="font-medium">전체 할 일: {total}</span>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRemoveTotal}
                disabled={total === 0}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleAddTotal}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* 완료 조정 */}
          <div className="flex items-center justify-between p-4 bg-success/10 rounded-lg">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-success" />
              <span className="font-medium">완료: {completed}</span>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRemoveCompleted}
                disabled={completed === 0}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddCompleted}
                disabled={completed >= total}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* 빠른 테스트 시나리오 */}
          <div className="space-y-2">
            <p className="text-sm font-medium">빠른 시나리오:</p>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setTotal(0);
                  setCompleted(0);
                }}
              >
                비어있음
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setTotal(10);
                  setCompleted(0);
                }}
              >
                시작 (0%)
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setTotal(10);
                  setCompleted(5);
                }}
              >
                중간 (50%)
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setTotal(10);
                  setCompleted(8);
                }}
              >
                거의 완료 (80%)
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setTotal(10);
                  setCompleted(10);
                }}
              >
                완료 (100%)
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 사용 예제 코드 */}
      <Card className="glass border-0 shadow-2xl">
        <CardHeader>
          <CardTitle>사용 방법</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="text-xs bg-neutral-900 text-neutral-100 p-4 rounded-lg overflow-x-auto">
            {`import { TodoStats } from '@/components/todo/TodoStats';
import { useTodos } from '@/hooks/use-todos';

function MyComponent() {
  const { stats } = useTodos();

  return (
    <TodoStats
      total={stats.total}
      completed={stats.completed}
      incomplete={stats.incomplete}
    />
  );
}`}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
