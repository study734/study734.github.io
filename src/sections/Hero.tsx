export function Hero() {
  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <p className="eyebrow">Backend · Security · AI Integration</p>
      <h1 id="hero-title">
        임태욱
        <span>Backend &amp; AI-integrated Web Developer</span>
      </h1>
      <p className="hero-copy">
        정보보안을 전공하며 Java · Spring Boot 기반 웹 서비스를 개발하고 있습니다. AI Agent와 RAG를
        실제 서비스의 업무 흐름에 안전하게 연결하는 구조에 관심이 있습니다.
      </p>
      <div className="hero-actions">
        <a className="primary-button" href="#projects">
          View Projects
        </a>
        <a className="secondary-button" href="https://github.com/study734" target="_blank" rel="noreferrer">
          GitHub
        </a>
      </div>
      <div className="hero-principles" aria-label="Engineering focus">
        <span>Permission</span>
        <span>Validation</span>
        <span>Failure Handling</span>
        <span>Recovery</span>
      </div>
    </section>
  )
}
