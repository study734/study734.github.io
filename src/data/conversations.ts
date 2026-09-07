import type { ProjectThread } from './projects'

export interface Exchange { question: string; answer: string; stage: string }
export interface Conversation { problem: string; outcome: string; exchanges: Exchange[]; decision: string; limitation: string; source?: string }

const records: Record<string, Conversation> = {
  'AI 주간 보고서는 어떻게 검증했나요?': {
    problem: 'AI 보고서 생성 실패와 재생성을 처리하면서 결과를 다시 조회·다운로드할 수 있어야 했습니다.',
    outcome: '응답 검증·fallback·revision 관리 흐름을 구현했습니다. PR에 자동 테스트 기록이 있으며 운영 AI 생성·다운로드는 별도 점검 대상입니다.',
    exchanges: [
      { stage: '작업 요청', question: '이번 주 업무를 정리하는 보고서를 자동으로 만들고 싶어.', answer: '업무 활동·체크리스트·주간 목표를 보고서 입력으로 묶었습니다. 기본 보고서는 PDF로, AI 분석 보고서는 인쇄용 HTML로 제공하는 흐름입니다.' },
      { stage: '설계 판단', question: 'AI가 만든 결과를 그대로 보여줘도 괜찮을까?', answer: '구조화 출력 계약을 정의하고 응답을 검증하도록 했습니다. 검증·복구·fallback을 연결해 생성 실패를 처리하고, 결과를 저장해 다시 조회할 수 있게 구성했습니다.' },
      { stage: '조건 조율', question: '다시 생성했을 때 이전 결과도 확인할 수 있었으면 해.', answer: '생성 결과에 revision을 관리했습니다. 비용이 발생하는 생성 API에는 요청 제한을 두고, 화면에서도 생성·조회·다운로드 상태를 구분했습니다.' },
      { stage: '검증 기록', question: '어디까지 확인했고, 무엇이 남았어?', answer: 'PR에는 당시 백엔드 280개 테스트, 프론트엔드 빌드, MySQL/Flyway 검증 통과가 기록돼 있습니다. 실제 AI 모드와 운영 다운로드 확인은 별도 배포 점검 항목으로 구분했습니다. 현재 시점의 재실행 결과는 아닙니다.' },
    ],
    decision: 'HTML을 AI 보고서의 정본으로 통일했습니다. 브라우저별 임시 팝업이나 클라이언트 PDF 생성 경로를 줄이고 서버의 생성·저장·다운로드 흐름을 연결한 선택입니다.',
    limitation: '구조 검증이 내용의 사실성까지 보장하지는 않습니다. 실제 업무 데이터와 분석의 일치 여부, 운영 키를 사용한 생성·다운로드는 별도 확인이 필요합니다.',
    source: 'https://github.com/HO-0219/WorkTaskFlow/pull/2',
  },
  'Java RAG 브랜치에서 맡은 역할': {
    problem: '팀 문서에서 근거를 찾아 답변하되 다른 그룹의 자료가 검색되지 않아야 했습니다.',
    outcome: '인증된 그룹 범위 검색과 원문 인용을 구현했습니다. PR에 파일 업로드·인용 확인 및 격리 테스트 기록이 있습니다.',
    exchanges: [
      { stage: '작업 요청', question: '팀에서 올린 문서를 AI 비서가 찾아서 답하게 만들자.', answer: 'PDF·Office·텍스트 자료에서 본문을 추출하고, 청킹·임베딩·검색을 거쳐 원문 인용을 제공하는 흐름을 추가했습니다. 표는 열 이름과 값을 함께 보존하도록 처리했습니다.' },
      { stage: '접근 경계', question: '다른 팀 자료가 검색되면 안 돼. 검색 범위는 누가 정하지?', answer: '서버의 인증된 현재 그룹으로 제한했습니다. AI 도구 인자에는 그룹 ID를 노출하지 않고, 재색인과 컨텍스트 조회에도 활성 멤버십을 확인합니다.' },
      { stage: '기술 선택', question: '처음부터 별도 벡터 데이터베이스가 필요할까?', answer: '작은 그룹 문서 규모를 전제로 MySQL에 임베딩을 저장하고 Java에서 유사도를 계산했습니다. 검색 결과에는 파일명·점수·인용문을 포함합니다. 조회 상한은 5,000개 청크라 대규모 검색용 설계는 아닙니다.' },
      { stage: '실패 처리', question: '색인에 실패하거나 문서를 삭제하면 어떻게 돼?', answer: 'PR의 후속 수정에는 자동 색인 실패 재시도와 임베딩 모델 메타데이터 보강이 기록돼 있습니다. 삭제 자료의 검색 제외와 그룹 격리를 테스트했고, 실패 상태를 보여주는 UI는 후속 과제로 남겼습니다.' },
      { stage: '검증 기록', question: '검색 결과가 실제 문서에서 왔는지도 확인했어?', answer: 'PR에는 실제 파일 업로드 후 인용 답변을 확인한 기록과, stub gateway 기반 자동 테스트를 구분해 적었습니다. 인용은 답변 근거를 확인하는 수단이며 답변 정확도를 보장하는 점수는 아닙니다.' },
    ],
    decision: '문서 규모와 기존 운영 환경을 고려해 MySQL을 재사용했습니다. 핵심 판단은 벡터 DB의 유무보다 인증된 그룹 경계와 원문 인용을 검색 계약에 포함한 점입니다.',
    limitation: '메모리 유사도 계산과 청크 조회 상한은 문서량 증가 시 제약입니다. 검색 품질 평가와 처리량 측정을 거쳐 별도 검색 인프라 도입 여부를 판단해야 합니다.',
    source: 'https://github.com/HO-0219/WorkTaskFlow/pull/5',
  },
  'On-Premise 설치와 운영 구조': {
    problem: 'VM 설치 후 잘못 감지된 서비스 주소 때문에 실제 사용자 로그인이 403으로 실패했습니다.',
    outcome: '주소 감지와 인증서 검증을 보완했습니다. 당시 VM에서 로그인 200과 다른 Origin 차단 유지를 확인한 기록이 있습니다.',
    exchanges: [
      { stage: '작업 요청', question: '기업 내부 Ubuntu 서버에도 설치할 수 있게 만들자.', answer: '설치 자동화에서 런타임 비밀값, 인증서, 이미지 준비, 최초 관리자 생성과 서비스 준비 상태 확인을 연결했습니다.' },
      { stage: '문제 발견', question: 'VM 설치는 끝났는데 로그인하면 403이 나와.', answer: 'PR의 장애 기록에서는 기본 경로를 가진 NAT 주소가 서비스 주소로 선택됐습니다. 실제 접속하는 Host-Only 주소와 달라 CORS 검사에서 거부된 상황입니다.' },
      { stage: '수정 판단', question: '접속만 되도록 허용 범위를 넓히는 게 맞을까?', answer: '주소 감지 기준을 수정했습니다. 명시적 주소 설정을 우선하고 컨테이너·브리지 인터페이스를 제외하며 NAT 주소는 최후 후보로 두었습니다. 인증서의 대상 주소 검증도 보완했습니다.' },
      { stage: '범위와 검증', question: '수정 결과와 이번 릴리스의 범위를 정리해줘.', answer: '당시 VM 기록은 로그인 403 → 200, 다른 Origin은 403 유지, 인증서 SAN 수정입니다. 끝까지 검증하지 못한 관리자 Domain & SSL 화면은 릴리스에서 제외했습니다.' },
    ],
    decision: '설치 성공을 프로세스 실행만으로 판단하지 않고 실제 접속 주소·인증서·로그인 흐름까지 확인하는 방향입니다. 검증되지 않은 관리 기능은 배포 범위에서 제외했습니다.',
    limitation: 'PR의 특정 VM·하드웨어 검증 기록이며 모든 네트워크 환경을 보장하지 않습니다. 해당 PR 세션에서는 백엔드·프론트엔드 전체 테스트를 다시 돌리지 않았다고 명시했습니다.',
    source: 'https://github.com/HO-0219/GearViaB2B_Version/pull/5',
  },
  '내부 데이터와 AI 연동 설계': {
    problem: '저장소·AI 설정 변경이 기존 파일 접근과 일반 사용자 기능에 일관되게 반영되지 않았습니다.',
    outcome: '파일 복사 후 저장소를 전환하고 AI 설정을 런타임에 반영했습니다. PR에 VM 파일 이동·fallback 확인 기록이 있습니다.',
    exchanges: [
      { stage: '작업 요청', question: '관리자가 화면에서 NAS와 AI 설정을 바꿀 수 있게 하자.', answer: '시작 시 고정되던 저장소와 AI 설정을 런타임에 읽는 구조로 바꿨습니다. NAS는 연결·쓰기 검사를 거친 뒤 활성화하도록 구성했습니다.' },
      { stage: '문제 발견', question: '저장소만 바꾸면 기존 첨부파일은 어떻게 돼?', answer: '처음에는 provider만 바꾸면 기존 파일이 404가 되는 문제가 있었습니다. 기존 키와 content type을 복사한 다음 활성 저장소를 바꾸고, 복사 실패 시 기존 provider를 유지하도록 보완했습니다.' },
      { stage: '연동 보완', question: '관리자 화면에서 AI 연결 성공인데 일반 사용자는 왜 못 쓸까?', answer: '일반 사용자 권한 정책과 색인 스케줄러가 이전 시작 설정을 읽고 있었습니다. 동적 설정을 읽도록 수정해 관리자 설정과 실제 사용자 기능의 상태를 연결했습니다.' },
      { stage: '검증 기록', question: '설정 화면 밖의 동작도 확인했어?', answer: 'PR에는 VM의 실제 마운트 디렉터리에서 저장소 전환·파일 이동·fallback을 확인하고, 실제 API 키로 연결을 시험한 기록이 있습니다. 모니터링도 현재 provider를 읽도록 수정했습니다.' },
    ],
    decision: '전환 전 검증 → 기존 파일 복사 → 활성 provider 변경 순서로 데이터 접근의 연속성을 지켰습니다. 관리자 화면의 성공 표시와 실제 사용자 경로를 함께 확인했습니다.',
    limitation: '기존 파일 이동은 요청 스레드에서 동기 처리합니다. 큰 데이터에서는 시간이 길어질 수 있어 작업 분리와 진행 상태·복구 설계가 후속 과제입니다.',
    source: 'https://github.com/HO-0219/GearViaB2B_Version/pull/2',
  },
}

