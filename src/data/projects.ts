export interface ProjectImage {
  src: string
  alt: string
  width: number
  height: number
}

/** 프로젝트 상단에 한 줄로 노출되는 메타 정보 */
export interface ProjectContext {
  period: string
  team: string
  position: string
}

/**
 * 기술적 판단 1건.
 * 신입 포트폴리오에서 유일하게 실력이 드러나는 지점이므로
 * "무엇을 했다"가 아니라 "왜 그렇게 정했다"로 기술한다.
 */
export interface ProjectDecision {
  title: string
  situation: string
  options: string[]
  choice: string
  reason: string
}

/** "근거가 있다"는 설명이 아니라 근거 자체로 연결되는 항목 */
export interface ProjectEvidence {
  label: string
  description: string
  url?: string
  image?: ProjectImage
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
  featured?: boolean
  context?: ProjectContext
  problem?: string
  decisions?: ProjectDecision[]
  evidence?: ProjectEvidence[]
}

export interface ProjectThread {
  title: string
  answer: string
  contributions: string[]
}

export const projects: Project[] = [
  {
    name: 'GearVia',
    subtitle: 'AI 비서·RAG 검색과 주간 리포트를 실제 협업 흐름에 연결한 업무 관리 PWA',
    featured: true,
    role: ['Backend', 'AI / RAG', 'Auth'],
    context: {
      period: '2026.08 (assistant · report · admin 인프라 담당 구간)',
      team: '팀 프로젝트 · 부팀장',
      position: 'AI 비서 / RAG 검색 / AI 주간 리포트 / 운영 admin 보안',
    },
    problem:
      '업무 데이터는 쌓이지만 상태와 위험은 사용자가 직접 찾아 읽어야 했습니다. ' +
      '이 요약과 검색을 LLM에 맡기는 순간 두 가지 문제가 생깁니다. ' +
      '근거 없는 리포트가 그대로 전달되는 것, 그리고 누구나 올릴 수 있는 문서 본문이 도구를 가진 비서의 프롬프트로 들어가는 것입니다.',
    contributions: [
      'AI 비서의 그룹 자료 RAG 검색과 인용(quoted_text) 규약을 설계·구현',
      '문서 자동 색인 파이프라인 구축: 업로드 이벤트 기반 색인, 실패분 20분 주기 재시도, 삭제 자료 즉시 검색 제외, 임베딩 모델 교체 시 재색인',
      'txt·csv에서 pdf·docx·xlsx·pptx까지 문서 파서 확장 (PDFBox · poi-ooxml)',
      'AI 주간 리포트 백엔드와 JSON Schema 계약 테스트, 리포트 다운로드 흐름 구현',
      '운영 admin의 격리 TLS 리스너(19091)·IP 허용목록·QR 기반 MFA 배포 구조 구현',
      'Flyway 마이그레이션 버전 충돌 해결과 배포 안정화 (V30 · V40 파일명 충돌)',
    ],
    decisions: [
      {
        title: 'RAG를 붙이는 커밋에서 인용 규약을 같이 넣기',
        situation:
          'RAG를 붙이는 순간 누구나 올린 문서 본문이 프롬프트에 들어갑니다. ' +
          '그런데 비서가 가진 도구 중에는 초대 링크 생성, 그룹 알림처럼 결과가 서비스 밖으로 나가는 동작이 있습니다.',
        options: [
          '검색을 먼저 붙여 동작시키고, 인젝션 대응은 이후 과제로 분리',
          '검색과 인용 규약을 같은 커밋에서 함께 도입',
        ],
        choice: '검색 결과를 quoted_text 아래에만 넣고, 지시가 아니라 데이터임을 결과와 지시문 양쪽에 명시',
        reason:
          '두 작업 사이의 기간이 그대로 취약 구간이 됩니다. ' +
          '검증은 인젝션 문서를 넣고 실제로 확인했습니다 — 비서는 해당 문서를 인용만 하고 실행하지 않았으며, 업무 상태와 대기 액션 모두 변화가 없었습니다.',
      },
      {
        title: '그룹 격리를 LLM이 아니라 SQL과 인증이 담당하게 하기',
        situation:
          '검색 도구에 groupId를 인자로 주면, 어느 그룹을 조회할지를 사실상 LLM이 고르게 됩니다.',
        options: [
          '검색 도구 인자로 groupId를 받고 프롬프트로 범위를 지시',
          '도구 인자에서 groupId를 없애고 서버가 인증된 현재 작업공간을 주입',
        ],
        choice: '검색 도구 인자에 groupId를 두지 않고, 그룹 격리를 SQL where 절로 처리',
        reason:
          '권한 경계를 모델의 판단에 맡기면 프롬프트 한 줄로 무너집니다. ' +
          '접근 범위는 데이터가 프롬프트에 들어가기 전에 결정되어야 한다고 봤습니다.',
      },
      {
        title: '단발 도구 호출 게이트웨이 위에서 검색을 2패스로 분리',
        situation:
          '기존 게이트웨이는 maxToolCalls=1이라, search_documents를 일반 도구로 등록하면 그 턴의 유일한 도구 선택을 검색이 소진합니다.',
        options: [
          '게이트웨이의 도구 호출 상한을 늘리기',
          '읽기 전용인 검색만 서버가 즉시 실행하고 결과를 붙여 다시 질의',
        ],
        choice: '검색은 서버가 즉시 실행해 SEARCH_RESULT로 붙이고, 2차 호출에서는 검색 도구를 제거',
        reason:
          '검색은 읽기 전용이라 사용자 승인 대상이 아니고, 상한을 푸는 것보다 영향 범위가 작습니다. ' +
          '2차 호출에서 검색 도구를 빼서 검색만 반복하는 루프도 함께 막았습니다.',
      },
      {
        title: '벡터 DB 없이 MySQL BLOB + 메모리 코사인 탐색으로 시작',
        situation:
          '운영 DB가 MySQL 8.4인데 VECTOR 타입은 9.0부터 지원됩니다. 코퍼스는 그룹당 수십 청크 규모였습니다.',
        options: [
          '벡터 DB를 별도 컴포넌트로 추가',
          'BLOB에 임베딩을 저장하고 전수 코사인 탐색',
        ],
        choice: 'BLOB 저장 + 메모리 전수 탐색, 단 조회 상한(MAX_SCANNED_CHUNKS)을 Pageable로 쿼리 단에 적용',
        reason:
          '이 규모에서 벡터 DB는 운영 부담만 늘립니다. ' +
          '대신 그룹 전체를 메모리로 로드하지 않도록 상한을 쿼리로 내리고, 임베딩 호출은 트랜잭션 밖으로 빼 DB 접근을 짧게 유지했습니다.',
      },
    ],
    technologies: ['Java 21', 'Spring Boot 3.3', 'Spring Security', 'JPA', 'Flyway', 'React 18', 'TypeScript', 'MySQL 8.4', 'OpenAI API', 'RAG', 'Docker', 'Nginx', 'PWA'],
    repositoryUrl: 'https://github.com/HO-0219/WorkTaskFlow',
    evidence: [
      {
        label: 'RAG 검색과 인용 규약',
        description: '2패스 구조·인젝션 방어·그룹 격리를 도입한 커밋과 설계 근거',
        url: 'https://github.com/HO-0219/WorkTaskFlow/commit/03202579d360947213b4f701ed0d53186b502ef4',
      },
      {
        label: '자동 색인과 모듈 경계',
        description: 'AFTER_COMMIT 이벤트로 색인해 resource 모듈이 assistant를 모르게 유지',
        url: 'https://github.com/HO-0219/WorkTaskFlow/commit/b1edee08c0c882fc537c827f6103286c2b73aa41',
      },
      {
        label: '색인 신뢰성 보완',
        description: '삭제 자료 즉시 검색 제외 · 임베딩 모델 교체 시 재색인 (재현 테스트 2건 포함)',
        url: 'https://github.com/HO-0219/WorkTaskFlow/commit/dd16a9497091f413a5c3c790d3ca89db6e0602c3',
      },
      {
        label: '운영 admin 격리 TLS 리스너',
        description: 'admin을 443에서 차단하고 19091 전용 TLS와 IP 허용목록으로만 노출',
        url: 'https://github.com/HO-0219/WorkTaskFlow/commit/f7e883294653ba0cf4094c0c11b42ac46aebf5bd',
      },
      {
        label: 'Repository',
        description: '아키텍처 · API 계약 · 배포 구성을 담은 README',
        url: 'https://github.com/HO-0219/WorkTaskFlow',
      },
    ],
  },
  {
    name: 'GearVia On-Premise',
    subtitle: 'SaaS 협업 플랫폼을 단일 서버·단일 조직 환경에서 설치·운영할 수 있게 만든 B2B 버전',
    featured: true,
    role: ['Backend', 'Admin Console', 'Infra'],
    context: {
      period: '2026.08 – 2026.09',
      team: '팀 프로젝트',
      position: '관리자 콘솔 · 스토리지 · AI 설정 · 설치/배포',
    },
    problem:
      '기업이 협업 도구를 도입할 때 막히는 지점은 기능이 아니라 운영 주체입니다. ' +
      '공개 회원가입과 결제로 돌아가던 SaaS를, 회사 관리자가 사용자·접근 정책·저장 위치·AI 사용 여부를 직접 통제하는 형태로 다시 만들어야 했습니다.',
    contributions: [
      '관리자 콘솔 구축: 사용자 관리, 업무 정지·삭제·복구, 로그인 이력, 감사 로그, 시스템·AI 사용량 모니터링',
      'AdminAccessFilter의 IP 허용목록을 CIDR 기준으로 수정하고, MFA 검증 상태를 토큰 갱신 이후까지 유지',
      'NAS·로컬 스토리지 지원과 운영 중 스토리지 전환·기존 파일 이관 구현',
      '관리자가 웹에서 OpenAI 키·AI 활성화·사내 LLM 호스트를 설정하도록 전환 (환경변수 의존 제거)',
      '도메인·TLS 관리 API와 제한된 호스트 설정 적용기(applier) 구현',
      'Ubuntu 이미지 기반 설치 자동화, 최초 관리자 프로비저닝, 설치 실패 시 복구 경로 구현',
    ],
    decisions: [
      {
        title: 'IP 허용목록을 문자열 비교가 아닌 주소 비교로',
        situation:
          '관리자 콘솔 접근 제어가 허용목록을 문자열로 비교하고 있어, CIDR 표기나 표현이 다른 동일 주소가 의도대로 매칭되지 않았습니다.',
        options: [
          '허용목록에 단일 IP만 적도록 운영 규칙으로 제한',
          '주소 객체로 파싱해 CIDR 범위로 판정',
        ],
        choice: 'AdminAccessFilter가 주소를 파싱해 CIDR 범위로 판정하도록 수정하고, 해당 분기의 테스트를 추가',
        reason:
          '접근 제어를 운영 규칙으로 떠넘기면 사내망 CIDR을 적는 순간 조용히 깨집니다. ' +
          '경계를 지키는 코드일수록 실패가 눈에 띄지 않아서, 분기마다 테스트를 남겨야 한다고 봤습니다.',
      },
      {
        title: 'AI 활성화를 배포 설정이 아니라 관리자 설정으로',
        situation:
          '고객사마다 외부 AI 제공자에 데이터를 보낼 수 있는지가 다릅니다. 초기 구현은 이를 환경변수로만 제어했습니다.',
        options: [
          '고객사별 환경변수로 배포 시점에 고정',
          '관리자 콘솔에서 키·활성화·모델 호스트를 저장하고 즉시 반영',
        ],
        choice: '관리자 설정을 우선 적용하고, 저장 전에는 배포 환경변수를 폴백으로 사용',
        reason:
          '어떤 모델을 쓰는지는 기술 선택이 아니라 고객사의 보안 정책이고, 정책은 배포 이후에 바뀝니다. ' +
          'AI 기능 게이트와 색인 재시도 스케줄러까지 이 설정을 보도록 함께 고쳐야 실제로 일관되게 동작했습니다.',
      },
    ],
    technologies: ['Java 21', 'Spring Boot', 'Spring Security', 'JPA', 'Flyway', 'React', 'TypeScript', 'MySQL 8.4', 'Docker Compose', 'Nginx', 'systemd', 'Ubuntu Server', 'MCP', 'RAG'],
    repositoryUrl: 'https://github.com/HO-0219/GearViaB2B_Version',
    evidence: [
      {
        label: 'Repository',
        description: '설치·운영 구성과 관리자 매뉴얼을 포함한 On-Premise 저장소',
        url: 'https://github.com/HO-0219/GearViaB2B_Version',
      },
      {
        label: '기여 커밋 61건',
        description: '관리자 콘솔 · 스토리지 · AI 설정 · 설치 자동화 작업 이력',
        url: 'https://github.com/HO-0219/GearViaB2B_Version/commits?author=study734',
      },
      { label: '관리자 콘솔', description: '사용자·업무·AI 설정·감사 로그 운영 화면' },
    ],
  },
  {
    name: 'GearVia ME',
    subtitle: '개인 일정과 업무 관리를 간결하게 구성한 웹 서비스',
    role: ['Backend', 'Auth'],
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
    role: ['Backend', 'Auth', 'AWS'],
    context: {
      // TODO(확인): 실제 기간과 인원으로 교체
      period: '기간 확인 필요',
      team: '팀 프로젝트',
      position: '인증 / 배포 담당',
    },
    contributions: [
      '인증·인가 흐름 구현 (토큰 발급·만료·재발급 정책 포함)',
      'AWS 기반 배포 아키텍처 구성 및 배포 검증',
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
      contributions: ['문서 추출·청킹·임베딩과 인용 검색 구현', '인증된 그룹 범위 검색과 색인 테스트'],
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
