const stack = [
  ['Backend', 'Java · Spring Boot · Spring Security · JPA / QueryDSL', '서비스의 핵심 흐름과 권한 구조를 설계합니다.'],
  ['Frontend', 'React · TypeScript · Vite', '아이디어를 직접 확인 가능한 화면으로 연결합니다.'],
  ['Data', 'MySQL', '업무 데이터의 관계와 접근 경계를 다룹니다.'],
  ['AI', 'OpenAI API · RAG', 'AI 기능을 실제 제품 흐름에 맞게 통합합니다.'],
  ['Infra', 'Docker · Nginx · GitHub Actions · AWS', '로컬 구현 이후의 실행 환경까지 고려합니다.'],
]

export function Stack() {
  return (
    <section className="detail-view" id="stack" aria-labelledby="stack-title">
      <header className="view-header"><div><p className="eyebrow">PROFILE / CAPABILITIES</p><h1 id="stack-title">Core Stack</h1><p>기술 이름보다 어떤 문제에 사용했는지를 더 중요하게 생각합니다.</p></div></header>
      <div className="stack-grid">
        {stack.map(([label, technologies, description], index) => <article key={label}><span>{String(index + 1).padStart(2, '0')}</span><small>{label}</small><h2>{technologies}</h2><p>{description}</p></article>)}
      </div>
    </section>
  )
}
