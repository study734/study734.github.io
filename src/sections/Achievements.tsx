import { SectionHeading } from '../components/SectionHeading'

const achievements = [
  ['Education', '대전대학교 정보보안학과'],
  ['Scholarship', '성적우수장학금 2회'],
  ['Award', '교내 공모전 최우수상'],
  ['Collaboration', '팀 프로젝트 부팀장 경험'],
]

export function Achievements() {
  return (
    <section className="section" id="achievements" aria-labelledby="achievements-title">
      <SectionHeading eyebrow="Background" title="Achievements" />
      <div className="achievement-list">
        {achievements.map(([label, value]) => (
          <div className="achievement-row" key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>
    </section>
  )
}
