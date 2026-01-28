# Empty State 가이드

## 개요
할 일이 없을 때 표시되는 친근한 메시지와 Floating 애니메이션을 구현합니다.

## 주요 기능

### 1. Floating 애니메이션
- 아이콘이 위아래로 부드럽게 떠다니는 효과
- 3초 주기로 무한 반복
- easeInOut 타이밍으로 자연스러운 움직임

### 2. 페이드인 애니메이션
- 컴포넌트 등장 시 scale과 opacity 애니메이션
- 타이틀과 설명이 순차적으로 나타남
- 지연 시간(delay)을 사용하여 단계적 표시

### 3. 필터별 차별화된 메시지

#### 전체 (all)
- 아이콘: Inbox (브랜드 컬러)
- 제목: "아직 할 일이 없어요"
- 설명: "위에서 새로운 할 일을 추가하여 시작해보세요! ✨"

#### 진행중 (active)
- 아이콘: CheckCircle2 (성공 컬러)
- 제목: "🎉 모든 할 일을 완료했습니다!"
- 설명: "정말 대단해요! 새로운 목표를 추가해보세요."

#### 완료 (completed)
- 아이콘: Circle (중립 컬러)
- 제목: "완료된 할 일이 없습니다"
- 설명: "할 일을 체크하면 여기에 표시됩니다."

### 4. 장식 요소
- 하단에 3개의 작은 점 애니메이션
- 펄스 효과로 생동감 부여
- 각 점이 순차적으로 애니메이션

## 코드 예제

### EmptyState 컴포넌트

\`\`\`tsx
import { motion } from 'framer-motion';

export function EmptyState({ icon, title, description }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      {/* Floating 아이콘 */}
      <motion.div
        animate={{
          y: [0, -12, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {icon}
      </motion.div>

      {/* 타이틀 */}
      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        {title}
      </motion.h3>

      {/* 설명 */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        {description}
      </motion.p>

      {/* 장식 점들 */}
      <div className="flex gap-2 mt-8">
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: index * 0.2,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}
\`\`\`

### 사용 예시

\`\`\`tsx
// TodoList.tsx
const getEmptyMessage = () => {
  switch (filter) {
    case 'active':
      return {
        icon: <CheckCircle2 className="w-16 h-16 text-success" />,
        title: '🎉 모든 할 일을 완료했습니다!',
        description: '정말 대단해요! 새로운 목표를 추가해보세요.',
      };
    case 'completed':
      return {
        icon: <Circle className="w-16 h-16 text-neutral-400" />,
        title: '완료된 할 일이 없습니다',
        description: '할 일을 체크하면 여기에 표시됩니다.',
      };
    case 'all':
    default:
      return {
        icon: <Inbox className="w-16 h-16 text-brand-primary" />,
        title: '아직 할 일이 없어요',
        description: '위에서 새로운 할 일을 추가하여 시작해보세요! ✨',
      };
  }
};

const emptyState = getEmptyMessage();

return (
  <EmptyState
    icon={emptyState.icon}
    title={emptyState.title}
    description={emptyState.description}
  />
);
\`\`\`

## 애니메이션 설정

### Floating 효과
- **이동 범위**: y축 -12px ~ 0px
- **지속 시간**: 3초
- **반복**: 무한 반복
- **타이밍**: easeInOut

### 페이드인 효과
- **초기 상태**: opacity: 0, y: 10px
- **최종 상태**: opacity: 1, y: 0px
- **지속 시간**: 0.4초
- **지연 시간**:
  - 타이틀: 0.1초
  - 설명: 0.2초

### 장식 점 펄스 효과
- **스케일**: 1 → 1.2 → 1
- **투명도**: 0.3 → 0.6 → 0.3
- **지속 시간**: 2초
- **순차 지연**: 0.2초씩

## UX 고려사항

1. **친근한 톤**: 이모지와 격려 메시지로 긍정적인 경험 제공
2. **명확한 안내**: 다음 행동을 명확하게 안내
3. **시각적 흥미**: Floating 애니메이션으로 정적인 화면 방지
4. **필터별 맞춤**: 각 상황에 적합한 메시지 제공
5. **성취감 표현**: 완료 시 축하 메시지로 동기 부여

## 파일 구조

\`\`\`
components/
└── todo/
    ├── EmptyState.tsx         # 독립적인 Empty State 컴포넌트
    └── TodoList.tsx           # EmptyState 사용
\`\`\`

## 테스트 시나리오

1. 할 일이 하나도 없을 때 → "아직 할 일이 없어요" 메시지
2. 모든 할 일을 완료했을 때 → "모든 할 일을 완료했습니다!" 메시지
3. 완료 탭에 완료된 항목이 없을 때 → "완료된 할 일이 없습니다" 메시지
4. 아이콘이 부드럽게 떠다니는지 확인
5. 메시지가 순차적으로 나타나는지 확인
