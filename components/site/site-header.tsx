'use client'

import Link from 'next/link'
import { ThemeToggle } from '@/components/theme-toggle'

export function SiteHeader({ name }: { name: string }) {
  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
        <Link
          href="/"
          className="font-serif text-lg tracking-tight text-foreground"
        >
          {name}
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          <a
            href="/#work"
            className="hidden rounded-md px-3 py-1.5 text-muted-foreground transition-colors hover:text-foreground sm:inline-block"
          >
            Work
          </a>
          <a
            href="/#about"
            className="hidden rounded-md px-3 py-1.5 text-muted-foreground transition-colors hover:text-foreground sm:inline-block"
          >
            About
          </a>
          <a
            href="/#contact"
            className="hidden rounded-md px-3 py-1.5 text-muted-foreground transition-colors hover:text-foreground sm:inline-block"
          >
            Contact
          </a>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}
