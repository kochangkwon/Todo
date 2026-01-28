import * as React from 'react';

/**
 * Hydration 오류 방지를 위한 유틸리티 함수들
 *
 * Next.js의 서버 사이드 렌더링(SSR)과 클라이언트 사이드 렌더링(CSR) 간의
 * 불일치를 방지하여 Hydration 오류를 예방합니다.
 */

/**
 * 클라이언트 환경인지 확인
 */
export function isClient(): boolean {
  return typeof window !== 'undefined';
}

/**
 * 서버 환경인지 확인
 */
export function isServer(): boolean {
  return typeof window === 'undefined';
}

/**
 * 안전하게 LocalStorage에서 값 가져오기
 *
 * @param key - LocalStorage 키
 * @param defaultValue - 기본값 (선택사항)
 * @returns 저장된 값 또는 기본값
 */
export function safeGetLocalStorage<T = string>(
  key: string,
  defaultValue?: T
): T | null {
  if (isServer()) {
    return defaultValue ?? null;
  }

  try {
    const item = window.localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : (defaultValue ?? null);
  } catch (error) {
    console.error(`Error reading localStorage key "${key}":`, error);
    return defaultValue ?? null;
  }
}

/**
 * 안전하게 LocalStorage에 값 저장하기
 *
 * @param key - LocalStorage 키
 * @param value - 저장할 값
 * @returns 성공 여부
 */
export function safeSetLocalStorage<T>(key: string, value: T): boolean {
  if (isServer()) {
    return false;
  }

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error setting localStorage key "${key}":`, error);
    return false;
  }
}

/**
 * 안전하게 LocalStorage에서 값 삭제하기
 *
 * @param key - LocalStorage 키
 * @returns 성공 여부
 */
export function safeRemoveLocalStorage(key: string): boolean {
  if (isServer()) {
    return false;
  }

  try {
    window.localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing localStorage key "${key}":`, error);
    return false;
  }
}

/**
 * LocalStorage 사용 가능 여부 확인
 *
 * 일부 브라우저는 프라이빗 모드에서 LocalStorage를 비활성화합니다.
 */
export function isLocalStorageAvailable(): boolean {
  if (isServer()) {
    return false;
  }

  try {
    const testKey = '__localStorage_test__';
    window.localStorage.setItem(testKey, 'test');
    window.localStorage.removeItem(testKey);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Hydration safe 컴포넌트 래퍼
 *
 * 컴포넌트가 클라이언트에서만 렌더링되도록 보장합니다.
 *
 * @example
 * ```tsx
 * import { ClientOnly } from '@/lib/utils/hydration';
 *
 * function MyComponent() {
 *   return (
 *     <ClientOnly fallback={<div>Loading...</div>}>
 *       <div>{localStorage.getItem('key')}</div>
 *     </ClientOnly>
 *   );
 * }
 * ```
 */
export function ClientOnly({
  children,
  fallback = null,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}): React.ReactNode {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return fallback;
  }

  return children;
}
