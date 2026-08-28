export interface Project {
  name: string
  subtitle: string
  description: string
  highlights: string[]
  contributions: string[]
  technologies: string[]
  repositoryUrl?: string
  image?: string
}

export const projects: Project[] = [
  {
    name: 'GearVia',
    subtitle: 'AI 기반 협업 업무 관리 플랫폼',
    description:
      '업무 관리, 팀 커뮤니케이션, 알림과 AI 기능을 하나의 협업 흐름으로 연결한 웹 서비스입니다.',
    highlights: [
      '그룹 기반 업무 관리',
      'AI Assistant · RAG',
      'AI 업무 리포트',
      '실시간 채팅 · Web Push · PWA',
    ],
    contributions: [
      'AI 리포트 기능 설계 및 구현',
      '사용자 계정·설정 관련 기능 구현',
      '인증·권한과 실제 업무 데이터 연결 구조 검토',
      '프로젝트 개발 환경 및 협업 지원',
    ],
    technologies: [
      'Java',
      'Spring Boot',
      'Spring Security',
      'React',
      'TypeScript',
      'MySQL',
      'OpenAI API',
      'RAG',
      'WebSocket',
      'PWA',
    ],
    repositoryUrl: 'https://github.com/HO-0219/WorkTaskFlow',
  },
  {
    name: 'GearVia ME',
    subtitle: '개인을 위한 일정·업무 관리 서비스',
    description:
      '협업 중심 서비스에서 개인에게 필요한 기능을 분리해 일정과 업무를 간결하게 관리하도록 구성한 웹 서비스입니다.',
    highlights: ['개인 업무 관리', '일정 및 캘린더', '사용자 설정', '알림 · PWA'],
    contributions: [
      '프로젝트 기능 구현 및 통합',
      '인증 및 사용자 기능 개발',
      '서비스 기능 검증과 개선',
    ],
    technologies: ['Java', 'Spring Boot', 'React', 'TypeScript', 'MySQL', 'PWA'],
    repositoryUrl: 'https://github.com/HO-0219/todoProject',
  },
  {
    name: 'GearVia On-Premise',
    subtitle: '기업 내부 환경을 위한 On-Premise 협업 플랫폼',
    description:
      '기업 내부 서버에서 직접 운영할 수 있도록 관리·감사·AI 설정·내부 데이터 연동을 중심으로 확장한 프로젝트입니다.',
    highlights: [
      '관리자 기반 사용자·업무 관리',
      'AI API Key · 모델 설정 · RAG',
      '내부 파일시스템 · NAS 연동 구조',
      '감사 로그 · 자원 모니터링',
    ],
    contributions: [
      'On-Premise 요구사항 분석 및 기능 설계',
      '관리자·운영 관점 기능 구조 검토',
      'AI 및 내부 데이터 연동 구조 설계',
    ],
    technologies: ['Java', 'Spring Boot', 'React', 'TypeScript', 'MySQL', 'Docker', 'Nginx', 'RAG'],
    repositoryUrl: 'https://github.com/HO-0219/GearViaB2B_Version',
  },
  {
    name: 'MOIDA',
    subtitle: '중고 물품 경매 팀 프로젝트',
    description:
      '중고 물품의 등록과 경매 흐름을 웹 서비스로 구현하며 보안과 클라우드 배포 경험을 함께 다룬 팀 프로젝트입니다.',
    highlights: ['중고 경매 서비스', '인증·보안', 'AWS 기반 인프라', '배포 검증'],
    contributions: [
      '인증·보안 영역 담당',
      'AWS 아키텍처 구성',
      '배포 검증',
      '프로젝트 발표',
    ],
    technologies: ['Java', 'Spring Boot', 'React', 'TypeScript', 'MySQL', 'AWS', 'Docker', 'Nginx'],
  },
]
