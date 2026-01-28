# Hydration 오류 방지 가이드

Next.js에서 LocalStorage를 사용할 때 Hydration 오류를 방지하는 방법을 설명합니다.

## Hydration 오류란?

Hydration 오류는 서버에서 생성된 HTML과 클라이언트에서 렌더링된 React 컴포넌트가 일치하지 않을 때 발생합니다.

### 문제 상황

```tsx
// ❌ 잘못된 예제 - Hydration 오류 발생
function BadExample() {
  // 서버: localStorage 접근 불가 → 에러 또는 undefined
  // 클라이언트: localStorage 접근 가능 → 실제 값
  const data = localStorage.getItem('key'); // TypeError: localStorage is not defined

  return <div>{data}</div>;
}
```

서버 렌더링 시 `localStorage`가 존재하지 않아 에러가 발생하거나, 서버와 클라이언트의 결과가 달라 Hydration 오류가 발생합니다.

## 해결 방법

### 1. useMounted 훅 사용

컴포넌트가 클라이언트에서 마운트되었는지 확인합니다.

```tsx
import { useMounted } from '@/hooks/use-mounted';

function GoodExample() {
  const isMounted = useMounted();

  if (!isMounted) {
    return <div>Loading...</div>;
  }

  // 클라이언트에서만 실행
  const data = localStorage.getItem('key');
  return <div>{data}</div>;
}
```

### 2. isLoaded 플래그 사용

`useTodos` 훅의 내장 `isLoaded` 플래그를 활용합니다.

```tsx
import { useTodos } from '@/hooks/use-todos';

function TodoComponent() {
  const { todos, isLoaded } = useTodos();

  if (!isLoaded) {
    return <div>Loading todos...</div>;
  }

  return <div>Total: {todos.length}</div>;
}
```

### 3. 조건부 렌더링

클라이언트 전용 콘텐츠를 조건부로 렌더링합니다.

```tsx
import { useMounted } from '@/hooks/use-mounted';

function MixedContent() {
  const isMounted = useMounted();

  return (
    <div>
      {/* 항상 렌더링 */}
      <h1>Title</h1>

      {/* 클라이언트에서만 렌더링 */}
      {isMounted && (
        <p>{localStorage.getItem('key')}</p>
      )}
    </div>
  );
}
```

### 4. 안전한 유틸리티 함수 사용

제공된 헬퍼 함수를 사용합니다.

```tsx
import { safeGetLocalStorage } from '@/lib/utils/hydration';

function SafeComponent() {
  // 서버에서는 null, 클라이언트에서는 실제 값
  const data = safeGetLocalStorage('key', 'default');

  return <div>{data}</div>;
}
```

## 프로젝트에서의 적용

### useTodos 훅

이미 Hydration 안전성이 구현되어 있습니다:

1. **typeof window 체크**: 서버 환경 감지
2. **isLoaded 플래그**: 초기 로딩 상태 관리
3. **useEffect**: 클라이언트에서만 LocalStorage 접근

```tsx
function useTodos() {
  const [isLoaded, setIsLoaded] = useState(false);

  // 클라이언트에서만 실행
  useEffect(() => {
    const loadedTodos = loadTodosFromStorage();
    setTodos(loadedTodos);
    setIsLoaded(true); // 로딩 완료
  }, []);

  // ...
}
```

### 컴포넌트에서 사용

```tsx
function TodoList() {
  const { todos, isLoaded } = useTodos();

  // 로딩 중 UI
  if (!isLoaded) {
    return <TodoSkeleton />;
  }

  // 실제 데이터 렌더링
  return (
    <div>
      {todos.map(todo => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </div>
  );
}
```

## 체크리스트

- [x] mounted 상태 체크 로직 구현 (`useMounted` 훅)
- [x] useEffect를 이용한 클라이언트 사이드 렌더링 처리
- [x] 초기 로딩 상태 관리 (`isLoaded` 플래그)
- [x] SSR/CSR 불일치 방지 (안전한 유틸리티 함수)

## 주의사항

1. **항상 로딩 상태 제공**: 사용자 경험 향상
2. **typeof window 체크**: 서버 환경 감지
3. **useEffect 사용**: 클라이언트에서만 실행되도록 보장
4. **에러 처리**: try-catch로 LocalStorage 접근 에러 처리

## 참고 자료

- `/hooks/use-mounted.ts` - mounted 상태 확인 훅
- `/hooks/use-todos.ts` - Hydration-safe Todo 관리 훅
- `/lib/utils/hydration.ts` - 안전한 유틸리티 함수
- `/components/examples/HydrationSafeExample.tsx` - 실제 사용 예제
