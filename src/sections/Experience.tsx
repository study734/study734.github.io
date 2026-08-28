const experience = [
  ['Education', '대전대학교 정보보안학과'],
  ['Scholarship', '성적우수장학금 2회'],
  ['Award', '교내 공모전 최우수상'],
  ['Team Role', '팀 프로젝트 부팀장 경험'],
  ['Training', '웹 개발 및 정보보안 교육 이수'],
]

export function Experience() {
  return (
    <section className="support-section" id="experience" aria-labelledby="experience-title">
      <div className="section-title-row">
        <span>03</span>
        <h2 id="experience-title">Experience</h2>
      </div>
      <div className="experience-list">
        {experience.map(([label, value]) => (
          <div className="experience-row" key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>
    </section>
  )
}
