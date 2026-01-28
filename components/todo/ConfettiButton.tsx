'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { triggerFireworks } from '@/hooks/use-confetti';

interface ConfettiButtonProps {
  onClick?: () => void;
}

/**
 * Confetti 효과를 트리거하는 버튼 컴포넌트
 *
 * 데모나 테스트용으로 사용 가능
 */
export function ConfettiButton({ onClick }: ConfettiButtonProps) {
  const handleClick = () => {
    triggerFireworks();
    onClick?.();
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
    >
      <Button
        onClick={handleClick}
        variant="outline"
        size="sm"
        className="bg-gradient-to-r from-brand-primary/10 to-brand-secondary/10 border-brand-primary/30"
      >
        <Sparkles className="w-4 h-4 mr-2" />
        축하하기 🎉
      </Button>
    </motion.div>
  );
}
