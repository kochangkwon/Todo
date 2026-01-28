'use client';

import { useState, useEffect, useCallback } from 'react';
import { Todo, CreateTodoInput, UpdateTodoInput } from '@/types/todo';
import { importDataSchema } from '@/lib/schemas/todoSchema';

const STORAGE_KEY = 'premium-todos';

/**
 * LocalStorage에서 Todo 목록 불러오기
 */
function loadTodosFromStorage(): Todo[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return [];
    }

    const parsed = JSON.parse(stored);
    // Date 객체로 변환
    return parsed.map((todo: any) => ({
      ...todo,
      createdAt: new Date(todo.createdAt),
    }));
  } catch (error) {
    console.error('Failed to load todos from localStorage:', error);
    return [];
  }
}

/**
 * LocalStorage에 Todo 목록 저장
 */
function saveTodosToStorage(todos: Todo[]): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch (error) {
    console.error('Failed to save todos to localStorage:', error);
  }
}

/**
 * 할 일 관리 커스텀 훅
 */
export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // 초기 로딩
  useEffect(() => {
    const loadedTodos = loadTodosFromStorage();
    setTodos(loadedTodos);
    setIsLoaded(true);
  }, []);

  // 상태 변경 시 LocalStorage에 저장
  useEffect(() => {
    if (isLoaded) {
      saveTodosToStorage(todos);
    }
  }, [todos, isLoaded]);

  /**
   * 새로운 할 일 추가
   */
  const addTodo = useCallback((input: CreateTodoInput) => {
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      ...input,
      createdAt: new Date(),
    };

    setTodos((prev) => [newTodo, ...prev]);
    return newTodo;
  }, []);

  /**
   * 할 일 삭제
   */
  const deleteTodo = useCallback((id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  }, []);

  /**
   * 할 일 수정
   */
  const updateTodo = useCallback((id: string, updates: UpdateTodoInput) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id
          ? { ...todo, ...updates }
          : todo
      )
    );
  }, []);

  /**
   * 완료 상태 토글
   */
  const toggleTodo = useCallback((id: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id
          ? { ...todo, completed: !todo.completed }
          : todo
      )
    );
  }, []);

  /**
   * 특정 할 일 찾기
   */
  const getTodoById = useCallback(
    (id: string): Todo | undefined => {
      return todos.find((todo) => todo.id === id);
    },
    [todos]
  );

  /**
   * 모든 할 일 삭제
   */
  const clearAllTodos = useCallback(() => {
    setTodos([]);
  }, []);

  /**
   * 완료된 할 일만 삭제
   */
  const clearCompletedTodos = useCallback(() => {
    setTodos((prev) => prev.filter((todo) => !todo.completed));
  }, []);

  /**
   * 할 일 목록을 JSON 파일로 내보내기
   */
  const exportTodos = useCallback(() => {
    const exportData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      todos: todos,
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `todos-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [todos]);

  /**
   * JSON 파일에서 할 일 목록 가져오기
   */
  const importTodos = useCallback((file: File): Promise<void> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const parsed = JSON.parse(content);

          // Zod로 데이터 유효성 검증
          const validationResult = importDataSchema.safeParse(parsed);

          if (!validationResult.success) {
            throw new Error('Invalid data format. Please check the file structure.');
          }

          // Date 객체로 변환
          const importedTodos: Todo[] = validationResult.data.todos.map((todo) => ({
            ...todo,
            createdAt: new Date(todo.createdAt),
          }));

          setTodos(importedTodos);
          resolve();
        } catch (error) {
          if (error instanceof Error) {
            reject(error);
          } else {
            reject(new Error('Failed to import todos. Please check the file format.'));
          }
        }
      };

      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };

      reader.readAsText(file);
    });
  }, []);

  // 통계 계산
  const stats = {
    total: todos.length,
    completed: todos.filter((todo) => todo.completed).length,
    incomplete: todos.filter((todo) => !todo.completed).length,
    byPriority: {
      high: todos.filter((todo) => todo.priority === 'high').length,
      medium: todos.filter((todo) => todo.priority === 'medium').length,
      low: todos.filter((todo) => todo.priority === 'low').length,
    },
  };

  return {
    todos,
    isLoaded,
    addTodo,
    deleteTodo,
    updateTodo,
    toggleTodo,
    getTodoById,
    clearAllTodos,
    clearCompletedTodos,
    exportTodos,
    importTodos,
    stats,
  };
}

export type UseTodosReturn = ReturnType<typeof useTodos>;
