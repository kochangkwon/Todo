'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Upload, Database, CheckCircle, XCircle } from 'lucide-react';

interface TodoBackupProps {
  onExport: () => void;
  onImport: (file: File) => Promise<void>;
}

/**
 * 할 일 백업/복원 컴포넌트
 *
 * JSON 파일로 내보내기 및 가져오기 기능을 제공합니다.
 */
export function TodoBackup({ onExport, onImport }: TodoBackupProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState<string>('');

  /**
   * Export 버튼 클릭 핸들러
   */
  const handleExport = () => {
    onExport();
    setImportStatus('success');
    setStatusMessage('파일이 다운로드되었습니다!');
    setTimeout(() => {
      setImportStatus('idle');
      setStatusMessage('');
    }, 3000);
  };

  /**
   * Import 버튼 클릭 핸들러
   */
  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  /**
   * 파일 선택 핸들러
   */
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setImportStatus('idle');
      setStatusMessage('');
      await onImport(file);
      setImportStatus('success');
      setStatusMessage('할 일 목록을 성공적으로 가져왔습니다!');
      setTimeout(() => {
        setImportStatus('idle');
        setStatusMessage('');
      }, 3000);
    } catch (error) {
      setImportStatus('error');
      setStatusMessage(
        error instanceof Error ? error.message : '파일을 가져오는데 실패했습니다.'
      );
      setTimeout(() => {
        setImportStatus('idle');
        setStatusMessage('');
      }, 5000);
    }

    // 파일 입력 초기화 (같은 파일을 다시 선택할 수 있도록)
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card className="glass border-0 shadow-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="w-5 h-5 text-brand-primary" />
          데이터 백업
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 설명 */}
        <p className="text-sm text-neutral-600">
          할 일 목록을 JSON 파일로 내보내거나 가져올 수 있습니다.
        </p>

        {/* 버튼들 */}
        <div className="grid grid-cols-2 gap-3">
          {/* Export 버튼 */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
          >
            <Button
              onClick={handleExport}
              className="w-full bg-brand-primary hover:bg-brand-primary/90"
            >
              <Download className="w-4 h-4 mr-2" />
              내보내기
            </Button>
          </motion.div>

          {/* Import 버튼 */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
          >
            <Button
              onClick={handleImportClick}
              variant="outline"
              className="w-full"
            >
              <Upload className="w-4 h-4 mr-2" />
              가져오기
            </Button>
          </motion.div>
        </div>

        {/* 숨겨진 파일 입력 */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* 상태 메시지 */}
        {importStatus !== 'idle' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`flex items-center gap-2 p-3 rounded-lg text-sm ${
              importStatus === 'success'
                ? 'bg-success/10 text-success'
                : 'bg-error/10 text-error'
            }`}
          >
            {importStatus === 'success' ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <XCircle className="w-4 h-4" />
            )}
            <span>{statusMessage}</span>
          </motion.div>
        )}

        {/* 안내 사항 */}
        <div className="text-xs text-neutral-500 space-y-1 pt-2 border-t border-neutral-200">
          <p>• <strong>내보내기:</strong> 현재 할 일 목록을 JSON 파일로 저장합니다.</p>
          <p>• <strong>가져오기:</strong> 백업한 JSON 파일에서 할 일 목록을 복원합니다.</p>
          <p className="text-warning">⚠️ 가져오기 시 현재 목록이 대체됩니다.</p>
        </div>
      </CardContent>
    </Card>
  );
}