export function conversationFor(thread: ProjectThread): Conversation {
  return records[thread.title] ?? {
    problem: thread.answer,
    outcome: '담당 범위까지 정리된 프로젝트입니다. 구체적인 결과와 검증 자료는 추가 정리 중입니다.',
    exchanges: [
      { stage: '작업 소개', question: thread.title, answer: thread.answer },
      { stage: '담당 범위', question: '이 작업에서 맡은 부분을 알려줘.', answer: thread.contributions.join(' · ') },
      { stage: '기록 확인', question: '구체적인 판단과 결과도 볼 수 있을까?', answer: '현재는 프로젝트 소개와 담당 범위까지 정리되어 있습니다. 상세한 문제 해결 과정과 검증 자료는 추가 정리 중입니다.' },
    ],
    decision: '이 작업의 대안 비교와 선택 이유는 아직 기록을 정리 중입니다.',
    limitation: '상세 검증 기록이 아직 연결되지 않았습니다. 소개된 역할을 넘어선 성과나 수치는 제시하지 않습니다.',
  }
}

export const followupQuestions = ['왜 이 방식을 선택했나요?', '실패와 한계는 무엇인가요?', '직접 맡은 부분은요?']
export function answerFollowup(thread: ProjectThread, question: string) {
  const record = conversationFor(thread)
  if (/선택|이유|왜|방식/.test(question)) return record.decision
  if (/실패|한계|문제|검증|테스트/.test(question)) return record.limitation
  if (/직접|역할|기여|담당/.test(question)) return `정리된 담당 범위는 ${thread.contributions.join(', ')}입니다. 팀 전체 기능과 구분해 보려면 연결된 PR의 변경 내용도 함께 확인해주세요.`
  return '이 질문에 해당하는 답변은 아직 작업 기록에 정리되어 있지 않습니다. 아래의 선택 이유·실패와 한계·담당 범위 질문으로 더 살펴볼 수 있습니다.'
}
