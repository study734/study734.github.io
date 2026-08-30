import { Button } from '@/components/ui/button'

export function Intro() {
  return (
    <section className="intro" id="top" aria-labelledby="intro-title">
      <p className="intro-kicker">PORTFOLIO / 2026</p>
      <h1 id="intro-title">임태욱</h1>
      <p className="intro-role">Java / Spring Boot Backend Developer</p>
      <p className="intro-copy">
        정보보안을 전공하고 Java·Spring Boot 기반 웹 서비스를 개발하고 있습니다. 실제 업무 흐름과 AI·RAG를 연결하는 구현 경험에도 관심을 갖고 있습니다.
      </p>
      <div className="intro-actions">
        <Button asChild className="intro-action-button" variant="outline" size="lg">
          <a href="#projects">Projects</a>
        </Button>
        <Button asChild className="intro-action-button" variant="ghost" size="lg">
          <a href="https://github.com/study734" target="_blank" rel="noreferrer">GitHub →</a>
        </Button>
      </div>
    </section>
  )
}
