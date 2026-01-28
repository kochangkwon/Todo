'use client';

import { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

/**
 * Confetti 축하 효과 커스텀 훅
 */
export function useConfetti(shouldTrigger: boolean) {
  const hasTriggeredRef = useRef(false);

  useEffect(() => {
    if (shouldTrigger && !hasTriggeredRef.current) {
      // 축하 효과 트리거
      triggerConfetti();
      hasTriggeredRef.current = true;

      // 3초 후 플래그 리셋 (다시 트리거 가능하도록)
      const timer = setTimeout(() => {
        hasTriggeredRef.current = false;
      }, 3000);

      return () => clearTimeout(timer);
    } else if (!shouldTrigger) {
      // 조건이 해제되면 플래그 리셋
      hasTriggeredRef.current = false;
    }
  }, [shouldTrigger]);
}

/**
 * Confetti 효과 트리거 함수
 */
function triggerConfetti() {
  const count = 200;
  const defaults = {
    origin: { y: 0.7 },
  };

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    });
  }

  // 여러 방향에서 발사
  fire(0.25, {
    spread: 26,
    startVelocity: 55,
  });

  fire(0.2, {
    spread: 60,
  });

  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  });
}

/**
 * 간단한 Confetti 효과
 */
export function triggerSimpleConfetti() {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
  });
}

/**
 * 폭죽 효과
 */
export function triggerFireworks() {
  const duration = 3000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

  function randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  const interval = setInterval(() => {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      clearInterval(interval);
      return;
    }

    const particleCount = 50 * (timeLeft / duration);

    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
    });
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
    });
  }, 250);
}
