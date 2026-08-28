import { SectionHeading } from '../components/SectionHeading'

export function Contact() {
  return (
    <section className="section contact-section" id="contact" aria-labelledby="contact-title">
      <SectionHeading
        eyebrow="Contact"
        title="Contact"
        description="프로젝트 코드와 개발 기록은 GitHub에서 확인할 수 있습니다."
      />
      <a className="contact-link" href="https://github.com/study734" target="_blank" rel="noreferrer">
        github.com/study734 <span aria-hidden="true">↗</span>
      </a>
    </section>
  )
}
