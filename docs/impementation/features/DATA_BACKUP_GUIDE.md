# 데이터 백업 가이드

## 개요
할 일 목록을 JSON 파일로 내보내고 가져오는 백업/복원 기능을 구현합니다.

## 주요 기능

### 1. Export (내보내기)
- 현재 할 일 목록을 JSON 파일로 다운로드
- 파일명: `todos-backup-YYYY-MM-DD.json`
- 메타데이터 포함: 버전, 내보낸 시간

### 2. Import (가져오기)
- JSON 파일을 업로드하여 할 일 목록 복원
- Zod를 사용한 데이터 유효성 검증
- 파일 형식 오류 시 사용자 친화적 에러 메시지

### 3. 데이터 검증
- Zod 스키마로 안전한 데이터 파싱
- 잘못된 형식 차단
- 타입 안전성 보장

## 파일 구조

### Export 파일 형식
\`\`\`json
{
  "version": "1.0",
  "exportedAt": "2024-01-28T12:00:00.000Z",
  "todos": [
    {
      "id": "uuid-string",
      "content": "할 일 내용",
      "completed": false,
      "priority": "high",
      "createdAt": "2024-01-28T12:00:00.000Z"
    }
  ]
}
\`\`\`

## 코드 구현

### 1. Export 함수 (hooks/use-todos.ts)

\`\`\`typescript
const exportTodos = useCallback(() => {
  const exportData = {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    todos: todos,
  };

  // JSON 문자열로 변환
  const dataStr = JSON.stringify(exportData, null, 2);

  // Blob 생성
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  // 다운로드 링크 생성 및 클릭
  const link = document.createElement('a');
  link.href = url;
  link.download = \`todos-backup-\${new Date().toISOString().split('T')[0]}.json\`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // URL 정리
  URL.revokeObjectURL(url);
}, [todos]);
\`\`\`

### 2. Import 함수 (hooks/use-todos.ts)

\`\`\`typescript
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
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsText(file);
  });
}, []);
\`\`\`

### 3. Zod 검증 스키마 (lib/schemas/todoSchema.ts)

\`\`\`typescript
// Todo 스키마
export const todoSchema = z.object({
  id: z.string(),
  content: z.string().min(1).max(500),
  completed: z.boolean(),
  priority: prioritySchema,
  createdAt: z.union([z.string(), z.date()]),
});

// Import 데이터 스키마
export const importDataSchema = z.object({
  version: z.string().optional(),
  exportedAt: z.string().optional(),
  todos: z.array(todoSchema),
});
\`\`\`

### 4. UI 컴포넌트 (components/todo/TodoBackup.tsx)

\`\`\`typescript
export function TodoBackup({ onExport, onImport }: TodoBackupProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleExport = () => {
    onExport();
    // 성공 메시지 표시
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await onImport(file);
      setImportStatus('success');
    } catch (error) {
      setImportStatus('error');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>데이터 백업</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Export 버튼 */}
        <Button onClick={handleExport}>내보내기</Button>

        {/* Import 버튼 */}
        <Button onClick={() => fileInputRef.current?.click()}>가져오기</Button>

        {/* 숨겨진 파일 입력 */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* 상태 메시지 */}
        {importStatus !== 'idle' && <StatusMessage status={importStatus} />}
      </CardContent>
    </Card>
  );
}
\`\`\`

## 사용자 경험 (UX)

### 1. 성공 피드백
- Export 성공: "파일이 다운로드되었습니다!"
- Import 성공: "할 일 목록을 성공적으로 가져왔습니다!"
- 3초 후 자동으로 사라지는 메시지

### 2. 에러 처리
- 잘못된 파일 형식: "Invalid data format. Please check the file structure."
- 파일 읽기 실패: "Failed to read file"
- 에러 메시지는 5초 후 사라짐

### 3. 시각적 피드백
- 성공: 초록색 배경 + CheckCircle 아이콘
- 실패: 빨간색 배경 + XCircle 아이콘
- 버튼 hover/tap 애니메이션

### 4. 안전성 경고
- ⚠️ 가져오기 시 현재 목록이 대체됩니다.
- 사용자에게 명확한 안내 제공

## 보안 고려사항

1. **파일 타입 제한**
   - accept=".json"으로 JSON 파일만 허용

2. **데이터 검증**
   - Zod 스키마로 모든 필드 검증
   - 잘못된 데이터 차단

3. **에러 처리**
   - try-catch로 모든 에러 처리
   - 사용자 친화적 메시지

## 브라우저 호환성

### Blob & URL.createObjectURL
- 모든 모던 브라우저 지원
- IE 10+ 지원

### FileReader
- 모든 모던 브라우저 지원
- IE 10+ 지원

## 테스트 시나리오

1. **Export 테스트**
   - 할 일이 있을 때 내보내기
   - 할 일이 없을 때 내보내기
   - 파일명에 날짜 포함 확인

2. **Import 테스트**
   - 유효한 JSON 파일 가져오기
   - 잘못된 형식의 JSON 파일 시도
   - JSON이 아닌 파일 시도
   - 빈 todos 배열 가져오기

3. **UI/UX 테스트**
   - 성공 메시지 표시 확인
   - 에러 메시지 표시 확인
   - 메시지 자동 사라짐 확인
   - 버튼 애니메이션 확인

## 향후 개선 사항

1. **Import 옵션**
   - 덮어쓰기 vs 병합 선택
   - 확인 대화상자 추가

2. **자동 백업**
   - 주기적인 자동 백업
   - 브라우저 스토리지 용량 체크

3. **클라우드 동기화**
   - Google Drive, Dropbox 연동
   - 실시간 동기화

4. **백업 버전 관리**
   - 여러 백업 파일 관리
   - 타임스탬프별 복원
