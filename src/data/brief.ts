import { profile } from './profile'
import { projects } from './projects'

/**
 * 채용 담당자용 30초 요약 카드.
 * 문장은 짧게 다듬었지만, 사실(숫자·결정·링크)은 projects.ts와 PR 기록에 있는 것만 씁니다.
 */
export interface BriefFlowStep { label: string; tone?: 'muted' | 'block' | 'ok' }

export interface BriefSlide {
  id: string
  eyebrow: string
  title: string
  body: string
  /** 큰 숫자 하나로 요약할 수 있는 카드 */
  stat?: { value: string; label: string }[]
  /** 짧은 흐름도 (왼쪽 → 오른쪽) */
  flow?: BriefFlowStep[]
  tags?: string[]
  source?: { label: string; url?: string; view?: string }
}

const [gearvia, onPremise] = projects
const evidence = (projectIndex: number, label: string) => projects[projectIndex].evidence?.find((item) => item.label.startsWith(label))?.url
const commitCount = onPremise.evidence?.find((item) => item.label.startsWith('기여 커밋'))?.label.match(/\d+/)?.[0]

export const briefSlides: BriefSlide[] = [
  {
    id: 'who',
    eyebrow: 'WHO',
    title: '보안을 아는\n백엔드 개발자',
    body: `정보보안 전공. Java · Spring Boot로 서비스를 만들고, 그 위에 AI · RAG를 실제 업무 흐름에 연결해 왔습니다.`,
    tags: ['Java 21', 'Spring Boot', 'Spring Security', 'RAG', 'MySQL', 'Docker'],
  },
  {
    id: 'gearvia-problem',
    eyebrow: `${gearvia.name} · 문제`,
    title: 'AI 비서에게\n문서를 읽히면\n생기는 일',
    body: '누구나 올릴 수 있는 문서 본문이, 초대 링크·알림 같은 도구를 가진 비서의 프롬프트로 그대로 들어갑니다.',
    flow: [{ label: '업로드 문서' }, { label: '프롬프트' }, { label: '도구 실행', tone: 'block' }],
    source: { label: `${gearvia.name} 케이스 스터디`, view: 'project-0' },
  },
  {
    id: 'gearvia-citation',
    eyebrow: `${gearvia.name} · 판단 1`,
    title: '검색을 붙이는 커밋에\n방어도 같이 넣었습니다',
    body: '검색 결과는 quoted_text 아래 "데이터"로만 전달. 인젝션 문서를 넣어 확인한 결과, 비서는 인용만 하고 실행하지 않았습니다.',
    flow: [{ label: '문서 본문' }, { label: 'quoted_text' }, { label: '인용만', tone: 'ok' }],
    source: { label: 'RAG 검색과 인용 규약 커밋', url: evidence(0, 'RAG 검색과') },
  },
  {
    id: 'gearvia-isolation',
    eyebrow: `${gearvia.name} · 판단 2`,
    title: '권한 경계는\n모델이 아니라\n서버가 정합니다',
    body: '검색 도구 인자에서 groupId를 없애고, 인증된 현재 그룹을 SQL where 절로 제한했습니다. 프롬프트 한 줄로 무너지지 않게.',
    flow: [{ label: 'LLM', tone: 'muted' }, { label: '인증된 그룹' }, { label: 'SQL where', tone: 'ok' }],
    source: { label: `${gearvia.name} 기술적 판단`, view: 'project-0' },
  },
  {
    id: 'onpremise',
    eyebrow: onPremise.name,
    title: 'SaaS를 기업 내부\n서버에 설치되게',
    body: '관리자 콘솔 · 스토리지 전환 · AI 설정 · 설치 자동화를 담당. 설치 후 로그인 403 장애를 주소 감지 수정으로 해결했습니다.',
    stat: [
      ...(commitCount ? [{ value: commitCount, label: '기여 커밋' }] : []),
      { value: '403→200', label: '설치 후 로그인' },
    ],
    source: { label: '기여 커밋 이력', url: evidence(1, '기여 커밋') },
  },
  {
    id: 'contact',
    eyebrow: 'CONTACT',
    title: '더 궁금하시면\n바로 연락 주세요',
    body: `${profile.name} · ${profile.role}`,
  },
]
