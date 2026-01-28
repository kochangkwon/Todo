'use client';

/**
 * Hydration 안전성 예제 컴포넌트
 *
 * 이 컴포넌트는 Next.js에서 LocalStorage를 사용할 때
 * Hydration 오류를 방지하는 여러 패턴을 보여줍니다.
 */

import { useMounted } from '@/hooks/use-mounted';
import { useTodos } from '@/hooks/use-todos';
import { isLocalStorageAvailable } from '@/lib/utils/hydration';

/**
 * 패턴 1: useMounted 훅 사용
 */
export function Pattern1_UseMounted() {
  const isMounted = useMounted();

  // 서버에서는 로딩 상태 표시
  if (!isMounted) {
    return <div className="p-4 border rounded">Loading todos...</div>;
  }

  // 클라이언트에서만 LocalStorage 접근
  const storageAvailable = isLocalStorageAvailable();

  return (
    <div className="p-4 border rounded">
      <h3 className="font-semibold mb-2">Pattern 1: useMounted Hook</h3>
      <p>LocalStorage Available: {storageAvailable ? 'Yes' : 'No'}</p>
    </div>
  );
}

/**
 * 패턴 2: isLoaded 플래그 사용 (useTodos 내장)
 */
export function Pattern2_IsLoadedFlag() {
  const { isLoaded, stats } = useTodos();

  // 로딩 중에는 스켈레톤 UI 또는 로딩 표시
  if (!isLoaded) {
    return (
      <div className="p-4 border rounded animate-pulse">
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className="p-4 border rounded">
      <h3 className="font-semibold mb-2">Pattern 2: isLoaded Flag</h3>
      <p>Total Todos: {stats.total}</p>
      <p>Completed: {stats.completed}</p>
      <p>Incomplete: {stats.incomplete}</p>
    </div>
  );
}

/**
 * 패턴 3: 조건부 렌더링
 */
export function Pattern3_ConditionalRendering() {
  const isMounted = useMounted();
  const { todos } = useTodos();

  return (
    <div className="p-4 border rounded">
      <h3 className="font-semibold mb-2">Pattern 3: Conditional Rendering</h3>

      {/* 서버와 클라이언트 모두에서 항상 렌더링되는 부분 */}
      <p className="text-sm text-gray-600">This is always rendered</p>

      {/* 클라이언트에서만 렌더링되는 부분 */}
      {isMounted && (
        <div className="mt-2">
          <p className="text-sm">Client-only content:</p>
          <p className="text-sm font-mono">
            {todos.length > 0 ? `First todo: ${todos[0].content}` : 'No todos'}
          </p>
        </div>
      )}
    </div>
  );
}

/**
 * 전체 예제 데모
 */
export function HydrationSafeDemo() {
  return (
    <div className="space-y-4 p-4">
      <div>
        <h2 className="text-2xl font-bold mb-4">
          Hydration Safe Patterns
        </h2>
        <p className="text-gray-600 mb-6">
          Next.js에서 LocalStorage를 안전하게 사용하는 3가지 패턴
        </p>
      </div>

      <Pattern1_UseMounted />
      <Pattern2_IsLoadedFlag />
      <Pattern3_ConditionalRendering />

      <div className="p-4 border rounded bg-yellow-50">
        <h3 className="font-semibold mb-2">⚠️ 주의사항</h3>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>LocalStorage는 클라이언트에서만 사용 가능합니다</li>
          <li>
            서버 렌더링 시 LocalStorage 접근하면 Hydration 오류 발생
          </li>
          <li>
            mounted 플래그나 isLoaded 플래그로 클라이언트 확인 필수
          </li>
          <li>초기 로딩 상태에 대한 UI 제공 권장</li>
        </ul>
      </div>
    </div>
  );
}
