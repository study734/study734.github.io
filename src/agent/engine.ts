import { experience, profile, stack } from '../data/profile'
import { projects } from '../data/projects'
import type { WorkspaceView } from '../components/Sidebar'
import type { KnowledgeChunk } from './knowledge'
import { hasTopic, mentionedProjects, search } from './search'

/**
 * 태욱 님을 소개하는 비서 agent의 응답 엔진.
 *
 * - 자주 받는 질문은 기록의 사실만으로 비서 말투의 답변을 미리 정리해 둡니다(아래 answers).
 * - 나머지는 기록을 검색해서, 찾은 내용을 근거로 답합니다.
 * - 기록에 없으면 지어내지 않고, 태욱 님께 질문을 전달하도록 안내합니다.
 *
 * 생성형 AI를 붙일 때는 `runAgent`가 같은 모양(AgentRun)을 돌려주는 원격 호출로 바꾸면 됩니다.
 * 이때도 search() 결과와 아래 정리된 답변을 모델의 유일한 근거로 넘기세요.
 */

export type Audience = 'recruiter' | 'developer' | 'browse'

export interface AgentStep { label: string; detail: string; items?: string[] }
export interface AgentSource { label: string; view?: WorkspaceView; url?: string }
export type AgentBlock =
  | { type: 'text'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'point'; title: string; text: string; source: string; url?: string }
  | { type: 'projects' }
  | { type: 'contact' }
  | { type: 'handoff'; question: string }
export interface AgentRun {
  intent: Intent
  steps: AgentStep[]
  blocks: AgentBlock[]
  sources: AgentSource[]
  suggestions: string[]
}

type Intent =
  | 'tour' | 'intro' | 'challenge' | 'why-hire' | 'strengths' | 'weakness' | 'roles' | 'ai' | 'security' | 'projects'
  | 'stack' | 'experience' | 'contact' | 'search' | 'unknown'

const intentLabels: Record<Intent, string> = {
  tour: '방문 목적에 맞춘 안내',
  intro: '자기소개',
  challenge: '문제 해결 경험',
  'why-hire': '채용 포인트',
  strengths: '강점',
  weakness: '한계와 보완점',
  roles: '맡은 역할',
  ai: 'AI 활용',
  security: '보안 경험',
  projects: '프로젝트 목록',
  stack: '기술 스택',
  experience: '경험·이력',
  contact: '연락',
  search: '프로젝트 기록 질문',
  unknown: '기록 밖 질문',
}

const name = '태욱 님'
const [gearvia, onPremise] = projects
const view = (index: number) => `project-${index}` as WorkspaceView
const decision = (projectIndex: number, title: string) => projects[projectIndex].decisions?.find((item) => item.title.startsWith(title))
const evidenceUrl = (projectIndex: number, label: string) => projects[projectIndex].evidence?.find((item) => item.label.startsWith(label))?.url
const commitCount = onPremise.evidence?.find((item) => item.label.startsWith('기여 커밋'))?.label.match(/\d+/)?.[0]

/* ---------- 방문 목적별 첫 안내 ---------- */

export const audienceOptions: { id: Audience; label: string; question: string; description: string }[] = [
  { id: 'recruiter', label: '채용 담당자예요', question: '채용 검토 중이에요. 핵심만 알려주세요.', description: '30초 요약 · 강점 · 연락처' },
  { id: 'developer', label: '개발자예요', question: '개발자예요. 기술적인 이야기가 궁금해요.', description: '기술적 판단 · 코드 근거' },
  { id: 'browse', label: '그냥 둘러보러 왔어요', question: '그냥 둘러보러 왔어요.', description: '프로젝트 소개' },
]

