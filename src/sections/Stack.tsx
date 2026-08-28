const stack = [
  ['Backend', 'Java · Spring Boot · Spring Security · JPA / QueryDSL'],
  ['Frontend', 'React · TypeScript · Vite'],
  ['Database', 'MySQL'],
  ['AI', 'OpenAI API · RAG'],
  ['Infra', 'Docker · Nginx · GitHub Actions · AWS'],
]

export function Stack() {
  return (
    <section className="support-section" id="stack" aria-labelledby="stack-title">
      <div className="section-title-row">
        <span>04</span>
        <h2 id="stack-title">Core Stack</h2>
      </div>
      <div className="stack-list">
        {stack.map(([label, technologies]) => (
          <div className="stack-row" key={label}>
            <span>{label}</span>
            <p>{technologies}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
