import { z } from 'zod';

/**
 * 우선순위 스키마
 */
export const prioritySchema = z.enum(['low', 'medium', 'high'], {
  message: '우선순위는 낮음, 보통, 높음 중 하나여야 합니다.',
});

/**
 * Todo 생성 스키마
 */
export const createTodoSchema = z.object({
  content: z
    .string({
      message: '할 일 내용은 텍스트여야 합니다.',
    })
    .min(1, { message: '할 일 내용을 최소 1자 이상 입력해주세요.' })
    .max(500, { message: '할 일 내용은 500자를 초과할 수 없습니다.' })
    .trim(),

  priority: prioritySchema,

  completed: z.boolean().default(false),
});

/**
 * Todo 업데이트 스키마 (모든 필드가 선택적)
 */
export const updateTodoSchema = z.object({
  content: z
    .string()
    .min(1, { message: '할 일 내용을 최소 1자 이상 입력해주세요.' })
    .max(500, { message: '할 일 내용은 500자를 초과할 수 없습니다.' })
    .trim()
    .optional(),

  priority: prioritySchema.optional(),

  completed: z.boolean().optional(),
});

/**
 * Todo ID 스키마
 */
export const todoIdSchema = z.string().uuid({ message: '유효하지 않은 Todo ID 형식입니다.' });

/**
 * Todo 전체 스키마 (Import 검증용)
 */
export const todoSchema = z.object({
  id: z.string(),
  content: z.string().min(1).max(500),
  completed: z.boolean(),
  priority: prioritySchema,
  createdAt: z.union([z.string(), z.date()]),
});

/**
 * Import 데이터 스키마
 */
export const importDataSchema = z.object({
  version: z.string().optional(),
  exportedAt: z.string().optional(),
  todos: z.array(todoSchema),
});

/**
 * Zod 스키마에서 타입 추론
 */
export type CreateTodoSchema = z.infer<typeof createTodoSchema>;
export type UpdateTodoSchema = z.infer<typeof updateTodoSchema>;
export type PrioritySchema = z.infer<typeof prioritySchema>;
export type TodoSchema = z.infer<typeof todoSchema>;
export type ImportDataSchema = z.infer<typeof importDataSchema>;