export function tourFor(audience: Audience): AgentRun {
  const option = audienceOptions.find((item) => item.id === audience)!
  const steps: AgentStep[] = [{ label: '방문 목적 확인', detail: option.label.replace(/예요$|어요$/, '') }]

  if (audience === 'recruiter') {
    steps.push({ label: '요약 자료 준비', detail: '프로필 · 대표 프로젝트 2개 · 기술적 판단', items: ['프로필', gearvia.name, onPremise.name] })
    return {
      intent: 'tour', steps,
      blocks: [
        { type: 'text', text: `반갑습니다. 바쁘실 테니 ${name}에 대해 30초 분량으로 정리해 드릴게요.` },
        { type: 'list', items: [
          `정보보안을 전공한 백엔드 개발자예요. 주력은 Java · Spring Boot이고, 그 위에 AI · RAG 기능을 실제 서비스 흐름에 붙여 왔어요.`,
          `대표 작업은 팀 프로젝트 ${gearvia.name}예요. 부팀장으로 참여했고, AI 비서의 RAG 검색 · AI 주간 리포트 · 운영 admin 보안을 맡았어요.`,
          `${onPremise.name}에서는 같은 서비스를 기업 내부 서버에 설치 · 운영할 수 있게 만들었어요. 관리자 콘솔, 스토리지, AI 설정, 설치 자동화를 담당했고${commitCount ? ` 기여 커밋은 ${commitCount}건이에요` : ''}.`,
        ] },
        { type: 'text', text: `제가 보기에 ${name}의 가장 큰 특징은 "기능이 된다"에서 멈추지 않고 "누가 어떤 데이터에 접근하는가"를 코드와 테스트로 지킨다는 점이에요. 궁금한 게 있으면 편하게 물어보시고, 바로 연락하셔도 좋아요.` },
        { type: 'contact' },
      ],
      sources: [{ label: gearvia.name, view: view(0) }, { label: onPremise.name, view: view(1) }, { label: 'Experience', view: 'experience' }],
      suggestions: ['왜 뽑아야 하나요?', '팀에서 어떤 역할을 했나요?', '부족한 점은 없나요?'],
    }
  }

  if (audience === 'developer') {
    const picks = [
      { projectIndex: 0, title: '그룹 격리를' }, { projectIndex: 0, title: 'RAG를 붙이는' },
      { projectIndex: 0, title: '벡터 DB 없이' }, { projectIndex: 1, title: 'IP 허용목록을' },
    ].map(({ projectIndex, title }) => ({ projectIndex, item: decision(projectIndex, title)! })).filter(({ item }) => item)
    steps.push({ label: '기술적 판단 조회', detail: `판단 기록 ${picks.length}건`, items: picks.map(({ item }) => item.title) })
    return {
      intent: 'tour', steps,
      blocks: [
        { type: 'text', text: `반가워요. 그럼 결과물 소개보다 ${name}이 실제로 고민했던 판단 위주로 보여드릴게요. 각각 "무엇을 검토했고 왜 그렇게 정했는지"가 기록돼 있어요.` },
        ...picks.map(({ projectIndex, item }) => ({ type: 'point' as const, title: item.title, text: `${item.situation} → ${item.choice}`, source: `${projects[projectIndex].name} · 기술적 판단` })),
        { type: 'text', text: '하나를 골라 물어보시면 검토한 선택지와 이유까지 자세히 설명드릴게요. 실제 커밋도 연결해 드려요.' },
      ],
      sources: [
        { label: 'RAG 검색과 인용 규약 커밋', url: evidenceUrl(0, 'RAG 검색과') },
        { label: gearvia.name, view: view(0) }, { label: onPremise.name, view: view(1) },
      ].filter((source) => source.view || source.url),
      suggestions: ['그룹 격리를 왜 SQL로 했나요?', '벡터 DB 없이 시작한 이유는?', '검색을 2패스로 나눈 이유는?'],
    }
  }

  steps.push({ label: '프로젝트 조회', detail: `프로젝트 ${projects.length}개`, items: projects.map((project) => project.name) })
  return {
    intent: 'tour', steps,
    blocks: [
      { type: 'text', text: `편하게 둘러보세요. ${name}이 지금까지 만든 프로젝트는 ${projects.length}개예요. 카드를 누르면 자세한 기록이 열리고, 궁금한 건 언제든 저에게 물어보시면 돼요.` },
      { type: 'projects' },
    ],
    sources: [],
    suggestions: ['임태욱은 어떤 개발자인가요?', 'AI는 어떻게 활용했나요?', '가장 어려웠던 문제는?'],
  }
}

