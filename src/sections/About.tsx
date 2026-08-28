import { SectionHeading } from '../components/SectionHeading'

export function About() {
  return (
    <section className="section" id="about" aria-labelledby="about-title">
      <SectionHeading
        eyebrow="About"
        title="About"
        description="기능을 만드는 것에서 끝내지 않고, 실제 운영에서 안전하게 동작하는 조건까지 함께 봅니다."
      />
      <div className="about-grid">
        <p className="about-lead">
          인증·권한·검증·실패 처리·운영·복구까지 연결해서 생각하는 개발자가 되고자 합니다.
        </p>
        <div className="about-copy">
          <p>
            정보보안 전공에서 익힌 보안 관점을 웹 개발에 적용하고, 정상 흐름뿐 아니라 잘못된 요청과
            실패 상황에서도 시스템이 예측 가능하게 동작하도록 설계하는 데 관심이 있습니다.
          </p>
          <p>
            특히 AI Agent가 실제 시스템 상태를 변경하는 환경에서는 모델의 판단보다 권한 검증,
            승인, 추적, 격리와 복구 구조가 중요하다고 보고 있습니다.
          </p>
        </div>
      </div>
    </section>
  )
}
