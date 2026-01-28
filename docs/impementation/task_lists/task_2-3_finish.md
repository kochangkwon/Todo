# Task 2.3: hooks/use-todos.ts 커스텀 훅 개발

## 단계
**단계 2: 데이터 스키마 및 상태 관리 (Business Logic)**

## 설명
할 일 관리를 위한 커스텀 훅을 개발합니다.

## 체크리스트
- [ ] useTodos 커스텀 훅 생성
- [ ] 할 일 추가 로직 구현
- [ ] 할 일 삭제 로직 구현
- [ ] 할 일 수정 로직 구현
- [ ] 상태 토글(완료/미완료) 로직 구현
- [ ] LocalStorage 연동
- [ ] 데이터 영속성 처리

## 주요 기능
- addTodo: 새로운 할 일 추가
- deleteTodo: 할 일 삭제
- updateTodo: 할 일 수정
- toggleTodo: 완료 상태 토글
- LocalStorage에 데이터 저장 및 불러오기

## 참고사항
- useState와 useEffect를 활용하세요
- LocalStorage 작업 시 try-catch로 에러 처리 필요
