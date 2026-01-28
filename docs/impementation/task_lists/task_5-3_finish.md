# Task 5.3: 전체 완료 시 축하 효과

## 단계
**단계 5: 고도화 및 UX 디테일 (Advanced UX)**

## 설명
모든 할 일을 완료했을 때 Canvas-confetti 라이브러리를 이용한 축하 효과를 구현합니다.

## 체크리스트
- [ ] canvas-confetti 라이브러리 설치
- [ ] 전체 완료 감지 로직 구현
- [ ] confetti 효과 트리거
- [ ] 효과 커스터마이징

## 명령어
```bash
npm install canvas-confetti
npm install --save-dev @types/canvas-confetti
```

## 주요 기능
- 모든 할 일 완료 시 자동으로 축하 효과
- 화면에 confetti(색종이) 효과 표시
- 사용자의 성취감 증대

## 참고사항
- useEffect로 완료 상태 감지
- confetti 옵션으로 효과 조절 가능
- 할 일이 1개 이상일 때만 작동하도록 처리
