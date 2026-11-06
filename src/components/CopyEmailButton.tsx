import { useEffect, useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { profile } from '../data/profile'
import { trackEvent } from '../lib/analytics'

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    // 클립보드 API가 막힌 환경(오래된 브라우저, 비보안 연결)을 위한 대체 경로
    const field = document.createElement('textarea')
    field.value = text
    field.setAttribute('readonly', '')
    field.style.position = 'fixed'
    field.style.opacity = '0'
    document.body.appendChild(field)
    field.select()
    const ok = document.execCommand?.('copy') ?? false
    field.remove()
    return ok
  }
}

/** 메일 앱이 없는 환경(회사 PC 등)에서도 연락할 수 있게 주소를 복사합니다. */
export function CopyEmailButton({ className = '' }: { className?: string }) {
  const [state, setState] = useState<'idle' | 'copied' | 'failed'>('idle')
  useEffect(() => {
    if (state === 'idle') return
    const timer = window.setTimeout(() => setState('idle'), 2000)
    return () => window.clearTimeout(timer)
  }, [state])

  return (
    <button
      type="button"
      className={`copy-email ${className}`}
      onClick={async () => {
        const ok = await copyText(profile.email)
        setState(ok ? 'copied' : 'failed')
        if (ok) trackEvent('copy-email')
      }}
    >
      {state === 'copied' ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
      <span aria-live="polite">{state === 'copied' ? '복사했어요' : state === 'failed' ? profile.email : '이메일 주소 복사'}</span>
    </button>
  )
}