/* ---------- 자주 받는 질문 ---------- */

function detectIntent(question: string): Intent {
  const q = question.toLowerCase().replace(/\s+/g, '')
  const noProject = mentionedProjects(question).length === 0
  if (/연락|이메일|메일|email|contact|커피챗|인터뷰|면접|만나|미팅/.test(q)) return 'contact'
  if (/왜뽑|뽑아야|채용해야|채용이유|고용|합류|우리팀|우리회사|인재/.test(q)) return 'why-hire'
  if (/약점|단점|부족|아쉬|한계|보완|개선할점|못하는/.test(q) && noProject) return 'weakness'
  if (/어려웠|어려운|힘들었|고생|난관|트러블|장애|문제해결|해결한문제|위기/.test(q) && noProject) return 'challenge'
  if (/설치/.test(q) && /문제|장애|오류|에러|실패/.test(q)) return 'challenge'
  if (/강점|장점|차별|잘하는|특별|어필|특징/.test(q)) return 'strengths'
  if (/누구|자기소개|소개해|소개좀|어떤사람|어떤개발자|어떤분|안녕|hello|^hi/.test(q)) return 'intro'
  if (/(ai|llm|인공지능|gpt|openai)(를|은|는|을)?(어떻게|관련)?(활용|경험|사용|써)/.test(q) && noProject) return 'ai'
  if (/보안|security|해킹|취약/.test(q) && noProject) return 'security'
  if (/기술스택|스택|stack|어떤기술|쓸줄|사용할줄|언어|프레임워크/.test(q) && noProject) return 'stack'
  if (/학력|학교|전공|수상|장학|이력|교육|경력/.test(q) && noProject) return 'experience'
  if (/경험/.test(q) && noProject && !hasTopic(question)) return 'experience'
  if (/역할|담당|맡은|맡았|포지션|팀에서|협업|부팀장/.test(q) && noProject && !hasTopic(question)) return 'roles'
  if (/프로젝트(목록|전체|뭐|무엇|보여|소개|알려|를했|했|들)|(어떤|무슨)프로젝트|무엇을만들|뭘만들|뭐만들|만든것|작업물|포트폴리오/.test(q) && noProject) return 'projects'
  return 'search'
}

type Answer = Omit<AgentRun, 'intent' | 'steps'> & { checked: string[] }

