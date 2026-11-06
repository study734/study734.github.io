/** 사이트 전체에서 쓰는 프로필·연락처 정보. 이 파일만 고치면 모든 링크가 함께 바뀝니다. */
export const profile = {
  name: '임태욱',
  role: 'Backend & AI-integrated Web Developer',
  summary: '정보보안 전공 · Java / Spring Boot 백엔드 · AI · RAG 연동',
  githubUrl: 'https://github.com/study734',
  githubHandle: 'study734',
  // TODO(확인): 실제로 받는 메일 주소인지 확인
  email: 'study734@naver.com',
}

export const mailtoUrl = `mailto:${profile.email}`
