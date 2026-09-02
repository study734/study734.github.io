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

export interface ProjectThread {
  title: string
  answer: string
  contributions: string[]
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

export const projectThreads: ProjectThread[][] = [
  [
    {
      title: 'AI 주간 보고서는 어떻게 검증했나요?',
      answer: 'AI 주간 리포트의 입력 검증, 분석 결과 형식, 문서 생성 흐름을 중심으로 설계하고 확인했습니다.',
      contributions: ['AI 주간 리포트 기능 설계 및 구현', '인증·권한과 업무 데이터 연결 구조 검토'],
    },
    {
      title: 'Java RAG 브랜치에서 맡은 역할',
      answer: '문서 수집부터 검색 응답까지의 흐름을 서비스에 연결하고, 결과를 확인할 수 있는 구현 경로를 정리했습니다.',
      contributions: ['AI 주간 리포트 기능 설계 및 구현', '개발 환경 및 협업 방식 지원'],
    },
  ],
  [
    {
      title: 'On-Premise 설치와 운영 구조',
      answer: '기업 내부 운영 환경을 전제로 설치, 관리자 운영, 배포 관점의 요구사항과 범위를 먼저 구조화했습니다.',
      contributions: ['On-Premise 요구사항 정리와 기능 범위 설계', '관리자·운영 관점의 사용자 및 업무 관리 구조 검토'],
    },
    {
      title: '내부 데이터와 AI 연동 설계',
      answer: '내부 데이터 경계와 AI 설정을 분리해 검토하고, 운영 환경에서 필요한 연동 구조를 설계했습니다.',
      contributions: ['AI 설정과 내부 데이터 연동 구조 설계', '관리자·운영 관점의 사용자 및 업무 관리 구조 검토'],
    },
  ],
  [
    {
      title: '개인 업무 관리 흐름을 어떻게 단순화했나요?',
      answer: '개인 일정과 업무를 빠르게 확인하고 처리할 수 있도록 핵심 흐름을 간결한 웹 서비스 경험으로 구성했습니다.',
      contributions: ['프로젝트 기능 구현 및 통합 참여', '서비스 동작 검증과 개선'],
    },
    {
      title: '인증과 사용자 기능 구현',
      answer: '사용자 진입 흐름을 안정적으로 연결하기 위해 인증과 사용자 기능 구현에 참여했습니다.',
      contributions: ['인증·사용자 기능 개발 참여', '서비스 동작 검증과 개선'],
    },
  ],
  [
    {
      title: 'AWS 배포 구조와 보안 설계',
      answer: '서비스 배포에 필요한 AWS 아키텍처를 구성하고, 인증과 보안 영역을 함께 구현·검증했습니다.',
      contributions: ['AWS 아키텍처 구성', '인증·보안 영역 구현', '배포 검증'],
    },
    {
      title: '중고 경매 서비스의 핵심 흐름',
      answer: '중고 물품 등록부터 경매까지 이어지는 팀 프로젝트의 핵심 흐름을 구현하고 발표로 정리했습니다.',
      contributions: ['인증·보안 영역 구현', '프로젝트 발표'],
    },
  ],
]