function curatedAnswer(intent: Intent): Answer | null {
  switch (intent) {
    case 'intro': return {
      checked: ['프로필', experience[0][1], gearvia.name, onPremise.name],
      blocks: [
        { type: 'text', text: `${profile.name} 님은 정보보안을 전공한 ${profile.role}예요. Java · Spring Boot로 서비스의 핵심 흐름과 권한 구조를 만들고, 그 위에 AI · RAG 기능을 실제 업무 흐름에 맞게 붙이는 일을 해 왔어요.` },
        { type: 'text', text: `대표 작업은 팀 협업 서비스 ${gearvia.name}의 AI 비서 · RAG 검색 · 주간 리포트, 그리고 같은 서비스를 기업 내부 서버에서 운영할 수 있게 만든 ${onPremise.name}예요. 기록을 보면, 기능을 붙이는 것보다 "그 기능이 어디까지 접근해도 되는가"를 먼저 따지는 분이에요.` },
      ],
      sources: [{ label: 'Experience', view: 'experience' }, { label: gearvia.name, view: view(0) }, { label: onPremise.name, view: view(1) }],
      suggestions: ['강점이 뭔가요?', '어떤 프로젝트를 했나요?', '연락은 어떻게 하나요?'],
    }
    case 'challenge': return {
      checked: [`${onPremise.name} · On-Premise 설치와 운영 구조`, `${onPremise.name} · 내부 데이터와 AI 연동 설계`],
      blocks: [
        { type: 'text', text: `기록 중에서 하나를 고르라면 ${onPremise.name}의 설치 장애를 말씀드리고 싶어요. 문제를 어떻게 좁혀 가는지가 잘 보이는 사례예요.` },
        { type: 'point', title: '상황 — 설치는 끝났는데 로그인이 403', text: '기업 내부 Ubuntu 서버(VM)에 설치를 마쳤는데, 실제 사용자가 로그인하면 403으로 거부됐어요.', source: '문제 발견' },
        { type: 'point', title: '원인 — 서비스 주소를 잘못 고르고 있었어요', text: '설치 스크립트가 기본 경로를 가진 NAT 주소를 서비스 주소로 선택했어요. 사용자가 실제로 접속하는 Host-Only 주소와 달라서 CORS 검사에서 막힌 거였죠.', source: '원인 분석' },
        { type: 'point', title: '판단 — 허용 범위를 넓히지 않았어요', text: '접속만 되게 하려면 허용 범위를 넓히면 되지만, 그 대신 주소 감지 기준을 고쳤어요. 명시적 설정을 우선하고, 컨테이너 · 브리지 인터페이스는 제외하고, NAT 주소는 마지막 후보로 두었어요. 인증서의 대상 주소 검증도 함께 보완했고요.', source: '수정 판단' },
        { type: 'point', title: '결과 — 403 → 200, 막아야 할 건 계속 막힘', text: '해당 VM에서 로그인은 200으로 성공하고, 다른 Origin 요청은 계속 403으로 차단되는 걸 확인했어요. 끝까지 검증하지 못한 관리자 Domain & SSL 화면은 이번 릴리스에서 뺐어요.', source: '검증 기록' },
        { type: 'text', text: '보안 장치를 풀어서 문제를 덮지 않고, 원인을 고쳐서 보안과 동작을 둘 다 지킨 사례예요. 같은 프로젝트에서 저장소를 바꾸면 기존 첨부파일이 404가 되던 문제를 "복사 후 전환" 순서로 해결한 기록도 있어요.' },
      ],
      sources: [{ label: 'On-Premise 설치와 운영 구조', view: 'project-1-thread-0' as WorkspaceView }, { label: '변경 내용 · PR', url: 'https://github.com/HO-0219/GearViaB2B_Version/pull/5' }, { label: '내부 데이터와 AI 연동 설계', view: 'project-1-thread-1' as WorkspaceView }],
      suggestions: ['저장소 전환 문제는 어떻게 풀었나요?', '왜 뽑아야 하나요?', '부족한 점은 없나요?'],
    }
    case 'why-hire': {
      const rag = decision(0, 'RAG를 붙이는')
      return {
        checked: [`${gearvia.name} · 기술적 판단`, `${onPremise.name} · On-Premise 설치와 운영 구조`, `${gearvia.name} · AI 주간 보고서`],
        blocks: [
          { type: 'text', text: `제가 ${name}을 추천드린다면 이유는 세 가지예요. 모두 기록으로 확인하실 수 있어요.` },
          { type: 'point', title: '1. AI 기능을 "안전하게" 붙입니다', text: `RAG 검색을 붙이는 같은 커밋에 인용 규약을 함께 넣었어요. ${rag ? rag.reason.split('. ')[1] ?? rag.reason : ''}`.trim(), source: `${gearvia.name} · 기술적 판단`, url: evidenceUrl(0, 'RAG 검색과') },
          { type: 'point', title: '2. 배포 이후의 운영까지 봅니다', text: 'On-Premise VM 설치 후 로그인이 403으로 실패하던 문제를, 허용 범위를 넓히는 대신 서비스 주소 감지 기준을 고쳐 해결했어요. 끝까지 검증하지 못한 관리 화면은 릴리스에서 뺐고요.', source: `${onPremise.name} · On-Premise 설치와 운영 구조` },
          { type: 'point', title: '3. 확인한 것과 못 한 것을 구분해서 적습니다', text: 'AI 주간 리포트 PR에는 통과한 자동 테스트와, 운영 환경에서 따로 확인해야 할 항목을 나눠 기록했어요. 과장 없이 상태를 공유하는 편이에요.', source: `${gearvia.name} · AI 주간 보고서는 어떻게 검증했나요?` },
          { type: 'text', text: '더 확인하고 싶으신 부분이 있으면 말씀해 주세요. 바로 연락하셔도 좋아요.' },
        ],
        sources: [{ label: `${gearvia.name} · 기술적 판단`, view: view(0) }, { label: 'On-Premise 설치와 운영 구조', view: 'project-1-thread-0' as WorkspaceView }, { label: 'AI 주간 보고서 검증', view: 'project-0-thread-0' as WorkspaceView }],
        suggestions: ['부족한 점은 없나요?', '팀에서 어떤 역할을 했나요?', '연락은 어떻게 하나요?'],
      }
    }
    case 'strengths': {
      const picks = [decision(0, '그룹 격리를'), decision(0, 'RAG를 붙이는'), decision(1, 'AI 활성화를')].filter((item): item is NonNullable<typeof item> => !!item)
      return {
        checked: picks.map((item) => item.title),
        blocks: [
          { type: 'text', text: `${name}의 강점은 한마디로 "경계를 먼저 지키는 개발"이에요. 기능이 돌아가는지보다 권한과 데이터가 새지 않는지를 먼저 확인하는 분이에요. 실제 판단 몇 가지를 보시면 느낌이 오실 거예요.` },
          ...picks.map((item) => ({ type: 'point' as const, title: item.title, text: item.reason, source: '기술적 판단' })),
        ],
        sources: [{ label: gearvia.name, view: view(0) }, { label: onPremise.name, view: view(1) }],
        suggestions: ['부족한 점은 없나요?', 'AI는 어떻게 활용했나요?', '왜 뽑아야 하나요?'],
      }
    }
    case 'weakness': return {
      checked: ['Java RAG 브랜치 · 한계', '내부 데이터와 AI 연동 · 한계', 'AI 주간 보고서 · 한계'],
      blocks: [
        { type: 'text', text: `좋은 질문이에요. ${name}은 작업마다 한계를 직접 기록해 두는 편이라, 숨기지 않고 말씀드릴게요.` },
        { type: 'point', title: '대규모 검색은 아직 검증 전이에요', text: 'RAG 검색은 작은 그룹 문서 규모를 전제로 MySQL에 임베딩을 저장하고 메모리에서 유사도를 계산해요. 문서량이 늘면 검색 품질 평가와 처리량 측정을 거쳐 별도 검색 인프라를 검토해야 해요.', source: `${gearvia.name} · Java RAG 브랜치에서 맡은 역할` },
        { type: 'point', title: '큰 파일 이관은 비동기 처리가 남아 있어요', text: '스토리지 전환 시 기존 파일 이동을 요청 처리 중에 동기로 수행해서, 데이터가 크면 오래 걸릴 수 있어요. 작업 분리와 진행 상태 표시가 후속 과제예요.', source: `${onPremise.name} · 내부 데이터와 AI 연동 설계` },
        { type: 'point', title: 'AI 결과의 "사실성"까지는 보장하지 않아요', text: '주간 리포트는 응답 형식을 검증하지만, 내용이 실제 업무 데이터와 맞는지는 별도로 확인해야 한다고 적어 두었어요.', source: `${gearvia.name} · AI 주간 보고서는 어떻게 검증했나요?` },
        { type: 'text', text: '모두 본인이 다음 단계로 정리해 둔 과제들이에요.' },
      ],
      sources: [{ label: 'Java RAG 브랜치에서 맡은 역할', view: 'project-0-thread-1' as WorkspaceView }, { label: '내부 데이터와 AI 연동 설계', view: 'project-1-thread-1' as WorkspaceView }, { label: 'AI 주간 보고서 검증', view: 'project-0-thread-0' as WorkspaceView }],
      suggestions: ['강점이 뭔가요?', '테스트는 어떻게 했나요?', '연락은 어떻게 하나요?'],
    }
    case 'roles': return {
      checked: [experience[1][1], ...projects.map((project) => project.name)],
      blocks: [
        { type: 'text', text: `${gearvia.name} 팀 프로젝트에서는 부팀장이었어요. 요구사항을 정리하고, 기능을 통합하고, 협업 방식을 맞추는 역할을 함께 했어요. 프로젝트별로 직접 맡은 부분은 이렇게 나뉘어요.` },
        ...projects.map((project) => ({ type: 'point' as const, title: `${project.name} — ${project.role.join(' · ')}`, text: project.context ? `${project.context.team}. ${project.context.position}` : project.contributions.join(' · '), source: project.name })),
      ],
      sources: projects.map((project, index) => ({ label: project.name, view: view(index) })),
      suggestions: ['가장 어려웠던 문제는?', '왜 뽑아야 하나요?', '연락은 어떻게 하나요?'],
    }
    case 'ai': return {
      checked: [`${gearvia.name} · 핵심 기여`, `${gearvia.name} · 기술적 판단`, `${onPremise.name} · 기술적 판단`],
      blocks: [
        { type: 'text', text: `${name}은 AI를 "붙여 보는" 수준이 아니라, 실제 서비스에서 안전하게 돌아가도록 만드는 쪽에 집중했어요.` },
        { type: 'list', items: [
          `AI 비서가 팀 자료를 검색해 원문을 인용하며 답하도록 RAG 검색을 설계 · 구현했어요. 문서를 올리면 자동으로 색인되고, 실패분은 20분마다 재시도해요.`,
          `AI 주간 리포트는 응답 형식(JSON Schema)을 계약으로 정하고 테스트해서, 형식이 깨진 결과가 그대로 나가지 않게 했어요.`,
          `On-Premise 버전에서는 AI 사용 여부와 모델 주소를 관리자 화면에서 바꿀 수 있게 했어요. 외부 AI에 데이터를 보내도 되는지는 고객사의 보안 정책이라서요.`,
        ] },
        { type: 'text', text: '어느 그룹의 자료를 검색할지는 AI가 아니라 서버의 인증이 정하도록 한 점도 특징이에요.' },
      ],
      sources: [{ label: gearvia.name, view: view(0) }, { label: 'Java RAG 브랜치에서 맡은 역할', view: 'project-0-thread-1' as WorkspaceView }, { label: onPremise.name, view: view(1) }],
      suggestions: ['그룹 격리를 왜 SQL로 했나요?', 'AI 주간 보고서는 어떻게 검증했나요?', '벡터 DB 없이 시작한 이유는?'],
    }
    case 'security': return {
      checked: [experience[0][1], `${gearvia.name} · 핵심 기여`, `${onPremise.name} · 기술적 판단`],
      blocks: [
        { type: 'text', text: `${name}은 정보보안 전공자라서, 보안을 별도 작업이 아니라 기능 설계의 일부로 다뤄요. 기록에 남은 예를 들어 볼게요.` },
        { type: 'list', items: [
          `운영 admin은 일반 443 포트에서 막고, 전용 TLS 리스너(19091)와 IP 허용목록, QR 기반 MFA로만 열리게 했어요.`,
          `관리자 접근 IP 허용목록이 문자열로 비교되던 문제를 찾아, 주소를 파싱해 CIDR 범위로 판정하도록 고치고 테스트를 추가했어요.`,
          `AI 비서에 문서 검색을 붙일 때, 문서 속 악성 지시(프롬프트 인젝션)를 데이터로만 다루도록 인용 규약을 함께 넣고 실제 공격 문서로 확인했어요.`,
        ] },
      ],
      sources: ([{ label: '운영 admin 격리 TLS 리스너 커밋', url: evidenceUrl(0, '운영 admin') }, { label: onPremise.name, view: view(1) }, { label: 'Experience', view: 'experience' }] as AgentSource[]).filter((source) => source.view || source.url),
      suggestions: ['IP 허용목록은 어떻게 고쳤나요?', 'RAG를 붙일 때 인젝션은 어떻게 막았나요?', '왜 뽑아야 하나요?'],
    }
    case 'projects': return {
      checked: projects.map((project) => project.name),
      blocks: [{ type: 'text', text: `${name}의 프로젝트는 ${projects.length}개예요. 대표 프로젝트는 ${projects.filter((project) => project.featured).map((project) => project.name).join('와 ')}이에요. 카드를 누르면 자세한 기록으로 안내해 드릴게요.` }, { type: 'projects' }],
      sources: [],
      suggestions: ['GearVia에서 가장 중요한 판단은?', 'On-Premise 설치 중 생긴 문제는?', '팀에서 어떤 역할을 했나요?'],
    }
    case 'stack': return {
      checked: stack.map(([label]) => label),
      blocks: [
        { type: 'text', text: `주력은 Java · Spring Boot 백엔드예요. ${name}은 기술 이름보다 어디에 썼는지를 중요하게 생각해서, 분야별로 쓰임새와 함께 정리해 드릴게요.` },
        ...stack.map(([label, technologies, description]) => ({ type: 'point' as const, title: `${label} — ${technologies}`, text: description, source: '기술 스택' })),
      ],
      sources: [{ label: 'Core Stack', view: 'stack' }],
      suggestions: ['Spring Security는 어디에 썼나요?', 'AI는 어떻게 활용했나요?', '어떤 프로젝트를 했나요?'],
    }
    case 'experience': return {
      checked: experience.map(([, value]) => value),
      blocks: [
        { type: 'text', text: `${name}의 학력과 활동 기록이에요.` },
        ...experience.map(([label, value, description]) => ({ type: 'point' as const, title: value, text: description, source: label })),
      ],
      sources: [{ label: 'Experience', view: 'experience' }],
      suggestions: ['팀에서 어떤 역할을 했나요?', '보안 관련 경험이 있나요?', '어떤 프로젝트를 했나요?'],
    }
    case 'contact': return {
      checked: ['연락처'],
      blocks: [
        { type: 'text', text: `${name}께는 이메일로 연락하시는 게 가장 빨라요. 아래에서 바로 메일을 보내시거나, 남기실 말씀을 적어 주시면 제가 메일로 정리해 드릴게요.` },
        { type: 'contact' },
        { type: 'handoff', question: '' },
      ],
      sources: [{ label: 'Contact', view: 'contact' }],
      suggestions: ['왜 뽑아야 하나요?', '어떤 프로젝트를 했나요?'],
    }
    default: return null
  }
}

