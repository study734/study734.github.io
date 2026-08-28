const navigation = [
  ['About', '#about'],
  ['Projects', '#projects'],
  ['Skills', '#skills'],
  ['Contact', '#contact'],
] as const

export function Header() {
  return (
    <header className="site-header">
      <a className="brand" href="#top" aria-label="임태욱 포트폴리오 홈">
        TW
      </a>
      <nav aria-label="Primary navigation">
        {navigation.map(([label, href]) => (
          <a key={href} href={href}>
            {label}
          </a>
        ))}
      </nav>
    </header>
  )
}
