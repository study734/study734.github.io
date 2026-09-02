import { ArrowUpRight, GitBranch, Mail } from 'lucide-react'

export function Contact() {
  return (
    <section className="detail-view contact-view" id="contact" aria-labelledby="contact-title">
      <header className="view-header"><div><p className="eyebrow">PROFILE / CONTACT</p><h1 id="contact-title">Let’s build<br />something useful.</h1><p>프로젝트와 구현 기록은 GitHub에서 확인할 수 있습니다.</p></div></header>
      <div className="contact-actions">
        <a href="https://github.com/study734" target="_blank" rel="noreferrer"><GitBranch aria-hidden="true" /><span><small>CODE & PROJECTS</small>github.com/study734</span><ArrowUpRight aria-hidden="true" /></a>
        <a href="mailto:study734@github.com"><Mail aria-hidden="true" /><span><small>CONTACT</small>메일 보내기</span><ArrowUpRight aria-hidden="true" /></a>
      </div>
    </section>
  )
}