/* ---------- 기록 검색 답변 ---------- */

function trimSentences(text: string, max = 230) {
  if (text.length <= max) return text
  const cut = text.slice(0, max)
  const end = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('니다.'))
  return (end > 80 ? cut.slice(0, end + (cut.slice(end).startsWith('니다.') ? 3 : 1)) : cut.trimEnd() + '…').trim()
}

const sourceOf = (chunk: KnowledgeChunk): AgentSource => ({ label: chunk.source, view: chunk.view, url: chunk.url })
const uniqueSources = (sources: AgentSource[]) => sources.filter((source, index) => sources.findIndex((other) => other.label === source.label) === index)

function followupsFor(focus: number[], asked: string): string[] {
  const byProject: Record<string, string[]> = {
    GearVia: ['그룹 격리를 왜 SQL로 했나요?', 'AI 주간 보고서는 어떻게 검증했나요?', '벡터 DB 없이 시작한 이유는?'],
    'GearVia On-Premise': ['On-Premise 설치 중 생긴 문제는?', 'AI 설정을 관리자 화면으로 옮긴 이유는?', 'IP 허용목록은 어떻게 고쳤나요?'],
    MOIDA: ['MOIDA에서 인증은 어떻게 구현했나요?', 'AWS 배포는 어떻게 구성했나요?'],
  }
  const fallback = ['강점이 뭔가요?', '가장 어려웠던 문제는?', '연락은 어떻게 하나요?']
  return [...focus.flatMap((index) => byProject[projects[index].name] ?? []), ...fallback].filter((question, index, list) => question !== asked && list.indexOf(question) === index).slice(0, 3)
}

