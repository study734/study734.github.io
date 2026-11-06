import { ArrowUpRight, GitBranch, Mail } from 'lucide-react'
import { mailtoUrl, profile } from '../data/profile'

export function Contact() {
  return (
    <section className="detail-view contact-view" id="contact" aria-labelledby="contact-title">
      <header className="view-header"><div><p className="eyebrow">PROFILE / CONTACT</p><h1 id="contact-title">Let’s build<br />something useful.</h1><p>프로젝트와 구현 기록은 GitHub에서 확인할 수 있습니다.</p></div></header>
      <div className="contact-actions">
        <a href={profile.githubUrl} target="_blank" rel="noreferrer"><GitBranch aria-hidden="true" /><span><small>CODE & PROJECTS</small>github.com/{profile.githubHandle}</span><ArrowUpRight aria-hidden="true" /></a>
        <a href={mailtoUrl}><Mail aria-hidden="true" /><span><small>EMAIL</small>{profile.email}</span><ArrowUpRight aria-hidden="true" /></a>
      </div>
    </section>
  )
}
