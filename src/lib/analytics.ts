import { track } from '@vercel/analytics'

type EventProps = Record<string, string | number | boolean | null>

/**
 * 방문자가 비서와 어떻게 대화하는지 Vercel Web Analytics에 남깁니다.
 * 분석 스크립트가 없거나 막혀 있어도 사이트 동작에는 영향을 주지 않습니다.
 */
export function trackEvent(name: 'ask' | 'unanswered' | 'audience' | 'handoff' | 'copy-email', props?: EventProps) {
  try {
    track(name, props)
  } catch {
    /* 분석 실패는 무시합니다 */
  }
}