function understandStep(intent: Intent, focus: number[], keywords: string[]): AgentStep {
  const parts = [`의도: ${intentLabels[intent]}`]
  if (focus.length) parts.push(`대상: ${focus.map((index) => projects[index].name).join(', ')}`)
  const shown = keywords.filter((keyword) => keyword.length > 1).slice(0, 5)
  if (intent === 'search' && shown.length) parts.push(`키워드: ${shown.join(', ')}`)
  return { label: '질문 이해', detail: parts.join(' · ') }
}

/**
 * @param contextProject 프로젝트 화면에서 물어본 경우 그 프로젝트 이름. 질문에 프로젝트가 없으면 이 프로젝트 기록을 우선 찾습니다.
 */
export function runAgent(rawQuestion: string, contextProject?: string): AgentRun {
  const question = rawQuestion.trim().slice(0, 300)
  const intent = detectIntent(question)
  const scoped = contextProject && mentionedProjects(question).length === 0 ? `${contextProject} ${question}` : question
  const { results, keywords, focus, total } = search(scoped)
  const steps: AgentStep[] = [understandStep(intent, focus, keywords)]

  const curated = curatedAnswer(intent)
  if (curated) {
    const { checked, ...answer } = curated
    steps.push({ label: '기록 확인', detail: `관련 기록 ${checked.length}건`, items: checked })
    steps.push({ label: '답변 정리', detail: '태욱 님이 정리해 둔 내용 기준' })
    return { intent, steps, ...answer }
  }

  steps.push({ label: '기록 검색', detail: `기록 ${total}개 중 ${results.length}건 일치`, items: results.map((chunk) => chunk.source) })

  if (!results.length) {
    steps.push({ label: '전달 준비', detail: '기록 밖 질문이라 태욱 님께 전달' })
    return {
      intent: 'unknown', steps,
      blocks: [
        { type: 'text', text: `그 부분은 제가 가진 기록에 없어서, 짐작으로 답하지 않을게요. 대신 ${name}께 이 질문을 그대로 전달해 드릴 수 있어요.` },
        { type: 'handoff', question },
      ],
      sources: [],
      suggestions: ['임태욱은 어떤 개발자인가요?', '어떤 프로젝트를 했나요?', '강점이 뭔가요?'],
    }
  }

  steps.push({ label: '답변 정리', detail: `근거 ${results.length}건으로 정리` })
  const projectSet = [...new Set(results.map((chunk) => chunk.projectIndex).filter((index): index is number => index !== undefined))]
  const lead = projectSet.length === 1
    ? `${name}의 ${projects[projectSet[0]].name} 기록에서 찾아봤어요. 관련된 내용은 이렇습니다.`
    : `${name}의 기록에서 관련된 내용을 찾아봤어요.`
  return {
    intent, steps,
    blocks: [
      { type: 'text', text: lead },
      ...results.map((chunk) => ({ type: 'point' as const, title: chunk.title, text: trimSentences(chunk.text), source: chunk.source, url: chunk.url })),
      { type: 'text', text: '아래 근거를 누르시면 원래 기록으로 바로 안내해 드릴게요. 더 깊은 이야기가 필요하면 태욱 님께 직접 전달해 드릴 수도 있어요.' },
    ],
    sources: uniqueSources(results.map(sourceOf)),
    suggestions: followupsFor(focus, question),
  }
}

export { search }

export const starterQuestions = ['임태욱은 어떤 개발자인가요?', '왜 뽑아야 하나요?', '가장 어려웠던 문제는?', 'AI는 어떻게 활용했나요?']
