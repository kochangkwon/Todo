'use client';

import { motion } from 'framer-motion';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

/**
 * 빈 상태 컴포넌트
 *
 * 할 일이 없을 때 표시되는 친근한 메시지와 Floating 애니메이션
 */
export function EmptyState({ icon, title, description }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      {/* Floating 아이콘 애니메이션 */}
      <motion.div
        className="mb-6"
        animate={{
          y: [0, -12, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {icon}
      </motion.div>

      {/* 타이틀 - 페이드인 애니메이션 */}
      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="text-xl font-bold text-neutral-900 mb-3"
      >
        {title}
      </motion.h3>

      {/* 설명 - 페이드인 애니메이션 */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="text-base text-neutral-600 max-w-md"
      >
        {description}
      </motion.p>

      {/* 장식적인 점들 애니메이션 */}
      <div className="flex gap-2 mt-8">
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className="w-2 h-2 rounded-full bg-brand-primary/30"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: index * 0.2,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}
