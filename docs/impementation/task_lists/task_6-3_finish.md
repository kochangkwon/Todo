# Task 6.3: 폰트 및 이미지 최적화

## 단계
**단계 6: 최종 최적화 및 테스트 (QA)**

## 설명
Next/font를 적용하고 폰트 및 이미지를 최적화합니다.

## 체크리스트
- [ ] next/font로 웹 폰트 최적화
- [ ] 폰트 로딩 전략 설정
- [ ] 이미지 최적화 (next/image 사용)
- [ ] FOIT/FOUT 방지
- [ ] 번들 사이즈 확인 및 최적화

## 주요 작업
- Google Fonts를 next/font/google로 로드
- 폰트 display 옵션 설정 (swap 권장)
- 이미지는 next/image 컴포넌트 사용
- 불필요한 의존성 제거

## 참고사항
- next/font는 자동으로 폰트를 최적화합니다
- font-display: swap으로 텍스트 깜빡임 방지
- next build로 번들 사이즈 확인
- lighthouse 점수 확인
