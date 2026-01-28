# Confetti 축하 효과 가이드

## 개요
모든 할 일을 완료했을 때 canvas-confetti 라이브러리를 사용하여 축하 효과를 자동으로 트리거합니다.

## 설치

```bash
npm install canvas-confetti @types/canvas-confetti
```

## 주요 기능

### 1. 자동 축하 효과
- 모든 할 일을 완료하면 자동으로 confetti 효과 실행
- 할 일이 1개 이상일 때만 작동
- 중복 실행 방지 (3초 쿨다운)

### 2. 여러 스타일의 Confetti

#### 기본 축하 효과 (triggerConfetti)
- 여러 방향에서 발사되는 색종이
- 5단계 연속 발사로 풍성한 효과
- 다양한 속도와 분산도

#### 간단한 효과 (triggerSimpleConfetti)
- 단일 발사
- 빠르고 가벼운 효과

#### 폭죽 효과 (triggerFireworks)
- 3초간 지속되는 연속 효과
- 좌우에서 번갈아 발사
- 페이드 아웃 효과

## 코드 구현

### 1. useConfetti Hook (hooks/use-confetti.ts)

```typescript
export function useConfetti(shouldTrigger: boolean) {
  const hasTriggeredRef = useRef(false);

  useEffect(() => {
    if (shouldTrigger && !hasTriggeredRef.current) {
      // 축하 효과 트리거
      triggerConfetti();
      hasTriggeredRef.current = true;

      // 3초 후 플래그 리셋
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
```

**특징:**
- `useRef`로 중복 실행 방지
- 3초 쿨다운으로 연속 트리거 제한
- 조건 해제 시 자동 리셋

### 2. triggerConfetti 함수

```typescript
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

  // 5단계 연속 발사
  fire(0.25, { spread: 26, startVelocity: 55 });
  fire(0.2, { spread: 60 });
  fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
  fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
  fire(0.1, { spread: 120, startVelocity: 45 });
}
```

**파라미터 설명:**
- `particleCount`: 색종이 개수
- `spread`: 분산 각도 (0-360)
- `startVelocity`: 초기 속도
- `decay`: 감쇠율 (0-1)
- `scalar`: 크기 배율
- `origin`: 발사 위치 { x: 0-1, y: 0-1 }

### 3. TodoStats 컴포넌트 적용

```typescript
export function TodoStats({ total, completed, incomplete }: TodoStatsProps) {
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  // 전체 완료 시 축하 효과
  const shouldCelebrate = completionRate === 100 && total > 0;
  useConfetti(shouldCelebrate);

  // ... rest of component
}
```

**조건:**
- `completionRate === 100`: 달성률 100%
- `total > 0`: 할 일이 1개 이상 존재

### 4. ConfettiButton 컴포넌트 (데모용)

```typescript
export function ConfettiButton({ onClick }: ConfettiButtonProps) {
  const handleClick = () => {
    triggerFireworks();
    onClick?.();
  };

  return (
    <Button onClick={handleClick}>
      <Sparkles className="w-4 h-4 mr-2" />
      축하하기 🎉
    </Button>
  );
}
```

## 사용 예시

### 자동 트리거
```typescript
const shouldCelebrate = completionRate === 100 && total > 0;
useConfetti(shouldCelebrate);
```

### 수동 트리거
```typescript
import { triggerFireworks, triggerSimpleConfetti } from '@/hooks/use-confetti';

// 버튼 클릭 시
<Button onClick={triggerFireworks}>축하하기</Button>

// 특정 이벤트 시
function handleComplete() {
  triggerSimpleConfetti();
}
```

## 커스터마이징

### 색상 변경
```typescript
confetti({
  particleCount: 100,
  spread: 70,
  colors: ['#FF0000', '#00FF00', '#0000FF'],
});
```

### 모양 변경
```typescript
confetti({
  particleCount: 100,
  shapes: ['circle', 'square'],
  ticks: 200,
});
```

### 중력 조절
```typescript
confetti({
  particleCount: 100,
  gravity: 0.5, // 기본값: 1
});
```

### 발사 위치
```typescript
confetti({
  particleCount: 100,
  origin: {
    x: 0.5, // 중앙
    y: 0.3, // 화면 상단
  },
});
```

## UX 고려사항

### 1. 적절한 타이밍
- ✅ 모든 할 일 완료 시 (자동)
- ✅ 사용자가 직접 트리거 (버튼)
- ❌ 페이지 로드 시 (방해됨)
- ❌ 너무 자주 (피로감)

### 2. 성능
- 파티클 수 조절 (200개 적정)
- 지속 시간 제한 (3초 이내)
- 중복 실행 방지

### 3. 접근성
- 선택적 비활성화 옵션 고려
- 움직임 감소 설정 존중
- 시각적 피드백 외 추가 피드백

## 브라우저 호환성

### canvas-confetti
- Chrome: ✅
- Firefox: ✅
- Safari: ✅
- Edge: ✅
- IE: ❌ (미지원)

### Canvas API
- 모든 모던 브라우저 지원
- 하드웨어 가속 지원

## 테스트

### 자동 트리거 테스트
1. 할 일 1개 추가
2. 완료 체크
3. Confetti 효과 확인

### 중복 방지 테스트
1. 할 일 완료
2. Confetti 실행 확인
3. 3초 이내 체크 해제 후 재체크
4. Confetti 미실행 확인
5. 3초 후 재시도 → 실행 확인

### 조건 테스트
1. 할 일 0개 상태에서 완료율 100% → 미실행
2. 할 일 1개 이상 + 완료율 100% → 실행
3. 할 일 1개 이상 + 완료율 99% → 미실행

## 문제 해결

### Confetti가 실행되지 않음
- `canvas-confetti` 설치 확인
- 브라우저 콘솔 에러 확인
- `shouldTrigger` 조건 확인

### Confetti가 너무 자주 실행됨
- `hasTriggeredRef` 플래그 확인
- 쿨다운 시간 조정

### 성능 이슈
- `particleCount` 줄이기
- `ticks` 감소 (지속 시간 단축)
- 효과 간소화

## 향후 개선 사항

1. **사용자 설정**
   - Confetti 효과 on/off 토글
   - 효과 강도 조절

2. **다양한 효과**
   - 테마별 색상
   - 계절별 모양 (눈송이, 하트 등)

3. **사운드 추가**
   - 축하 효과음
   - 볼륨 조절

4. **접근성**
   - `prefers-reduced-motion` 감지
   - 대체 피드백 제공
