import { stack } from '../data/profile'

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
