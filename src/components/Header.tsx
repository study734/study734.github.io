import { useState } from 'react'
import { MenuIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

const navigationItems = [
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Stack', href: '#stack' },
  { label: 'GitHub', href: 'https://github.com/study734', external: true },
]

export function Header() {
  const [isNavigationOpen, setIsNavigationOpen] = useState(false)

  return (
    <header className="site-header">
      <a className="brand" href="#top" aria-label="임태욱 포트폴리오 홈">TW</a>
      <nav className="desktop-navigation" aria-label="Portfolio navigation">
        {navigationItems.map(({ label, href, external }) => (
          <a key={label} href={href} target={external ? '_blank' : undefined} rel={external ? 'noreferrer' : undefined}>
            {label}
          </a>
        ))}
      </nav>
      <Sheet open={isNavigationOpen} onOpenChange={setIsNavigationOpen}>
        <SheetTrigger asChild>
          <Button className="mobile-menu-trigger" variant="outline" size="icon" type="button" aria-label="Open navigation">
            <MenuIcon aria-hidden="true" />
            <span className="sr-only">Open navigation</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="mobile-navigation-sheet">
          <SheetHeader>
            <SheetTitle>Navigate</SheetTitle>
            <SheetDescription>Move between portfolio sections.</SheetDescription>
          </SheetHeader>
          <nav className="mobile-navigation" aria-label="Mobile portfolio navigation" onClick={() => setIsNavigationOpen(false)}>
            {navigationItems.map(({ label, href, external }) => (
              <a key={label} href={href} target={external ? '_blank' : undefined} rel={external ? 'noreferrer' : undefined}>
                {label}
              </a>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  )
}
