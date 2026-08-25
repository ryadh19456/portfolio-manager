'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ThemeToggle } from '@/components/theme-toggle'
import { Editable } from '@/components/admin/editable'
import { SettingsEditor } from '@/components/admin/editors/settings-editor'
import type { SiteSettings } from '@/lib/content-types'

export function SiteHeader({ name, settings }: { name: string; settings: SiteSettings }) {
  const [open, setOpen] = useState(false)
  const navItems = settings.navItems?.length ? settings.navItems : [
    { label: 'Work', href: '/#work' },
    { label: 'About', href: '/#about' },
    { label: 'Contact', href: '/#contact' },
  ]

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
          <Link href="/" className="font-serif text-lg tracking-tight text-foreground">
            {name}
          </Link>

          <Editable label="navigation" onEdit={() => setOpen(true)}>
            <nav className="flex items-center gap-1 text-sm">
              {navItems.map((item) => (
                <a
                  key={`${item.label}-${item.href}`}
                  href={item.href}
                  className="hidden rounded-md px-3 py-1.5 text-muted-foreground transition-colors hover:text-foreground sm:inline-block"
                >
                  {item.label}
                </a>
              ))}
              <ThemeToggle />
            </nav>
          </Editable>
        </div>
      </header>

      <SettingsEditor open={open} onOpenChange={setOpen} settings={settings} />
    </>
  )
}
