'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Pencil } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { LanguageToggle } from '@/components/site/language-toggle'
import { useLanguage } from '@/components/site/language-provider'
import { useAdmin } from '@/components/admin/admin-provider'
import { SettingsEditor } from '@/components/admin/editors/settings-editor'
import { Button } from '@/components/ui/button'
import type { SiteSettings } from '@/lib/content-types'

export function SiteHeader({ name, settings }: { name: string; settings: SiteSettings }) {
  const { localize, translateContent } = useLanguage()
  const { editMode } = useAdmin()
  const [settingsOpen, setSettingsOpen] = useState(false)
  const displayedSettings = translateContent(settings)
  const navItems = displayedSettings.navItems?.length ? displayedSettings.navItems : [
    { label: 'Work', href: '/#work' },
    { label: 'About', href: '/#about' },
    { label: 'Contact', href: '/#contact' },
  ]

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
          <Link href="/" className="font-serif text-lg tracking-tight text-foreground">
            {displayedSettings.siteTitle || localize(name)}
          </Link>

          <nav className="flex items-center gap-1 text-sm">
              {navItems.map((item) => (
                <a
                  key={`${item.label}-${item.href}`}
                  href={item.href}
                  className="hidden rounded-md px-3 py-1.5 text-muted-foreground transition-colors hover:text-foreground sm:inline-block"
                >
                  {localize(item.label)}
                </a>
              ))}
              {editMode ? (
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  aria-label="Edit site settings"
                  title="Edit site settings"
                  onClick={() => setSettingsOpen(true)}
                >
                  <Pencil className="size-4" />
                </Button>
              ) : null}
              <LanguageToggle />
              <ThemeToggle />
          </nav>
        </div>
      </header>
      <SettingsEditor
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        settings={settings}
      />
    </>
  )
}
