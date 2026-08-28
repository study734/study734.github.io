export interface ProjectImage {
  src: string
  alt: string
  width: number
  height: number
}

export interface Project {
  name: string
  subtitle: string
  role: string[]
  contributions: string[]
  technologies: string[]
  repositoryUrl?: string
  demoUrl?: string
  image?: ProjectImage
}

export const projects: Project[] = [
  {
    name: 'GearVia',
    subtitle: 'AI 기능을 실제 협업 흐름에 연결한 업무 관리 플랫폼',
    role: ['부팀장', 'Backend', 'AI'],
    contributions: [
      'AI 주간 리포트 기능 설계 및 구현',
      '사용자 계정·설정 관련 기능 구현',
      '인증·권한과 업무 데이터 연결 구조 검토',
      '개발 환경 및 협업 방식 지원',
    ],
    technologies: ['Java', 'Spring Boot', 'Spring Security', 'React', 'TypeScript', 'MySQL', 'OpenAI API', 'RAG'],
    repositoryUrl: 'https://github.com/HO-0219/WorkTaskFlow',
  },
  {
    name: 'GearVia On-Premise',
    subtitle: '기업 내부 운영 환경을 고려해 관리·감사·AI 연동 구조를 확장한 프로젝트',
    role: ['요구사항 분석', '기능 설계', '운영 구조 검토'],
    contributions: [
      'On-Premise 요구사항 정리와 기능 범위 설계',
      '관리자·운영 관점의 사용자 및 업무 관리 구조 검토',
      'AI 설정과 내부 데이터 연동 구조 설계',
    ],
    technologies: ['Java', 'Spring Boot', 'React', 'TypeScript', 'MySQL', 'Docker', 'Nginx', 'RAG'],
    repositoryUrl: 'https://github.com/HO-0219/GearViaB2B_Version',
  },
  {
    name: 'GearVia ME',
    subtitle: '개인 일정과 업무 관리를 간결하게 구성한 웹 서비스',
    role: ['부팀장', 'Web Development'],
    contributions: [
      '프로젝트 기능 구현 및 통합 참여',
      '인증·사용자 기능 개발 참여',
      '서비스 동작 검증과 개선',
    ],
    technologies: ['Java', 'Spring Boot', 'React', 'TypeScript', 'MySQL', 'PWA'],
    repositoryUrl: 'https://github.com/HO-0219/todoProject',
  },
  {
    name: 'MOIDA',
    subtitle: '중고 물품 등록과 경매 흐름을 구현한 팀 프로젝트',
    role: ['Authentication / Security', 'AWS Architecture', 'Deployment'],
    contributions: [
      '인증·보안 영역 구현',
      'AWS 아키텍처 구성',
      '배포 검증',
      '프로젝트 발표',
    ],
    technologies: ['Java', 'Spring Boot', 'Spring Security', 'React', 'TypeScript', 'MySQL', 'AWS', 'Docker'],
  },
]
