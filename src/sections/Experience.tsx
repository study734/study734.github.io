import { experience } from '../data/profile'

export function Experience() {
  return (
    <section className="detail-view" id="experience" aria-labelledby="experience-title">
      <header className="view-header"><div><p className="eyebrow">PROFILE / EXPERIENCE</p><h1 id="experience-title">Experience</h1><p>역할보다 실제로 맡고 연결한 일을 중심으로 기록합니다.</p></div></header>
      <div className="detail-list">
        {experience.map(([label, value, description], index) => <article key={label}><span>{String(index + 1).padStart(2, '0')}</span><div><small>{label}</small><h2>{value}</h2><p>{description}</p></div></article>)}
      </div>
    </section>
  )
}
