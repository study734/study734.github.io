const experience = [
  ['Education', '대전대학교 정보보안학과', '보안 관점에서 시스템과 데이터를 이해하는 기반'],
  ['Leadership', '팀 프로젝트 부팀장', '요구사항 정리, 기능 통합, 협업 방식 지원'],
  ['Recognition', '성적우수장학금 2회', '꾸준한 학업 성취와 전공 역량'],
  ['Award', '교내 공모전 최우수상', '아이디어를 결과물로 구체화한 경험'],
  ['Training', '웹 개발 및 정보보안 교육', '제품 구현과 보안 기초를 함께 확장'],
]

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
