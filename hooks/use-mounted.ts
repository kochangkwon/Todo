'use client';

import { useEffect, useState } from 'react';

/**
 * 컴포넌트가 마운트되었는지 확인하는 훅
 *
 * SSR/CSR hydration 불일치를 방지하기 위해 사용됩니다.
 * 서버에서는 false를 반환하고, 클라이언트에서만 true를 반환합니다.
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const isMounted = useMounted();
 *
 *   if (!isMounted) {
 *     return <div>Loading...</div>;
 *   }
 *
 *   // 클라이언트에서만 실행되는 코드
 *   return <div>{localStorage.getItem('key')}</div>;
 * }
 * ```
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}
