'use client'

import { useState } from 'react'
import { ArrowDown, MapPin } from 'lucide-react'
import type { HeroContent, SocialLink } from '@/lib/content-types'
import { Editable } from '@/components/admin/editable'
import { HeroEditor } from '@/components/admin/editors/hero-editor'
import { SocialIcon } from './social-icon'

export function HeroSection({
  hero,
  socials,
}: {
  hero: HeroContent
  socials: SocialLink[]
}) {
  const [open, setOpen] = useState(false)

  return (
    <section className="mx-auto max-w-5xl px-6 pt-20 pb-16 sm:pt-28 sm:pb-24">
      <Editable label="intro" onEdit={() => setOpen(true)}>
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-1 flex-col gap-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-60" />
                <span className="relative inline-flex size-2 rounded-full bg-accent" />
              </span>
              {hero.availability}
            </div>

            <h1 className="max-w-3xl text-balance font-serif text-5xl leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
              {hero.headline}
            </h1>

            <p className="max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
              {hero.intro}
            </p>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">
                {hero.name}
              </span>
              <span>{hero.role}</span>
              {hero.location ? (
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="size-3.5" />
                  {hero.location}
                </span>
              ) : null}
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-3">
              {hero.ctaLabel ? (
                <a
                  href={hero.ctaHref || '#work'}
                  className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90"
                >
                  {hero.ctaLabel}
                  <ArrowDown className="size-4" />
                </a>
              ) : null}
              {hero.secondaryCtaLabel ? (
                <a
                  href={hero.secondaryCtaHref || '#contact'}
                  className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-secondary"
                >
                  {hero.secondaryCtaLabel}
                </a>
              ) : null}
              <div className="ml-auto flex items-center gap-1">
                {socials.map((s) => (
                  <a
                    key={s.id}
                    href={s.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                    aria-label={s.label}
                  >
                    <SocialIcon icon={s.icon} className="size-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {hero.avatarUrl ? (
            <div className="relative shrink-0">
              <div className="h-48 w-48 overflow-hidden rounded-full border border-border bg-secondary shadow-sm sm:h-56 sm:w-56">
                <img src={hero.avatarUrl} alt={hero.name || 'Profile'} className="h-full w-full object-cover" />
              </div>
            </div>
          ) : null}
        </div>
      </Editable>

      <HeroEditor open={open} onOpenChange={setOpen} hero={hero} />
    </section>
  )
}
