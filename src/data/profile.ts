/** 사이트 전체에서 쓰는 프로필·연락처 정보. 이 파일만 고치면 모든 링크가 함께 바뀝니다. */
export const profile = {
  name: '임태욱',
  role: 'Backend & AI-integrated Web Developer',
  summary: '정보보안 전공 · Java / Spring Boot 백엔드 · AI · RAG 연동',
  githubUrl: 'https://github.com/study734',
  githubHandle: 'study734',
  email: 'zes1357@kakao.com',
}

export const mailtoUrl = `mailto:${profile.email}`

/** [분류, 제목, 설명] */
export const experience: [string, string, string][] = [
  ['Education', '대전대학교 정보보안학과', '보안 관점에서 시스템과 데이터를 이해하는 기반'],
  ['Leadership', '팀 프로젝트 부팀장', '요구사항 정리, 기능 통합, 협업 방식 지원'],
  ['Recognition', '성적우수장학금 2회', '꾸준한 학업 성취와 전공 역량'],
  ['Award', '교내 공모전 최우수상', '아이디어를 결과물로 구체화한 경험'],
  ['Training', '웹 개발 및 정보보안 교육', '제품 구현과 보안 기초를 함께 확장'],
]

/** [분야, 기술, 설명] */
export const stack: [string, string, string][] = [
  ['Backend', 'Java · Spring Boot · Spring Security · JPA / QueryDSL', '서비스의 핵심 흐름과 권한 구조를 설계합니다.'],
  ['Frontend', 'React · TypeScript · Vite', '아이디어를 직접 확인 가능한 화면으로 연결합니다.'],
  ['Data', 'MySQL', '업무 데이터의 관계와 접근 경계를 다룹니다.'],
  ['AI', 'OpenAI API · RAG', 'AI 기능을 실제 제품 흐름에 맞게 통합합니다.'],
  ['Infra', 'Docker · Nginx · GitHub Actions · AWS', '로컬 구현 이후의 실행 환경까지 고려합니다.'],
]
