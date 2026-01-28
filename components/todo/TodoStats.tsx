'use client';

import { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, Circle, Target, TrendingUp } from 'lucide-react';
import { useConfetti } from '@/hooks/use-confetti';

interface TodoStatsProps {
  total: number;
  completed: number;
  incomplete: number;
}

/**
 * 할 일 통계 컴포넌트
 *
 * 전체/완료/미완료 개수와 달성률을 시각적으로 표시합니다.
 */
export function TodoStats({ total, completed, incomplete }: TodoStatsProps) {
  /**
   * 달성률 계산 (0-100%)
   */
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  /**
   * 전체 완료 시 축하 효과
   */
  const shouldCelebrate = completionRate === 100 && total > 0;
  useConfetti(shouldCelebrate);

  /**
   * 달성률 애니메이션을 위한 스프링 값
   */
  const springValue = useSpring(0, {
    stiffness: 100,
    damping: 20,
  });

  const [displayValue, setDisplayValue] = useState(0);

  /**
   * completionRate가 변경될 때마다 springValue 업데이트
   */
  useEffect(() => {
    springValue.set(completionRate);
    const unsubscribe = springValue.on('change', (latest) => {
      setDisplayValue(Math.round(latest));
    });
    return () => unsubscribe();
  }, [completionRate, springValue]);

  /**
   * 통계 숫자 카운팅 애니메이션
   */
  const totalSpring = useSpring(0, { stiffness: 100, damping: 20 });
  const completedSpring = useSpring(0, { stiffness: 100, damping: 20 });
  const incompleteSpring = useSpring(0, { stiffness: 100, damping: 20 });

  const [displayTotal, setDisplayTotal] = useState(0);
  const [displayCompleted, setDisplayCompleted] = useState(0);
  const [displayIncomplete, setDisplayIncomplete] = useState(0);

  useEffect(() => {
    totalSpring.set(total);
    completedSpring.set(completed);
    incompleteSpring.set(incomplete);

    const unsubTotal = totalSpring.on('change', (latest) => {
      setDisplayTotal(Math.round(latest));
    });
    const unsubCompleted = completedSpring.on('change', (latest) => {
      setDisplayCompleted(Math.round(latest));
    });
    const unsubIncomplete = incompleteSpring.on('change', (latest) => {
      setDisplayIncomplete(Math.round(latest));
    });

    return () => {
      unsubTotal();
      unsubCompleted();
      unsubIncomplete();
    };
  }, [total, completed, incomplete, totalSpring, completedSpring, incompleteSpring]);

  /**
   * 달성률에 따른 메시지
   */
  const getMessage = () => {
    if (total === 0) return '할 일을 추가해보세요!';
    if (completionRate === 100) return '모든 할 일을 완료했습니다! 🎉';
    if (completionRate >= 75) return '거의 다 왔어요! 💪';
    if (completionRate >= 50) return '절반 이상 완료했어요!';
    if (completionRate >= 25) return '좋은 시작이에요!';
    return '화이팅! 🚀';
  };

  /**
   * 달성률에 따른 Progress 색상
   */
  const getProgressColor = () => {
    if (completionRate === 100) return 'bg-success';
    if (completionRate >= 75) return 'bg-brand-primary';
    if (completionRate >= 50) return 'bg-brand-secondary';
    return 'bg-brand-accent';
  };

  return (
    <div className="glass rounded-2xl p-6 shadow-2xl">
      <div className="space-y-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Target className="w-5 h-5 text-brand-primary" />
            진행 상황
          </h2>
          <div className="flex items-center gap-1 text-sm font-medium">
            <TrendingUp className="w-4 h-4 text-brand-primary" />
            <motion.span className="text-2xl font-bold text-brand-primary">
              {displayValue}%
            </motion.span>
          </div>
        </div>

        {/* 프로그레스 바 */}
        <div className="space-y-2">
          <motion.div
            animate={
              completionRate === 100
                ? {
                    scale: [1, 1.02, 1],
                    filter: [
                      'drop-shadow(0 0 0px rgba(34, 197, 94, 0))',
                      'drop-shadow(0 0 8px rgba(34, 197, 94, 0.6))',
                      'drop-shadow(0 0 0px rgba(34, 197, 94, 0))',
                    ],
                  }
                : {}
            }
            transition={{
              duration: 2,
              repeat: completionRate === 100 ? Infinity : 0,
              ease: 'easeInOut',
            }}
          >
            <Progress
              value={completionRate}
              className="h-3"
              indicatorClassName={getProgressColor()}
            />
          </motion.div>
          <p className="text-sm text-neutral-600 text-center">
            {getMessage()}
          </p>
        </div>

        {/* 통계 카운터 */}
        <div className="grid grid-cols-3 gap-4">
          {/* 전체 */}
          <motion.div
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
          >
            <Card className="bg-white/50 backdrop-blur-sm border-neutral-200 cursor-pointer">
              <CardContent className="p-4 text-center">
                <div className="flex flex-col items-center gap-2">
                  <Circle className="w-5 h-5 text-neutral-500" />
                  <div>
                    <motion.p className="text-2xl font-bold text-neutral-900">
                      {displayTotal}
                    </motion.p>
                    <p className="text-xs text-neutral-600">전체</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* 완료 */}
          <motion.div
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
          >
            <Card className="bg-success/10 backdrop-blur-sm border-success/30 cursor-pointer">
              <CardContent className="p-4 text-center">
                <div className="flex flex-col items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-success" />
                  <div>
                    <motion.p className="text-2xl font-bold text-success">
                      {displayCompleted}
                    </motion.p>
                    <p className="text-xs text-success/80">완료</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* 미완료 */}
          <motion.div
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
          >
            <Card className="bg-brand-primary/10 backdrop-blur-sm border-brand-primary/30 cursor-pointer">
              <CardContent className="p-4 text-center">
                <div className="flex flex-col items-center gap-2">
                  <Circle className="w-5 h-5 text-brand-primary" />
                  <div>
                    <motion.p className="text-2xl font-bold text-brand-primary">
                      {displayIncomplete}
                    </motion.p>
                    <p className="text-xs text-brand-primary/80">남은 일</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
