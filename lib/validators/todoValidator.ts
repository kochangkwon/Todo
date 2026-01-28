import {
  createTodoSchema,
  updateTodoSchema,
  todoIdSchema,
  type CreateTodoSchema,
  type UpdateTodoSchema
} from '@/lib/schemas/todoSchema';
import { ZodError } from 'zod';

/**
 * 검증 결과 타입
 */
export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; errors: Record<string, string[]> };

/**
 * Zod 에러를 사용자 친화적인 형태로 변환
 */
function formatZodError(error: ZodError): Record<string, string[]> {
  const formattedErrors: Record<string, string[]> = {};

  error.issues.forEach((issue) => {
    const path = issue.path.join('.');
    if (!formattedErrors[path]) {
      formattedErrors[path] = [];
    }
    formattedErrors[path].push(issue.message);
  });

  return formattedErrors;
}

/**
 * Todo 생성 데이터 검증
 */
export function validateCreateTodo(data: unknown): ValidationResult<CreateTodoSchema> {
  try {
    const validated = createTodoSchema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, errors: formatZodError(error) };
    }
    return {
      success: false,
      errors: { _general: ['알 수 없는 오류가 발생했습니다.'] }
    };
  }
}

/**
 * Todo 업데이트 데이터 검증
 */
export function validateUpdateTodo(data: unknown): ValidationResult<UpdateTodoSchema> {
  try {
    const validated = updateTodoSchema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, errors: formatZodError(error) };
    }
    return {
      success: false,
      errors: { _general: ['알 수 없는 오류가 발생했습니다.'] }
    };
  }
}

/**
 * Todo ID 검증
 */
export function validateTodoId(id: unknown): ValidationResult<string> {
  try {
    const validated = todoIdSchema.parse(id);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, errors: formatZodError(error) };
    }
    return {
      success: false,
      errors: { _general: ['유효하지 않은 ID입니다.'] }
    };
  }
}

/**
 * 안전한 파싱 (타입 가드)
 */
export function isSafeCreateTodo(data: unknown): data is CreateTodoSchema {
  return createTodoSchema.safeParse(data).success;
}

export function isSafeUpdateTodo(data: unknown): data is UpdateTodoSchema {
  return updateTodoSchema.safeParse(data).success;
}
